from live_tracking.models import Track, Message
from django.http import HttpResponse
from django.utils import simplejson

def messages(request):
	"""
	Returns json with all messages of track based on given track_id.
	Parameters:
	* track_id - track id
	"""
	trackid = int(request.GET['track_id'])
	track = Track.objects.get(id=trackid)
	resp = [{'lon':msg.the_geom.x if msg.the_geom is not None else None,	\
		'lat':msg.the_geom.y if msg.the_geom is not None else None,	\
		'time':msg.time.isoformat(), 'message':msg.text}		\
		for msg in Message.objects.filter(track=track)]
	return HttpResponse(simplejson.dumps(resp), mimetype='application/json')
