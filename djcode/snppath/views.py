from django.conf import settings
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.template import RequestContext
from django.utils import simplejson
from live_tracking.models import User, Track, Message


def home(request):
	if request.COOKIES.has_key(settings.SNP_COOKIE_SESSION_ID_NAME):
		user = authenticate(jos_session_id=request.COOKIES[settings.SNP_COOKIE_SESSION_ID_NAME])

		if user is not None and user.is_active:
			login(request, user)

	return render_to_response("index.html", {}, context_instance=RequestContext(request))

def testhelp(request):
	resp = 'Loaded My help content.'
	return HttpResponse(resp, mimetype="text/plain")

def config(request):
	"""
	A little bit corrected JSON
	"""
	lusers = User.objects.all()
	resp = {'location':{'lon':settings.SNP_DEFAULT_LON, 'lat':settings.SNP_DEFAULT_LAT, 'zoomlevel':settings.SNP_DEFAULT_ZOOMLEVEL},
		'poi_types':[poi_type[1] for poi_type in settings.SNP_POI_TYPES],
		'live_users':list()}
	for luser in lusers:
		tracks = list()
		for track in Track.objects.filter(user=luser):
			track_last_time = Message.objects.filter(track=track).latest().time.isoformat()
			tracks.append({'id':track.pk, 'name':track.name,
				       'description':track.description,
				       'is_active':track.is_active,
				       'last_location_time':track_last_time})
		resp['live_users'].append({'id':luser.id, 'username':luser.username,
					   'first_name':luser.first_name,
					   'last_name':luser.last_name,
					   'email':luser.email, 'phone':luser.phone,
					   'tracks':tracks})
	return HttpResponse(simplejson.dumps(resp), mimetype='application/json')
