from joomla.models import Jos_session, JosUsers
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

class JoomlaAuth(object):
	"""Joomla authentication back-end class."""
	
	supports_object_permissions = False
	supports_anonymous_user = True
	supports_inactive_user = False
	
	def authenticate(self, jos_session_id=None):
		try:
			jos_session = Jos_session.objects.exclude(username='').get(session_id=jos_session_id)
		except ObjectDoesNotExist:
			return None
		
		try:
			user = User.objects.get(username=jos_session.username)
		except User.DoesNotExist:
			user = User(username=jos_session.username)
			user.set_unusable_password()
		
		try:
			jos_user = JosUsers.objects.get(id=jos_session.userid)
			user.email = jos_user.email
			if jos_user.name:
				parsed_name = jos_user.name.split(" ", 1)
				user.first_name, user.last_name = parsed_name if len(parsed_name) > 1 else ("", parsed_name[0])
		except:
			pass
		
		# update user privileges
		user.is_active = True
		if jos_session.usertype in ('Super Administrator', 'Administrator'):
			user.is_staff = True
			user.is_superuser = True
		else:
			user.is_staff = False
			user.is_superuser = False
		user.save()
	
		return user

	def get_user(self, user_id=None):
		try:
			return User.objects.get(pk=user_id)
		except User.DoesNotExist:
			return None
