from django.contrib.gis import admin
from django.contrib.gis.maps.google import GoogleMap
from django.conf import settings
from models import User, Message, Sync_log

class User_admin(admin.ModelAdmin):
	list_display = ("id", "username", "first_name", "last_name", "track_name", "email", "phone", "description", "is_active",)
	search_fields = ("username", "first_name", "last_name", "phone",)

class Sync_log_admin(admin.ModelAdmin):
	list_display = ("time", "success")
	ordering = ("time",)

GMAP = GoogleMap()

class Message_GoogleAdmin(admin.OSMGeoAdmin):
	extra_js = [GMAP.api_url + GMAP.key]
	map_template = 'gis/admin/geoadmin.html'
	openlayers_url = '%sjs/openlayers/OpenLayers.js' % settings.STATIC_URL
	list_display = ("user", "time", "text",)
	list_filter = ("user", "time",)
	search_fields = ("user",)
	ordering = ("time",)


admin.site.register(User, User_admin)
admin.site.register(Message, Message_GoogleAdmin)
admin.site.register(Sync_log, Sync_log_admin)
