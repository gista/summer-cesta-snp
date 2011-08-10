from shortcuts import render_to_geojson
from django.http import HttpResponse
from django.contrib.gis.geos import Polygon
from mapdata.models import Path, Poi
from joomla.models import Jos_content
from django.utils import simplejson

def snppath(request):
	"""
	Returns geojson with StringLines of SNP path intersecting with bbox.
	"""
	geom_simplify = int(request.GET['geom_simplify'])
	bbox = map(lambda x: float(x), request.GET['bbox'].split(','))
	bbox_poly = Polygon.from_bbox(bbox)
	resp = render_to_geojson(Path.objects.all(), 900913, geom_simplify, bbox_poly,
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
	resp = render_to_geojson(pois, 900913, properties=('has_photo', 'has_article'))
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
	jos_article_ids = poi.jos_article_id.all()
	resp['area'] = poi.area.name
	resp['note'] = poi.note
	resp['articles'] = list()
	for article_id in jos_article_ids:
		article = Jos_content.objects.get(id=article_id.pk)
		resp['articles'].append({'article_title':article.title, 'article_introtext':article.introtext, \
					 'article_url':article.urls})
	jos_photos_ids = poi.jos_photo_id.all()
	resp['photos_jos'] = [jos_photo_id.pk for jos_photo_id in jos_photos_ids]
	photos = poi.photo.all()
	resp['photos_map'] = [photo.pk for photo in photos]
	return HttpResponse(simplejson.dumps(resp), mimetype='application/json')
