from django.contrib import admin
from models import Jos_session, Jos_joom_gallery_catg, Jos_joom_gallery, Jos_content, JosUsers

class Jos_session_admin(admin.ModelAdmin):
	list_display = ("userid", "username", "session_id", "usertype",)
	readonly_fields = Jos_session._meta.get_all_field_names()
	search_fields = ("username","session_id",)
	ordering = ("time",)

class Jos_joom_gallery_catg_admin(admin.ModelAdmin):
	list_display = ("cid", "name",)
	readonly_fields = ("cid", "name", "parent", "description", "ordering", "access", 
		"published", "owner", "catimage", "img_position", "catpath",)

	search_fields = ("name",)

class Jos_joom_gallery_admin(admin.ModelAdmin):
	list_display = ("id", "catid", "imgtitle", "imgauthor", "imgtext",)
	readonly_fields = Jos_joom_gallery._meta.get_all_field_names()
	search_fields = ("imgtitle",)

class Jos_content_admin(admin.ModelAdmin):
	list_display = ("id", "title", "alias", "title_alias", "introtext",)
	readonly_fields = Jos_content._meta.get_all_field_names()
	search_fields = ("title",)

class Jos_users_admin(admin.ModelAdmin):
	list_display = ("id", "username", "name", "email", "usertype",)
	readonly_fields = JosUsers._meta.get_all_field_names()
	search_fields = ("username", "name", "email",)

admin.site.register(Jos_session, Jos_session_admin)
admin.site.register(Jos_joom_gallery, Jos_joom_gallery_admin)
admin.site.register(Jos_joom_gallery_catg, Jos_joom_gallery_catg_admin)
admin.site.register(Jos_content, Jos_content_admin)
admin.site.register(JosUsers, Jos_users_admin)
