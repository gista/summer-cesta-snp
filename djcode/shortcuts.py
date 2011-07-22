from mapdata.models import *
import StringIO
from datetime import datetime
from gpx import *


from django.contrib.gis.db.models.fields import GeometryField
#from django.contrib.gis.gdal import Envelope
from django.contrib.gis.geos import Polygon
from django.utils import simplejson
from django.http import HttpResponse
#from django.db.models.fields.related import ManyRelatedManager

# also need to check out:
# http://code.google.com/p/dojango/source/browse/trunk/dojango/util/__init__.py#82


# example usages:

"""

def a_shapes(request):
	ids = request.GET.get('ids').split(',')
	mimetype = 'text/plain' #'application/javascript; charset=utf8'
	pretty_print = True
	if ids:
		qs = WorldBorders.objects.filter(affiliates__in=ids).annotate(num_a=Count('affiliates')).filter(num_a__gt=0)
	else:
		qs = WorldBorders.objects.none()
	return render_to_geojson(qs,
		extra_attributes=['num_a','affiliates_set'],
		geom_attribute='point',
		included_fields=['id','name'],
		mimetype=mimetype,
		proj_transform=900913,
		pretty_print=pretty_print
		) 
	
def responses(qs,type_='countries',pretty_print=True,mimetype='text/plain'):
	if type_ == 'locations':
		qs = qs.geolocations()
		return render_to_geojson(qs, 
			excluded_fields=['json'], 
			geom_field='point',
			proj_transform=900913,
			mimetype=mimetype,
			pretty_print=pretty_print
			)
	elif type_ == 'affiliates': 
		qs = qs.exclude(geokeywords='').attach_locations()
		return render_to_geojson(qs,
			included_fields=['id','_geokeywords_cache'], 
			geom_attribute='point',
			extra_attributes=['name'],
			proj_transform=900913,
			mimetype=mimetype,
			pretty_print=pretty_print
			)
	elif type_ == 'countries':
		qs2 = W.objects.filter(affiliates__in=qs).annotate(num_a=Count('affiliates')).filter(num_a__gt=0)
		return render_to_geojson(qs2,
			extra_attributes=['num_a'],
			#geom_attribute='point',
			mimetype=mimetype,
			pretty_print=pretty_print
			)				 
	else:# type_ == 'countries' or type is None:
		if len(qs) > 10:
			# this is a limit, weird huh?
			# requires another all() otherwise it 
			# returns a list!
			qs = qs.all()[:10]
		return render_to_geojson(qs,
			included_fields=['id','_geokeywords_cache'],
			geom_attribute='countries.unionagg',
			extra_attributes=['name'],
			mimetype=mimetype,
			pretty_print=pretty_print
			)
"""


