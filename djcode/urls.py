from django.contrib import admin
from django.conf.urls.defaults import patterns, include, url

admin.autodiscover()

urlpatterns = patterns('',
	url(r'^$', 'djcode.snppath.views.home', name='home'),
	url(r'^testauth$', 'djcode.snppath.views.testauth', name='testauth'),
	url(r'^help$', 'djcode.snppath.views.help', name='help'),
	url(r'^admin/', include(admin.site.urls)),
)
