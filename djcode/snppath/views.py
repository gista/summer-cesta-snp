from django.conf import settings
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.template import RequestContext
from django.conf import settings
import json
import shortcuts
from live_tracking.models import *
from mapdata.models import *
from joomla.models import Jos_content
from django.contrib.gis.geos import Polygon

SNP_DEFAULT_LON		= 19.258336054784
SNP_DEFAULT_LAT		= 48.8176576494
SNP_DEFAULT_ZOOMLEVEL	= 8

def testauth(request):
	resp = 'AUTHENTICATION TEST PAGE'
	resp += '\nCOOKIES: %s' % str(request.COOKIES)
	if request.COOKIES.has_key(settings.SNPPATH_COOKIE_SESSION_ID_NAME):
		user = authenticate(jos_session_id=request.COOKIES[settings.SNPPATH_COOKIE_SESSION_ID_NAME])
		resp += '\nUSER: %s' % user

		if user is not None and user.is_active:
			login(request, user)

			resp += '\nIS_STAFF: %s' % user.is_staff
			resp += '\nIS_SUPERUSER: %s' %  user.is_superuser

	return HttpResponse(resp, mimetype="text/plain")

def home(request):
	return render_to_response("index.html", {}, context_instance=RequestContext(request))

def testhelp(request):
	resp = 'Loaded My help content.'
	return HttpResponse(resp, mimetype="text/plain")

def config(request):
	"""
	A little bit corrected JSON
	"""
	lusers = User.objects.all()
	resp = {'location':{'lon':SNP_DEFAULT_LON, 'lat':SNP_DEFAULT_LAT, 'zoomlevel':SNP_DEFAULT_ZOOMLEVEL},
		'poi_types':[poi_type[1] for poi_type in settings.POI_TYPES],
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
	return HttpResponse(json.dumps(resp), mimetype='application/json')

def testuser(request):
	"""
	GET params: id, track_name
	Sending U depends on user click keys id & track_name
	"""
	id = int(request.GET['id'])
	#track_name = int(request.GET['track_name'])	#FIXME: id is primary key, track_name is needed then?
	luser = User.objects.get(id=id)			#avoiding track_name
	resp = [{'lon':msg.the_geom.x if msg.the_geom is not None else None,	\
		'lat':msg.the_geom.y if msg.the_geom is not None else None,	\
		'time':msg.time.isoformat(), 'message':msg.text}		\
		for msg in Message.objects.filter(user=luser)]
	return HttpResponse(json.dumps(resp), mimetype='application/json')

def testpoints(request):
	"""
	GET params: type
	"""

	type_ = int(request.GET['type'])
	pois = Poi.objects.filter(type__exact=type_).exclude(active__exact=False)
	resp = shortcuts.render_to_geojson(pois, 900913, properties=('id', 'has_photo', 'has_article'))
	return HttpResponse(resp, mimetype='application/json')

def testpoint(request):
	"""
	GET params: id
	Now I am sending U only static id=1
	"""
	id = int(request.GET['id'])
	poi = Poi.objects.get(id=id)
	resp = dict()
	jos_article_ids = poi.jos_article_id.all()
	resp['area'] = poi.area.name
	resp['note'] = poi.note
	resp['articles'] = list()
	for article_id in jos_article_ids:
		article = Jos_content.objects.get(id=article_id.id)
		resp['articles'].append({'article_title':article.title, 'article_introtext':article.introtext, \
					 'article_url':article.urls})
	jos_photos_ids = poi.jos_photo_id.all()
	resp['photos_jos'] = [jos_photo_id.id for jos_photo_id in jos_photos_ids]
	photos = poi.photo.all()
	resp['photos_map'] = [photo.id for photo in photos]
	return HttpResponse(json.dumps(resp), mimetype='application/json')
