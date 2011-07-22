from joomla.models import Jos_session
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

class JoomlaAuth(object):
	"""Authentication back-end class."""

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
			user.save()
			#TODO: setting is_staff, is_superuser based on jos_user table
		return user

	def get_user(self, user_id=None):
		try:
			return User.objects.get(pk=user_id)
		except User.DoesNotExist:
			return None
