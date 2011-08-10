from shortcuts import render_to_geojson
from django.http import HttpResponse
from django.contrib.gis.geos import Polygon
from mapdata.models import Path

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
