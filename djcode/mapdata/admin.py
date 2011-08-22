from django.contrib.gis import admin
from django.conf import settings
from models import Area, Poi, Path, Photo


geoadmin_extra_js = ["http://maps.google.com/maps/api/js?v=3.2&sensor=false", "%sjs/freemap.js" % settings.STATIC_URL]

class Area_GeoAdmin(admin.OSMGeoAdmin):
	extra_js = geoadmin_extra_js
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers-211-rc1/OpenLayers.js' % settings.STATIC_URL
	list_display = ('name', 'note',)

class Path_GeoAdmin(admin.OSMGeoAdmin):
	extra_js = geoadmin_extra_js
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers-211-rc1/OpenLayers.js' % settings.STATIC_URL
	list_display = ('area', 'type', 'note',)

class Poi_GeoAdmin(admin.OSMGeoAdmin):
	extra_js = geoadmin_extra_js
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers-211-rc1/OpenLayers.js' % settings.STATIC_URL
	list_display = ('name', 'active', 'area', 'type', 'priority', 'note', 'has_photo', 'has_article')
	filter_horizontal = ('photo', 'jos_article_id', 'jos_photo_id')

admin.site.register(Photo)
admin.site.register(Area, Area_GeoAdmin)
admin.site.register(Path, Path_GeoAdmin)
admin.site.register(Poi, Poi_GeoAdmin)