def render_to_geojson(query_set, geom_field=None, geom_attribute=None, extra_attributes=[],mimetype='text/plain', pretty_print=False, excluded_fields=[],included_fields=[],proj_transform=None, geom_simplify=None, bbox = None, maxfeatures=None):
	'''
	Shortcut to render a GeoJson FeatureCollection from a Django QuerySet.
	Currently computes a bbox and adds a crs member as a sr.org link.
	* maxfeatures parameter gives maximum number of rendered features based on priority field. Parameter should be instance of collections.namedtuple('MaxFeatures', ['maxfeatures', 'priority_field'])
	* bbox is boundary box (django.contrib.gis.geos.Polygon instance) which bounds rendered features (feature must be entire within boundary box)
	'''
	excluded_fields.append('_state')
	collection = {}
	if hasattr(query_set,'_meta'): # its a model instance
		fields = query_set._meta.fields
		query_set = [query_set]
	else:
		fields = query_set.model._meta.fields
	
	if geom_attribute:
		geometry_name = geom_attribute
		geo_field = None
		if '.' in geom_attribute:
			prop, meth = geom_attribute.split('.')
			if len(query_set):
				p = getattr(query_set[0],prop)
				geo_field = getattr(p,meth)
				if callable(geo_field):
					geo_field = geo_field()
		else:
			if len(query_set):
				geo_field = getattr(query_set[0],geom_attribute)
				if callable(geo_field):
					geo_field = geo_field()
		if not geo_field:
			srid = 4326
		else:
			srid = geo_field.srid

	else:
		geo_fields = [f for f in fields if isinstance(f, GeometryField)]
		
		#attempt to assign geom_field that was passed in
		if geom_field:
			#import pdb;pdb.set_trace()
			geo_fieldnames = [x.name for x in geo_fields]
			try:
				geo_field = geo_fields[geo_fieldnames.index(geom_field)]
			except:
				raise Exception('%s is not a valid geometry on this model' % geom_field)
		else:
			if not len(geo_fields):
				raise Exception('There appears to be no valid geometry on this model')
			geo_field = geo_fields[0] # no support yet for multiple geometry fields

			
		#remove other geom fields from showing up in attributes    
		if len(geo_fields) > 1:
			for field in geo_fields:
				if field.name not in excluded_fields:
					excluded_fields.append(field.name)

		geometry_name = geo_field.name
	

		srid = geo_field.srid

	if proj_transform:
		to_srid = proj_transform
	else:
		to_srid = srid
	# Gather the projection information
	crs = {}
	crs['type'] = "link"
	crs_properties = {}
	crs_properties['href'] = 'http://spatialreference.org/ref/epsg/%s/' % to_srid
	crs_properties['type'] = 'proj4'
	crs['properties'] = crs_properties 
	collection['crs'] = crs
	collection['srid'] = to_srid
	
	# Build list of features
	features = []
	if maxfeatures is not None:	#order query_set by priority field (to show only first max_feature.max_feature items)
		query_set = query_set.order_by('-' + maxfeatures.priority_field)
		query_set = query_set[:maxfeatures.maxfeatures]		#cut off every items except first max_feature.max_feature
	if query_set.distinct():
	  for item in query_set:
		feat = {}
		feat['type'] = 'Feature'
		if included_fields:
			d = {}
			for f in included_fields:
				if hasattr(item,f):
					d[f] = getattr(item,f)
		else:
			d = item.__dict__.copy()
			for field in excluded_fields:
					if field in d.keys():
						d.pop(field)
			if geometry_name in d:
				d.pop(geometry_name)

		for attr in extra_attributes:
			a = getattr(item,attr)
			# crappy way of trying to figure out it this is a
			# m2m, aka 'ManyRelatedManager'
			if hasattr(a,'values_list'):
				a = list(a.values_list('id',flat=True))
			if callable(a):
				d[attr] = a()
			else:
				d[attr] = a
		if '.' in geometry_name:
			prop, meth = geometry_name.split('.')
			a = getattr(item,prop)
			g = getattr(a,meth)
			if callable(g):
				g = g()
		else:
			g = getattr(item,geometry_name)
		#if bbox (bounding box) is not None, then g must be within it
		if g and ((bbox is None) or (bbox is not None and g.within(bbox))):
			if proj_transform:
				g.transform(proj_transform)
			if geom_simplify:
				g = g.simplify(geom_simplify)
			feat['geometry'] = simplejson.loads(g.geojson)
		feat['properties'] = d
		features.append(feat)
	else:
		pass #features.append({'type':'Feature','geometry': {},'properties':{}})

	# Label as FeatureCollection and add Features
	collection['type'] = "FeatureCollection"
	collection['features'] = features

	# Attach extent of all features
	if query_set:
		ex = None
		query_set.query.distinct = False
		if hasattr(query_set,'agg_extent'): 
			ex = [x for x in query_set.agg_extent.tuple]
		elif '.' in geometry_name:
			prop, meth = geometry_name.split('.')
			a = getattr(item,prop)
			if a:
				ex = [x for x in a.extent()]
		else:
			# make sure qs does not have .distinct() in it...
			ex = [x for x in query_set.extent()]
		if ex:
			if proj_transform:
				poly = Polygon.from_bbox(ex)
				poly.srid = srid
				poly.transform(proj_transform)
				ex = poly.extent
		collection['bbox'] = ex
	
	# Return response
	response = HttpResponse()
	if pretty_print:
		response.write('%s' % simplejson.dumps(collection, indent=1))
	else:
		response.write('%s' % simplejson.dumps(collection))    
	response['Content-length'] = str(len(response.content))
	response['Content-Type'] = mimetype
	return response




def render_to_gpx(poi_qs=None, path_qs=None):
	if poi_qs is None and path_qs is None:
		raise ValueError
	str_out = StringIO.StringIO()
	gpx = gpxType(version=1.1, creator='cestasnp.sk')
	lnk = linkType(text='www.cestasnp.sk', type_='text/html')
	email = emailType(id='info', domain='cestasnp.sk')
	gpx.set_metadata(metadataType(
				link  =[lnk],
				time  =datetime.today().isoformat(),
				author=personType(name='cestasnp.sk', link=lnk, email=email)
				)
			)
	if poi_qs is not None:
		for poi in poi_qs:
			wpt = wptType(
				lon=poi.point.get_x(),
				lat=poi.point.get_y(),
				ele=poi.point.get_z(),
				time=poi.created_at.isoformat(),
				type_=str(poi.type),			#FIXME:convert to STR format
				name=poi.name,
				src=poi.created_by)
			if poi.note != '':
				wpt.set_cmt(poi.note)
			gpx.add_wpt(wpt)
	if path_qs is not None:
		for path in path_qs:
			rte = rteType(src='cestasnp.sk', type_=str(path.type))	#FIXME:convert to STR format
			if path.note != '':
				rte.set_cmt(path.note)
			if len(path.path[0]) == 3:
				rte.set_rtept([wptType(lon=p[0], lat=p[1], ele=p[2]) for p in path.path])
			else:
				rte.set_rtept([wptType(lon=p[0], lat=p[1]) for p in path.path])
			gpx.add_rte(rte)
	gpx.export(outfile=str_out, level=0, name_='gpx')
	return str_out.getvalue()
