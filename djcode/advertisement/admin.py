from django.contrib import admin
from advertisement.models import Top_advertisement, Side_advertisement
from advertisement.forms import TopAdvertisementAdminForm, SideAdvertisementAdminForm

class TopAdvertisementAdmin(admin.ModelAdmin):
	list_display = ('title', 'transparency', 'url', 'active')
	form = TopAdvertisementAdminForm

	def save_model(self, request, obj, form, change):
		if obj.active == True:
			active_ads = Top_advertisement.objects.filter(active__exact=True)
			for ad in active_ads:
				ad.active = False
				ad.save()
		obj.save()

class SideAdvertisementAdmin(admin.ModelAdmin):
	list_display = ('title', 'url', 'active')
	form = SideAdvertisementAdminForm

	def save_model(self, request, obj, form, change):
		if obj.active == True:
			active_ads = Side_advertisement.objects.filter(active__exact=True)
			for ad in active_ads:
				ad.active = False
				ad.save()
		obj.save()

admin.site.register(Top_advertisement, TopAdvertisementAdmin)
admin.site.register(Side_advertisement, SideAdvertisementAdmin)
