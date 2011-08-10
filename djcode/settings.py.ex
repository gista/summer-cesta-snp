# Django settings for djcode project.

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
	# ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

# for development set following in /etc/postgresql/8.3/main/pg_hba.conf
# local all all trust
DATABASES = {
	'default': {
		'NAME': 'snppath',
		'ENGINE': 'django.contrib.gis.db.backends.postgis',
		'USER': '',
		'PASSWORD': ''
	},
# for development configure stunnel first
	'joomla': {
		'NAME': 'nova_15182',
		'ENGINE': 'django.db.backends.mysql',
		'HOST': '',
		'PORT': 3308,
		'USER': '',
		'PASSWORD': '',
		'TEST_MIRROR': 'default'
	}
}

#Path to routing object to decide which DB use.
DATABASE_ROUTERS = ['dbrouters.DbRouter']

#Path to authentication back-end.
AUTHENTICATION_BACKENDS = ('auth.JoomlaAuth', 'django.contrib.auth.backends.ModelBackend',)

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'Europe/Bratislava'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = ''

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# URL prefix for admin static files -- CSS, JavaScript and images.
# Make sure to use a trailing slash.
# Examples: "http://foo.com/static/admin/", "/static/admin/".
ADMIN_MEDIA_PREFIX = '/static/admin/'

# Additional locations of static files
STATICFILES_DIRS = (
	# Put strings here, like "/home/html/static" or "C:/www/django/static".
	# Always use forward slashes, even on Windows.
	# Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
	'django.contrib.staticfiles.finders.FileSystemFinder',
	'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#	 'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'ha6slr*m8)p40)d_4ak!n^dr!40zi=+a^caz1&hp6zgk(bs%+e'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
	'django.template.loaders.filesystem.Loader',
	'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
	'django.middleware.common.CommonMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'djcode.urls'

TEMPLATE_DIRS = (
	# Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
	# Always use forward slashes, even on Windows.
	# Don't forget to use absolute paths, not relative paths.
)

INSTALLED_APPS = (
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.sites',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'django.contrib.admin',
	'django.contrib.gis',
	'djcode.mapdata',
	'djcode.joomla',
	'djcode.live_tracking',
	'djcode.snppath',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
	'version': 1,
	'disable_existing_loggers': False,
	'handlers': {
		'mail_admins': {
			'level': 'ERROR',
			'class': 'django.utils.log.AdminEmailHandler'
		}
	},
	'loggers': {
		'django.request': {
			'handlers': ['mail_admins'],
			'level': 'ERROR',
			'propagate': True,
		},
	}
}

# SNPPath settings
SNP_SRID = 900913
SNP_COOKIE_SESSION_ID_NAME = '9fb5dc180d643162e1e24919a8ede8dd'
GOOGLE_MAPS_API_KEY ='ABQIAAAAFBvNBHAal2xO0j7v7Q9naRR9JtsG2NQtVs3m4JfgsLQ3OEspOBSNmo8pyxdC4DLkQxfFEgu3cHiqMA' #map.cestasnp.sk
SNP_POI_TYPES = (
	(1, 'hut, shelter'),
	(2, 'cottage'),
	(3, 'water'),
	(4, 'restaurant, pub'),
	(5, 'grocery'),
	(6, 'interesting place'),
	(7, 'other'),
)

SNP_PATH_TYPES = (
	(1, 'SNP path'),
)
