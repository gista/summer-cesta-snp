from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

class User(models.Model):
	""" Class representing a user in live tracking application."""
	id = 			models.IntegerField(_(u'id'), primary_key=True, help_text=_(u'ID of the user'))
	username = 		models.CharField(_(u'username'), max_length=50, help_text=_(u'Username of the user'))
	first_name =		models.CharField(_(u'first name'), max_length=50, blank=True, help_text=_(u'First name of the user'))
	last_name =		models.CharField(_(u'last name'), max_length=50, blank=True, help_text=_(u'Last name of the user'))
	email =			models.EmailField(_(u'email'), blank=True, help_text=_(u'Email of the user'))
	phone =			models.CharField(_(u'phone number'), max_length=30, blank=True, help_text=_(u'Phone number of the user'))

	def __unicode__(self):
		return "%s" % self.username

class Track(models.Model):
	""" Class representing a track in live tracking application."""
	name = 		models.CharField(_(u'name'), max_length=50, help_text=_(u'The name of the track.'))
	description = 	models.TextField(_(u'description'), blank=True, help_text=_(u'Description of the track.'))
	user = 		models.ForeignKey(User, blank=True, verbose_name=_(u'user'), help_text=_(u'User assigned to the track.'))#related_name="live_tracking_track_set"
	is_active = 	models.BooleanField(_(u'active'), blank=True, help_text=_(u'Designates whether user is still active on track.'))

	def __unicode__(self):
		return "%s - %s" % (self.user.username, self.name)

class Message(models.Model):
	""" Class representing a message sent by a user."""
	track = 	models.ForeignKey(Track, verbose_name=_(u'track'), help_text=_(u'Track of the user.'))
	time = 		models.DateTimeField(_(u'time'), help_text=_(u'Time of sending the message.'))
	text = 		models.TextField(_(u'text'), blank=True, help_text=_(u'Text of the message.'))

	the_geom = 	models.PointField(_(u'the geom'), null=True, help_text=_(u'Spatial point of source of the message.'))
	objects = 	models.GeoManager()

	def user(self):
		return self.track.user

	def coordinates(self):
		return '%s, %s' % (self.the_geom.x, self.the_geom.y)

	def __unicode__(self):
		return self.text

	class Meta:
		get_latest_by =	 'time'
		ordering = 	 ['time']


class Sync_log(models.Model):
	"""Log of synchronizing DB from Freemap API."""
	time = 		models.DateTimeField(_(u'time'), help_text=_(u'Time of synchronizing.'))
	success = 	models.BooleanField(_(u'success'), help_text=_(u'Success of synchronizing.'))

	def __unicode__(self):
		return "%s" % self.time

	class Meta:
		get_latest_by =	'time'
		ordering = ['time']
		verbose_name = _(u'sync log')
