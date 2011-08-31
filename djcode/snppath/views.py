from django.conf import settings
from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404
from django.contrib.auth import authenticate, login
from django.template import RequestContext
from django.utils import simplejson
from live_tracking.models import User, Track, Message
from snppath.models import Help, Top_advertisment, Side_advertisment


def home(request):
	if request.COOKIES.has_key(settings.SNP_COOKIE_SESSION_ID_NAME):
		user = authenticate(jos_session_id=request.COOKIES[settings.SNP_COOKIE_SESSION_ID_NAME])

		if user is not None and user.is_active:
			login(request, user)

	return render_to_response("index.html", {}, context_instance=RequestContext(request))

def testhelp(request):
	"""
	View returning help page in given language
	Request parameters:
	* language - language of the help
	"""
	lang = request.GET['language']
	try:
		hlp = Help.objects.get(language=lang)
	except Help.DoesNotExist:
		raise Http404
	return HttpResponse(hlp.text)

def config(request):
	"""
	A little bit corrected JSON
	"""
	lusers = User.objects.all()
	resp = {'location':{'lon':settings.SNP_DEFAULT_LON, 'lat':settings.SNP_DEFAULT_LAT, 'zoomlevel':settings.SNP_DEFAULT_ZOOMLEVEL},
		'poi_types':[poi_type[1] for poi_type in settings.SNP_POI_TYPES],
		'live_users':list(),
		'advertisment':dict()
		}

	topad_dict = dict()
	try:
		topad = Top_advertisment.objects.filter(active__exact=True)[0]
		topad_dict = dict()
		topad_dict['title'] = topad.title
		topad_dict['transparency'] = topad.transparency
		topad_dict['url'] = topad.url
		topad_dict['image'] = topad.image.url
	except IndexError:
		pass
	resp['advertisment']['top'] = topad_dict

	sidead_dict = dict()
	try:
		sidead = Side_advertisment.objects.filter(active__exact=True)[0]
		sidead_dict['title'] = sidead.title
		sidead_dict['url'] = sidead.url
		sidead_dict['image'] = sidead.image.url
	except IndexError:
		pass
	resp['advertisment']['side'] = sidead_dict

	for luser in lusers:
		tracks = list()
		for track in Track.objects.filter(user=luser):
			# check if we have some message for this track
			if Message.objects.filter(track=track):
				track_last_time = Message.objects.filter(track=track).latest().time.isoformat()
				tracks.append({'id':track.pk, 'name':track.name,
				       'description':track.description,
				       'is_active':track.is_active,
				       'last_location_time':track_last_time})

		# return only users with at least one track with at least one message
		if len(tracks) > 0:
			resp['live_users'].append({'id':luser.id, 'username':luser.username,
					   'first_name':luser.first_name,
					   'last_name':luser.last_name,
					   'email':luser.email, 'phone':luser.phone,
					   'tracks':tracks})
	return HttpResponse(simplejson.dumps(resp), mimetype='application/json')
