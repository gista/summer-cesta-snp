from django.contrib.gis import admin
from django.conf import settings
from models import User, Track, Message, Sync_log

class User_admin(admin.ModelAdmin):
	list_display = ("id", "username", "first_name", "last_name", "email", "phone",)
	search_fields = ("username", "first_name", "last_name", "phone",)

class Track_admin(admin.ModelAdmin):
	list_display = ("name", "description")

class Sync_log_admin(admin.ModelAdmin):
	list_display = ("time", "success")
	ordering = ("time",)

class Message_GeoAdmin(admin.OSMGeoAdmin):
	extra_js = ["http://maps.google.com/maps/api/js?v=3.2&sensor=false"]
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers-211-rc1/OpenLayers.js' % settings.STATIC_URL
	list_display = ("user", "track", "time", "text",)
	list_filter = ("track__user", "track", "time",)
	search_fields = ("track__user__username", "track__name", "text")
	ordering = ("time",)

admin.site.register(User, User_admin)
admin.site.register(Track, Track_admin)
admin.site.register(Message, Message_GeoAdmin)
admin.site.register(Sync_log, Sync_log_admin)
