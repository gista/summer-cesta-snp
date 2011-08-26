from django.http import Http404, HttpResponse
import functools

def authenticated_or_404(function):
	'''Decorator does the following:
	* If the user isn't authenticated, raise Http404 exception
	* If the user is logged in, execute the function normally.
	'''
	if request.user.is_authenticated():
		return function
	else:
		raise Http404

class HttpResponseNotAuthorized(HttpResponse):
	'''HttpResponse extended class for 401 code Unauthorized
	'''
	status_code = 401

def login_required_or_401(function):
	'''Decorator does the following:
	* If the user isn't logged in, returns Http401 Unauthorized
	* If the user is logged in, execute the view normally.
	The view code is free to assume the user is logged in.
	'''
	@functools.wraps(function)
	def wrapper(request, *args, **kwargs):
		if request.user.is_authenticated():
			return function(request, *args, **kwargs)
		else:
			return HttpResponseNotAuthorized()
	return wrapper
