from live_tracking.models import Track, Message, Sync_log
from django.http import HttpResponse
from django.utils import simplejson
from django.views.decorators.csrf import csrf_exempt
from live_tracking.forms import MessageForm
from datetime import datetime
from django.http import Http404

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

@csrf_exempt
def message(request):
	"""
	Function to fill live_tracking messages with POST request. Parameters:
	* from - phone number of the sender
	* message - message of the sender in form: LOC Track.name MM.MMMMM MM.MMMMM text
	* secret - secret key identical with SMSSYNC_SECRET in settings
	When everything is OK, returns {"success":"true"} JSON
	When phone or secrete is invalid, returns 401.
	Otherwise returns {"success":"false"} JSON
	"""
	if request.method == 'GET':
		raise Http404
	post = request.POST.copy()
	post.update({"phone": post.pop("from")[0]})
	form = MessageForm(post)
	if form.is_valid():
		form.save(commit=True)
		Sync_log(time=datetime.today, success=True)
		return HttpResponse('{"payload": {"success": true}}', mimetype='application/json')
	else:
		Sync_log(time=datetime.today, success=False)
		errs = form.errors.keys()
		if 'phone' in errs or 'secret' in errs:
			res = HttpResponse('')
			res.status_code = 401
			return res
		else:
			return HttpResponse('{"payload": {"success": false}}', mimetype='application/json')

