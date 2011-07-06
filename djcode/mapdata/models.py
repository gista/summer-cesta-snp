from django.contrib.gis.db import models
import josdata.models
from thumbs import thumbs

class Area(models.Model):
	name = models.CharField(max_length = 50)
	note = models.TextField(blank = True)

	def __unicode__(self):
		return self.name

class Path(models.Model):
	area    = models.ForeignKey(Area)
	type    = models.IntegerField()
	note    = models.TextField(blank = True)

	path    = models.LineStringField()
	objects = models.GeoManager()

class JosArticleId(models.Model):
	id = models.IntegerField(primary_key = True)

class JosPhotoId(models.Model):
	id = models.IntegerField(primary_key = True)

class Poi(models.Model):
	name           = models.CharField(max_length = 50)
	area           = models.ForeignKey(Area)
	type           = models.IntegerField()
	created_by     = models.CharField(max_length = 50)
	created_at     = models.DateField()
	jos_article_id = models.ManyToManyField(JosArticleId, null = True)
	jos_photo_id   = models.ManyToManyField(JosPhotoId, null = True)
	photo          = thumbs.ImageWithThumbsField(upload_to = 'photos/%Y/%m/%d', sizes = ((125,125),), null = True)
	priority       = models.IntegerField(default = 5)
	note           = models.TextField(blank = True)
	active         = models.BooleanField()

	point          = models.PointField()
	objects        = models.GeoManager()

	class Meta:
		get_latest_by = 'created_at'
		verbose_name = 'Point of interest'
		verbose_name_plural = 'Points of interest'

	def __unicode__(self):
		return self.name
