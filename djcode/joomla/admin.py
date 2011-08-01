from django.contrib import admin
from models import Jos_session, Jos_joom_gallery, Jos_content

class Jos_session_admin(admin.ModelAdmin):
	list_display = ("userid", "username", "session_id", "usertype",)
	search_fields = ("username","session_id",)
	ordering = ("time",)

class Jos_joom_gallery_admin(admin.ModelAdmin):
	list_display = ("id", "catid", "imgtitle", "imgauthor", "imgtext",)
	search_fields = ("imgtitle",)

class Jos_content_admin(admin.ModelAdmin):
	list_display = ("id", "title", "alias", "title_alias", "introtext",)
	search_fields = ("title",)

admin.site.register(Jos_session, Jos_session_admin)
admin.site.register(Jos_joom_gallery, Jos_joom_gallery_admin)
admin.site.register(Jos_content, Jos_content_admin)
