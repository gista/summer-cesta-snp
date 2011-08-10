from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('djcode.snppath.views',
	url(r'^poidetail/$', 'testpoint', name='testpoint'),
	url(r'^geojson/pois/$', 'testpoints', name='testpoints'),
	url(r'^geojson/snppath/$', 'testsnpline', name='testsnpline')
)
