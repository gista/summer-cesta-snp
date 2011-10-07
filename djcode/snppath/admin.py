from django.contrib import admin
from django.contrib.sites.models import Site
from models import Help

class Help_admin(admin.ModelAdmin):
	list_display = ("language",)
	ordering = ("language",)

admin.site.unregister(Site)
admin.site.register(Help, Help_admin)
