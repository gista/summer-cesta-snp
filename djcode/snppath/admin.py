from django.contrib import admin
from django.contrib.sites.models import Site

admin.site.unregister(Site)
