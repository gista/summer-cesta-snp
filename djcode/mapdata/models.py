from django.contrib.gis.db import models
from django.conf import settings

class Area(models.Model):
	"""Model representing area, which contains path and Points of interest.
	Columns:
	name -- name of the area
	note -- note about the area.
	"""
	name = models.CharField(max_length = 50)
	note = models.TextField(blank = True)
	
	the_geom = models.PolygonField()
	objects  = models.GeoManager()

	def __unicode__(self):
		return self.name

class Path(models.Model):
	"""Model representing path of Cesta hrdinov SNP and other surrounding paths.
	Columns:
	area -- area, which path belongs to
	type -- type of the path (default 1)
	note -- note about the path
	path -- spatial representation of the path in the WGS84
	"""
	area    = models.ForeignKey(Area)
	type    = models.IntegerField(choices=settings.PATH_TYPES, default=1)
	note    = models.TextField(blank = True)

	the_geom = models.LineStringField()
	objects  = models.GeoManager()

	def __unicode__(self):
		return self.area.name

class Jos_article_id(models.Model):
	"""Model representing ID of article in DB of Joomla"""
	id = models.IntegerField(primary_key = True)

class Jos_photo_id(models.Model):
	"""Model representing ID of photo in DB of Joomla"""
	id = models.IntegerField(primary_key = True)

class Photo(models.Model):
	title = models.CharField(max_length=50)
	desctiption = models.CharField(max_length=100, blank=True)
	photo = models.ImageField(upload_to='/tmp/photos/%Y/%m/%d', blank=True)
	
	def __unicode__(self):
		return self.title

class Poi(models.Model):
	"""Model representing Point of interest (POI).
	Columns:
	name -- name of the POI
	area -- area, which POI is situated in
	type -- type of the POI
	created_by -- name of the creator of the POI
	created_at -- date-time stamp of creation of the POI
	jos_article_id -- many-to-many relation with article ids (from Joomla DB)
	jos_photo_id -- many-to-many relation with photo ids (from Joomla DB)
	photo -- photo of the POI
	priority -- displaying priority of the POI in the map
	note -- note about the POI
	active -- boolean of controlling displaying POI in the map
	point -- spatial representation of the POI in the WGS84
	"""
	name           = models.CharField(max_length=50)
	area           = models.ForeignKey(Area)
	type           = models.IntegerField(choices=settings.POI_TYPES)
	active         = models.BooleanField(default=True)
	priority       = models.IntegerField(default=5)
	note           = models.TextField(blank=True)
	photo          = models.ManyToManyField(Photo, blank=True, null=True)
	jos_article_id = models.ManyToManyField(Jos_article_id, blank=True, null=True)
	jos_photo_id   = models.ManyToManyField(Jos_photo_id, blank=True, null=True)
	created_by     = models.CharField(max_length=50, blank=True)
	created_at     = models.DateTimeField(blank=True, null=True)

	the_geom       = models.PointField()
	objects        = models.GeoManager()

	class Meta:
		get_latest_by = 'created_at'
		verbose_name = 'Point of interest'
		verbose_name_plural = 'Points of interest'

	def __unicode__(self):
		return self.name
