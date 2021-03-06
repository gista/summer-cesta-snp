from django.contrib.gis.geos import Point
from django.contrib.gis import admin
from django.conf import settings
from models import Area, Poi, Path, Photo


geoadmin_extra_js = ["http://maps.google.com/maps/api/js?v=3.2&sensor=false", "%sjs/freemap.js" % settings.STATIC_URL]

pnt = Point(settings.SNP_DEFAULT_LON, settings.SNP_DEFAULT_LAT, srid=4326)
pnt.transform(900913)
default_lon, default_lat = pnt.coords

class Area_GeoAdmin(admin.OSMGeoAdmin):
	extra_js = geoadmin_extra_js
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers/OpenLayers.js' % settings.STATIC_URL
	default_lon = default_lon
	default_lat = default_lat
	default_zoom = settings.SNP_DEFAULT_ZOOMLEVEL
	list_display = ('name', 'note',)

class Path_GeoAdmin(admin.OSMGeoAdmin):
	extra_js = geoadmin_extra_js
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers/OpenLayers.js' % settings.STATIC_URL
	default_lon = default_lon
	default_lat = default_lat
	default_zoom = settings.SNP_DEFAULT_ZOOMLEVEL

	list_display = ('area', 'type', 'note',)

class Poi_GeoAdmin(admin.OSMGeoAdmin):
	extra_js = geoadmin_extra_js
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers/OpenLayers.js' % settings.STATIC_URL
	default_lon = default_lon
	default_lat = default_lat
	default_zoom = settings.SNP_DEFAULT_ZOOMLEVEL
	list_display = ('name', 'active', 'area', 'type', 'priority', 'note', 'has_photo', 'has_article')
	filter_horizontal = ('photo', 'jos_article_id', 'jos_photo_id')

	fieldsets = (
		(None, {
			'fields': ('name', 'type', 'area', 'priority', 'created_by', 'created_at', 'active', 'note')
		}),
		('Attached content', {
			'fields': ('jos_article_id', 'jos_photo_id', 'photo')
		}),
		('Map', {
			'fields': ('the_geom',)
		})
	)

class Photo_admin(admin.ModelAdmin):
	list_display = ("title", "desctiption", "photo",)
	ordering = ("title",)

admin.site.register(Photo, Photo_admin)
admin.site.register(Area, Area_GeoAdmin)
admin.site.register(Path, Path_GeoAdmin)
admin.site.register(Poi, Poi_GeoAdmin)
