from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('djcode.live_tracking.views',
	url(r'^messages/$', 'messages', name='messages')
)
