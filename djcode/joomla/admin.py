from django.contrib import admin
from models import Jos_session, Jos_joom_gallery_catg, Jos_joom_gallery, Jos_content, Jos_user

class Jos_session_admin(admin.ModelAdmin):
	list_display = ("userid", "username", "session_id", "usertype",)
	readonly_fields = Jos_session._meta.get_all_field_names()
	search_fields = ("username","session_id",)
	ordering = ("time",)
	actions = None

class Jos_joom_gallery_catg_admin(admin.ModelAdmin):
	list_display = ("cid", "name",)
	readonly_fields = ("cid", "name", "parent", "description", "ordering", "access", 
		"published", "owner", "catimage", "img_position", "catpath",)

	search_fields = ("name",)
	actions = None

class Jos_joom_gallery_admin(admin.ModelAdmin):
	list_display = ("id", "catid", "imgtitle", "imgauthor", "imgtext",)
	readonly_fields = Jos_joom_gallery._meta.get_all_field_names()
	search_fields = ("imgtitle",)
	actions = None

class Jos_content_admin(admin.ModelAdmin):
	list_display = ("id", "title", "alias", "title_alias", "introtext",)
	readonly_fields = Jos_content._meta.get_all_field_names()
	search_fields = ("title",)
	actions = None

class Jos_user_admin(admin.ModelAdmin):
	list_display = ("id", "username", "name", "email", "usertype",)
	readonly_fields = Jos_user._meta.get_all_field_names()
	search_fields = ("username", "name", "email",)
	actions = None

admin.site.register(Jos_session, Jos_session_admin)
admin.site.register(Jos_joom_gallery, Jos_joom_gallery_admin)
admin.site.register(Jos_joom_gallery_catg, Jos_joom_gallery_catg_admin)
admin.site.register(Jos_content, Jos_content_admin)
admin.site.register(Jos_user, Jos_user_admin)
