from django.contrib import admin
from snppath.models import Top_advertisment, Side_advertisment
from snppath.forms import TopAdvertismentAdminForm, SideAdvertismentAdminForm
from snppath.models import Top_advertisment, Side_advertisment

class TopAdvertismentAdmin(admin.ModelAdmin):
	list_display = ('title', 'transparency', 'url', 'active')
	form = TopAdvertismentAdminForm

	def save_model(self, request, obj, form, change):
		if obj.active == True:
			active_ads = Top_advertisment.objects.filter(active__exact=True)
			for ad in active_ads:
				ad.active = False
				ad.save()
		obj.save()

class SideAdvertismentAdmin(admin.ModelAdmin):
	list_display = ('title', 'url', 'active')
	form = SideAdvertismentAdminForm

	def save_model(self, request, obj, form, change):
		if obj.active == True:
			active_ads = Side_advertisment.objects.filter(active__exact=True)
			for ad in active_ads:
				ad.active = False
				ad.save()
		obj.save()

admin.site.register(Top_advertisment, TopAdvertismentAdmin)
admin.site.register(Side_advertisment, SideAdvertismentAdmin)
