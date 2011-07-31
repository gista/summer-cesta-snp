from django.contrib.gis import admin
from django.contrib.gis.maps.google import GoogleMap
from models import Area, Poi, Path, Photo

GMAP = GoogleMap()

class GoogleAdmin(admin.OSMGeoAdmin):
	extra_js = [GMAP.api_url + GMAP.key]
	map_template = 'gis/admin/google.html'
	openlayers_url = 'http://openlayers.org/api/2.10/OpenLayers.js' #TODO: load OpenLayers from local sources


admin.site.register(Photo)
admin.site.register(Area, GoogleAdmin)
admin.site.register(Poi, GoogleAdmin)
admin.site.register(Path, GoogleAdmin)
