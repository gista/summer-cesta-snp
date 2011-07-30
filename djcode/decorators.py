from django.http import Http404

def authenticated_or_404(function):
	'''Decorator does the following:
	* If the user isn't authenticated, raise Http404 exception
	* If the user is logged in, execute the function normally.
	'''
	if request.user.is_authenticated():
		return function
	else:
		raise Http404
