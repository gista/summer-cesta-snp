from shortcuts import render_to_geojson
from django.http import HttpResponse
from django.contrib.gis.geos import Polygon
from mapdata.models import Path, Poi

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
