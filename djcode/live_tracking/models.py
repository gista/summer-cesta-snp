from django.contrib.gis.db import models

class User(models.Model):
	""" Class representing a user in live tracking application."""
	id = 			models.IntegerField(primary_key=True)
	username = 		models.CharField(max_length=50)
	first_name =		models.CharField(max_length=50, blank=True)
	last_name =		models.CharField(max_length=50, blank=True)
	email =			models.EmailField(blank=True)
	is_active = 		models.BooleanField(default=True, 
					help_text='Designates whether this user is still active on path.')
	track_name = 		models.CharField(max_length=50, help_text='The name of the track.')
	description = 		models.TextField(blank=True, help_text='Description of the track.')
	date_from = 		models.DateField(blank=True, null=True, help_text='Date, when track began.')
	date_to = 		models.DateField(blank=True, null=True, help_text='Date, when track ended.')

	def __unicode__(self):
		return "%s (%s)" % (self.username, self.track_name)

class Message(models.Model):
	""" Class representing a message sent by a user."""
	user = 		models.ForeignKey(User, help_text='User, who sent a message.')
	time = 		models.DateTimeField(help_text='Time of sending the message.')
	text = 		models.TextField(blank=True, help_text='Text of the message.')
	
	the_geom = 	models.PointField(null=True, help_text='Spatial point of source of the message.')
	objects = 	models.GeoManager()

	def __unicode__(self):
		return self.text

	class Meta:
		get_latest_by =	 'time'
		ordering = 	 ['time']


class Sync_log(models.Model):
	"""Log of synchronizing DB from Freemap API."""
	time = 		models.DateTimeField(help_text='Time of synchronizing.')
	success = 	models.BooleanField(help_text='Success of synchronizing.')
	
	def __unicode__(self):
		return "%s" % self.time

	class Meta:
		get_latest_by =	'time'
		ordering = ['time']
		verbose_name = u'sync log'
