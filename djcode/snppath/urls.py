from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('djcode.snppath.views',
	url(r'^$', 'config', name='config')
)
