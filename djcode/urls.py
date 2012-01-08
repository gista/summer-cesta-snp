from django.contrib import admin
from django.conf.urls.defaults import patterns, include, url

from django.conf import settings
from django.conf.urls.static import static

admin.autodiscover()

js_info_dict = {
    'packages': ('djcode.snppath',),
}

urlpatterns = patterns('',
	url(r'^$', 'djcode.snppath.views.home', name='home'),
	url(r'^help/$', 'djcode.snppath.views.help', name='help'),
	url(r'^jsi18n/$', 'django.views.i18n.javascript_catalog', js_info_dict),
	url(r'^config/', include('djcode.snppath.urls')),
	url(r'^live_tracking/', include('djcode.live_tracking.urls')),
	url(r'^mapdata/', include('djcode.mapdata.urls')),
	url(r'^admin/', include(admin.site.urls)),
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
