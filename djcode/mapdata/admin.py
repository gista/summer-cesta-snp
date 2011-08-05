from django.contrib.gis import admin
from django.contrib.gis.maps.google import GoogleMap
from django.conf import settings
from models import Area, Poi, Path, Photo

GMAP = GoogleMap()

class Area_GoogleAdmin(admin.OSMGeoAdmin):
	extra_js = ["http://maps.google.com/maps/api/js?v=3.2&sensor=false"]
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers-211-rc1/OpenLayers.js' % settings.STATIC_URL
	list_display = ('name', 'note',)

class Path_GoogleAdmin(admin.OSMGeoAdmin):
	extra_js = ["http://maps.google.com/maps/api/js?v=3.2&sensor=false"]
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers-211-rc1/OpenLayers.js' % settings.STATIC_URL
	list_display = ('area', 'type', 'note',)

class Poi_GoogleAdmin(admin.OSMGeoAdmin):
	extra_js = ["http://maps.google.com/maps/api/js?v=3.2&sensor=false"]
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers-211-rc1/OpenLayers.js' % settings.STATIC_URL
	list_display = ('name', 'active', 'area', 'type', 'priority', 'note',)

admin.site.register(Photo)
admin.site.register(Area, Area_GoogleAdmin)
admin.site.register(Path, Path_GoogleAdmin)
admin.site.register(Poi, Poi_GoogleAdmin)
