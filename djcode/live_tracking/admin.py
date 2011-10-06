from django.contrib.gis.geos import Point
from django.contrib.gis import admin
from django.conf import settings
from models import User, Track, Message, Sync_log

geoadmin_extra_js = ["http://maps.google.com/maps/api/js?v=3.2&sensor=false", "%sjs/freemap.js" % settings.STATIC_URL]

pnt = Point(settings.SNP_DEFAULT_LON, settings.SNP_DEFAULT_LAT, srid=4326)
pnt.transform(900913)
default_lon, default_lat = pnt.coords

class User_admin(admin.ModelAdmin):
	list_display = ("id", "username", "first_name", "last_name", "email", "phone",)
	search_fields = ("username", "first_name", "last_name", "phone",)

class Track_admin(admin.ModelAdmin):
	list_display = ("user", "name", "is_active", "description",)

class Sync_log_admin(admin.ModelAdmin):
	list_display = ("time", "success")
	readonly_fields = Sync_log._meta.get_all_field_names()
	ordering = ("time",)

class Message_GeoAdmin(admin.OSMGeoAdmin):
	extra_js = geoadmin_extra_js
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers/OpenLayers.js' % settings.STATIC_URL
	default_lon = default_lon
	default_lat = default_lat
	default_zoom = settings.SNP_DEFAULT_ZOOMLEVEL
	list_display = ("user", "track", "time", "text", "coordinates")
	list_filter = ("track__user", "track", "time",)
	search_fields = ("track__user__username", "track__name", "text")
	ordering = ("time",)

admin.site.register(User, User_admin)
admin.site.register(Track, Track_admin)
admin.site.register(Message, Message_GeoAdmin)
admin.site.register(Sync_log, Sync_log_admin)
