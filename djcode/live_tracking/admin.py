from django.contrib.gis import admin
from django.contrib.gis.maps.google import GoogleMap
from models import User, Message, Sync_log

class User_admin(admin.ModelAdmin):
	list_display = ("id", "name", "track_name", "description", "date_from", "date_to")
	search_fields = ("name",)

class Sync_log_admin(admin.ModelAdmin):
	list_display = ("time", "success")
	ordering = ("time",)

GMAP = GoogleMap()

class Message_GoogleAdmin(admin.OSMGeoAdmin):
	extra_js = [GMAP.api_url + GMAP.key]
	map_template = 'gis/admin/google.html'
	openlayers_url = 'http://openlayers.org/api/2.10/OpenLayers.js' #TODO: load OpenLayers from local sources
	list_display = ("user", "time", "text",)
	list_filter = ("user", "time",)
	search_fields = ("user",)
	ordering = ("time",)


admin.site.register(User, User_admin)
admin.site.register(Message, Message_GoogleAdmin)
admin.site.register(Sync_log, Sync_log_admin)
