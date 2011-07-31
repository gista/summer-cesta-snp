from django.contrib.gis import admin
from django.contrib.gis.maps.google import GoogleMap
from models import Area, Poi, Path, Photo

GMAP = GoogleMap()

class Area_GoogleAdmin(admin.OSMGeoAdmin):
	extra_js = [GMAP.api_url + GMAP.key]
	map_template = 'gis/admin/google.html'
	openlayers_url = '/static/js/openlayers/OpenLayers.js'
	list_display = ('name', 'note',)

class Path_GoogleAdmin(admin.OSMGeoAdmin):
	extra_js = [GMAP.api_url + GMAP.key]
	map_template = 'gis/admin/google.html'
	openlayers_url = '/static/js/openlayers/OpenLayers.js'
	list_display = ('area', 'type', 'note',)

class Poi_GoogleAdmin(admin.OSMGeoAdmin):
	extra_js = [GMAP.api_url + GMAP.key]
	map_template = 'gis/admin/google.html'
	openlayers_url = '/static/js/openlayers/OpenLayers.js'
	list_display = ('name', 'active', 'area', 'type', 'priority', 'note',)

admin.site.register(Photo)
admin.site.register(Area, Area_GoogleAdmin)
admin.site.register(Path, Path_GoogleAdmin)
admin.site.register(Poi, Poi_GoogleAdmin)
