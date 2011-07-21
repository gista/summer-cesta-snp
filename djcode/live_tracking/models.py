from django.contrib.gis.db import models

class User(models.Model):
	""" Class representing a user in live tracking application.
	Columns:
	id -- id of the user
	name -- name of the user
	track_name -- the name of the track
	date_from -- date, when track began
	date_to -- date, when track ended
	"""
	id = 			models.IntegerField(primary_key=True)
	name = 			models.CharField(max_length=50)
	track_name = 		models.CharField(max_length=50)
	description = 		models.TextField(blank=True, null=True)
	date_from = 		models.DateField(null=True)
	date_to = 		models.DateField(null=True)

	def __unicode__(self):
		return self.name

class Message(models.Model):
	""" Class representing a message sent by a user
	Columns:
	user -- user, who sent a message
	time -- time of sending the message
	text -- text of the message
	the_geom -- spatial point of source of the message
	"""
	user = 		models.ForeignKey(User)
	time = 		models.DateTimeField(null=True)
	text = 		models.TextField(blank=True, null=True)
	the_geom = 	models.PointField(null=True)
	objects = 	models.GeoManager()

	def __unicode__(self):
		return self.text

	class Meta:
		get_latest_by =	 'time'
		ordering = 	 ['time']


class Sync_log(models.Model):
	"""Log of synchronizing DB from Freemap API.
	Columns:
	time -- time of synchronizing
	success -- success of synchronizing
	"""
	time = 		models.DateTimeField()
	success = 	models.BooleanField()

	class Meta:
		get_latest_by =	 'time'
		ordering = 	 ['time']
