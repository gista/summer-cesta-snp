from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('djcode.mapdata.views',
	url(r'^poidetail/$', 'poidetail', name='poidetail'),
	url(r'^geojson/pois/$', 'pois', name='pois'),
	url(r'^geojson/snppath/$', 'snppath', name='snppath'),
	url(r'^gpx/$', 'gpx', name='gpx')
)
