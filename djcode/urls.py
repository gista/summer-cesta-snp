from django.contrib import admin
from django.conf.urls.defaults import patterns, include, url

admin.autodiscover()

urlpatterns = patterns('',
	url(r'^$', 'djcode.snppath.views.home', name='home'),
	url(r'^testauth/$', 'djcode.snppath.views.testauth', name='testauth'),
	url(r'^help/$', 'djcode.snppath.views.testhelp', name='testhelp'),
	url(r'^config/$', include('djcode.snppath.urls')),
	url(r'^live_tracking/user/$', 'djcode.snppath.views.testuser', name='testuser'),
	url(r'^mapdata/poidetail/$', 'djcode.snppath.views.testpoint', name='testpoint'),
	url(r'^mapdata/geojson/pois/$', 'djcode.snppath.views.testpoints', name='testpoints'),
	url(r'^mapdata/geojson/snppath/$', 'djcode.snppath.views.testsnpline', name='testsnpline'),
	url(r'^admin/', include(admin.site.urls)),
)
