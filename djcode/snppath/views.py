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

def testhelp(request):
	resp = 'Loaded My help content.'
	return HttpResponse(resp, mimetype="text/plain")

def testconfig(request):
	"""
	A little bit corrected JSON
	"""
	resp  = '{"location":{"lon":21.83463, "lat":49.30716, "zoomlevel":9},"poi_types":[{"name":"utulne, pristresky"}, {"name":"chaty"}, {"name":"voda"},{"name":"stravovanie, krcmy"}, {"name":"potraviny"}],"live_users":[{"id":1, "username":"janka", "track_name":"CestaSNP", "first_name":"Janka", "last_name":"J.", "email":"janka@cestasnp.sk", "phone":"0901234567", "is_active":true, "last_location_time":"2010-07-27 12:29:35","description":"Janka startuje z Dukly 18.7. Cielovym miestom je Trencin."},{"id":2, "username":"jakubos", "track_name":"skrz", "first_name":"Jakub", "last_name":"S.", "email":"jakub@cestasnp.sk", "phone":"0912345678", "is_active":true, "last_location_time":"2011-06-29 12:19:27","description":"Skrz Slovenskom http://jakub.zilincan.com/skrz/?trasa"},{"id":3, "username":"pista", "track_name":"CestaSNP", "first_name":"Jakub", "last_name":"S.", "email":"pista@cestasnp.sk", "phone":"0923456789", "is_active":false, "last_location_time":"2011-06-28 21:48:28","description":"Pista a Tono vyrazaju z Dukly. Naplanovali si 16 dnove dobrodruzstvo."}]}'
	return HttpResponse(resp, mimetype="application/json")

def testuser(request):
	"""
	GET params: id, track_name
	Sending U depends on user click keys id & track_name
	"""
	resp = '[{"lon":"21.1035","lat":"48.5917","time":"2011-07-12 11:31:15","message":"Poslednu noc som stravil v motoreste pri Velkom Sarisi. Konecne je chladnejsie pocasie a neprsi. "},{"lon":"21.1213","lat":"49.1448","time":"2011-07-10 22:44:39","message":"Hervartov - spim na obecnom urade. Osprchoval som sa, opral si veci a starosta mi po dedine zhanal nabijacku na mobil, lebo moja nejako nefunguje. V Bardejove som chcel kupit novu, ale hold smola, v nedelu nieco take nehrozi. Cesta bola zaujimava. Hore na Maguru bol chodnik uplne zapadany stromami, okolo malincie, v nom vcely. Tak som dostal zihadlo a potom este jedno od srsna. Bolo to do stehna a pri chodzi to boli. Dostavili sa aj prve otlaky. Zajtra ma prsat, tak asi prejdem trocha menej. "},{"lon":"21.1724","lat":"49.2129","time":"2011-07-09 22:26:25","message":"Zborov - Kusok za zborovom som si spravil striesku. Dnes bolo tolko zazitkov. Napr diva svina s mladymi ma vynahanala, stretol som jelene, srny... Hral poker s ciganmi... A vela krat som zabludil, lebo vcerajsie burky zbahnili teren a ked som pozeral pod nohy, usla mi sem tam odbocka."},{"lon":"21.3029","lat":"49.181","time":"2011-07-08 20:59:34","message":"Cierna Hora - uz 4 hodiny tu prsi. Ked zacalo, uz pol hodiny som bol v utulni a varil som polievku. Do vyhliadky hned vedla udreli 2 blesky, tak von nevychadzam. Vybral som si 2 kliestov a poberam sa spat, nech som zajtra fit. Zatial nastastie bez otlakov."},{"lon":"21.4202","lat":"49.241","time":"2011-07-07 21:03:56","message":"Tak som dorazil na Duklu. Asi 1km od pamatnika som si v podvozku stareho lietadla urobil vysute lozko z celty a povrazu, tak mam pohodlie a som aj skryty pred dazdom."},{"lon":"21.1605","lat":"48.4312","time":"2011-07-07 13:12:02","message":"Cestu zo Ziliny do Kosic mam za sebou. Po obede v mestskom parku som sa pobral na autobusovu stanicu, kde to vyzera z hladiska poctu romskych spoluobcanov o nieco bezpecnejsie ako park."}]'
	return HttpResponse(resp, mimetype="application/json")

def testpoint(request):
	"""
	GET params: id
	Now I am sending U only static id=1
	"""
	resp = '{"articles":[{"article_title":"Pristresky na Cemjate","article_introtext":"Pri putovani z Devina Vas Vase putovanie dovedie k zrekonstruovanemu altanku s mineralnym pramenom.","article_url":"http://cestasnp.sk/index.php/dolezite-miesta/dukla-cergov-sarisska-vrchovina/193-pristresky-na-cemjate"},{"article_title":"Cemjata","article_introtext":"Cemjata ako primestska cast mesta Presov lezi pri ceste Presov - Sedlice - Margecany a geograficky sa zaclenuje do Sarisskej vrchoviny.","article_url":"http://cestasnp.sk/index.php/dolezite-miesta/dukla-cergov-sarisska-vrchovina/194-cemjata"}],"photos_map":[234, 121, 230],"photos_jos":[12, 512]}'
	return HttpResponse(resp, mimetype="application/json")
