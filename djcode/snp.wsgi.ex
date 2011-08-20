import os
import sys

sys.path.append('/opt/python-locals/django/django-1.3.0')
sys.path.append('/var/www/map_cestasnp_sk/djcode')
sys.path.append('/var/www/map_cestasnp_sk')

os.environ['DJANGO_SETTINGS_MODULE'] = 'djcode.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
