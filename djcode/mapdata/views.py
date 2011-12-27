from geoshortcuts.geojson import render_to_geojson
from geoshortcuts.gpx import render_to_gpx
from django.http import HttpResponse
from django.contrib.gis.geos import Polygon, Point
from django.utils import simplejson
from django.conf import settings
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_protect
from mapdata.models import Path, Poi, Area, Photo
from joomla.models import Jos_content, Jos_joom_gallery
from django.db import IntegrityError
from mapdata.forms import PoiForm
from django.utils.translation import ugettext as _
from sorl.thumbnail import get_thumbnail
from djcode.decorators import login_required_or_401
from django.views.decorators.http import require_POST

from datetime import date, datetime

GPX_FILE_NAME = 'cestasnp-%s.gpx' % date.today()

GPX_METADATA = {
	'name':GPX_FILE_NAME,
	'desc':'GPX export from cestasnp.sk',
	'author': {
		'name':'cestasnp.sk',
		'email':'info@cestasnp.sk',
		'link':{
			'href':'http://www.cestasnp.sk',
			'text':'cestasnp.sk',
			'type':'text/html',
		}
	},
	'copyright':{
		'author':'cestasnp.sk',
		'year':date.today(),
		'license':'/license/',
	},
	'link':[{
		'href':'http://www.cestasnp.sk',
		'text':'Cestasnp.sk',
		'type':'text/html',
	}],
	'time':datetime.today(),
	'keywords':'cesta SNP',
}
GPX_POI_MAPPING = {
	'time': 'created_at',
	'name': 'name',
	'desc' : 'note',
	'src' : 'created_by',
	'type': 'type',
}

GPX_PATH_MAPPING = {
	'desc' : 'note',
	'type' : 'type',
}

def snppath(request):
	"""
	Returns geojson with StringLines of SNP path intersecting with bbox.
	"""
	try:
		geom_simplify = int(request.GET['simplify'])
	except KeyError:
		geom_simplify = None
	try:
		bbox = map(lambda x: float(x), request.GET['bbox'].split(','))
		bbox_poly = Polygon.from_bbox(bbox)
		bbox_poly.srid = settings.SNP_SRID
		to_srid = Path.objects.all()[0].the_geom.srid
		bbox_poly.transform(to_srid)
	except (KeyError, IndexError):
		bbox_poly = None
	resp = render_to_geojson(Path.objects.all(), settings.SNP_SRID, geom_simplify, bbox_poly,
				 properties=())
	return HttpResponse(resp, mimetype='application/json')

def pois(request):
	"""
	Returns geojson with Points of Points of interests with given type.
	Geojson has these properties:
	* has_photo
	* has_article
	Request parameters:
	* type - type of points
	"""
	type_ = int(request.GET['type'])
	pois = Poi.objects.filter(type__exact=type_).exclude(active__exact=False)
	resp = render_to_geojson(pois, settings.SNP_SRID, properties=('has_photo', 'has_article'))
	return HttpResponse(resp, mimetype='application/json')

def poidetail(request):
	"""
	Returns detail json about Point of interest with given id.
	Request parameters:
	* id - id of POI
	"""
	id = int(request.GET['id'])
	poi = Poi.objects.get(id=id)

	resp = dict()

	resp['area'] = poi.area.name
	resp['name'] = poi.name
	resp['note'] = poi.note

	jos_article_ids = poi.jos_article_id.all()
	resp['articles'] = list()
	for article_id in jos_article_ids:
		article = Jos_content.objects.get(id=article_id.pk)
		resp['articles'].append({'article_title':article.title,
				'article_introtext':article.introtext.replace('<img src="images','<img src="%simages' % settings.SNP_JOOMLA_URL),
				'article_url': article.get_article_url()})

	jos_photos_ids = poi.jos_photo_id.all()
	resp['photos_jos'] = list()
	for jos_photo_id in jos_photos_ids:
		jos_photo = Jos_joom_gallery.objects.get(id=jos_photo_id.pk)
		resp['photos_jos'].append({'photo_title': jos_photo.imgtitle,
			'photo_thumb_url': jos_photo.get_thumb_url(), 'photo_url': jos_photo.get_photo_url()})

	resp['photos_map'] = list()
	for map_photo in poi.photo.all():
		thumb = get_thumbnail(map_photo.photo, '100x100', crop='center', quality=95)
		resp['photos_map'].append({'photo_title': map_photo.title,
			'photo_thumb_url': thumb.url, 'photo_url': map_photo.photo.url})

	return HttpResponse(simplejson.dumps(resp), mimetype='application/json')

def gpx(request):
	"""Returns GPX file."""
	gpx = render_to_gpx('cestasnp.sk', Poi.objects.all(), None, GPX_METADATA,
			    GPX_POI_MAPPING, GPX_PATH_MAPPING)

	response = HttpResponse(gpx, content_type='text/xml')
	response['Content-Disposition'] = 'attachment; filename={0}'.format(GPX_FILE_NAME)
	response['Content-Length'] = len(gpx)

	return response


@require_POST
@csrf_protect
@login_required_or_401
def poi(request):
	"""	
	On POST	response are sended user data to verification & server response depends on correct user inputs
		on success - sended back map layer ID, which should be refreshed
		if failure - sended back error field messages 
	"""
	form = PoiForm(request.POST, request.FILES)
	if form.is_valid():
		poi = form.save(commit=False)
		point = Point(form.cleaned_data['lon'], form.cleaned_data['lat'])
		poi.the_geom = point
			
		for area in Area.objects.all():
			if area.the_geom.intersects(point):
				poi.area = area
				print area
				break
		try:
			poi.save()
		except IntegrityError:
			custom_errors = {'lon':_(u'Area out of saveable bounds.'),'lat':_(u'Area out of saveable bounds.')}
			error_json = simplejson.dumps({"success":False, "errors":dict(custom_errors)})
			print error_json
			return HttpResponse(error_json, mimetype='text/html')

		fileNames = request.POST.getlist('photo-name')
		for index, file in enumerate(request.FILES.getlist('photo')):
			ph = Photo(title=fileNames[index], photo=file)
			ph.photo.save(fileNames[index], file)
			ph.save()
			poi.photo.add(ph)
			poi.save()
			
		return HttpResponse('{"success":true, "layer":%d}' % (poi.type), mimetype='text/html') # ExtJS upload form requires html response!
	else:
		error_json = simplejson.dumps({"success":False, "errors":dict(form.errors)})
		return HttpResponse(error_json, mimetype='text/html')
