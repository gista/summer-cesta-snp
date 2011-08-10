from django.contrib import admin
from django.conf.urls.defaults import patterns, include, url

admin.autodiscover()

urlpatterns = patterns('',
	url(r'^$', 'djcode.snppath.views.home', name='home'),
	url(r'^testauth/$', 'djcode.snppath.views.testauth', name='testauth'),
	url(r'^help/$', 'djcode.snppath.views.testhelp', name='testhelp'),
	url(r'^config/', include('djcode.snppath.urls')),
	url(r'^live_tracking/', include('djcode.live_tracking.urls')),
	url(r'^mapdata/', include('djcode.mapdata.urls')),
	url(r'^admin/', include(admin.site.urls)),
)
