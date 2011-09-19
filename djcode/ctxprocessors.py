from djcode.version import get_version

def version(request):
	return {"VERSION": get_version()}
