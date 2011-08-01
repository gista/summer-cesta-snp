from django.conf import settings
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.template import RequestContext

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
