from django.contrib.gis.db import models
from django.conf import settings

class Area(models.Model):
	"""Model representing area, which contains path and Points of interest."""
	name = models.CharField(max_length = 50, help_text='Name of the area.')
	note = models.TextField(blank = True, help_text='Note about the area.')
	
	the_geom = models.PolygonField()
	objects  = models.GeoManager()

	def __unicode__(self):
		return self.name

class Path(models.Model):
	"""Model representing path of Cesta hrdinov SNP and other surrounding paths."""
	area    = models.ForeignKey(Area, help_text='Area, which path belongs to.')
	type    = models.IntegerField(choices=settings.SNP_PATH_TYPES, default=1, help_text='Type of the path (default 1).')
	note    = models.TextField(blank = True, help_text = 'note about the path')

	the_geom = models.LineStringField(help_text = 'Spatial representation of the path in the WGS84.')
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
	"""Model representing Point of interest (POI)."""
	name           = models.CharField(max_length=50, help_text='Name of the POI.')
	area           = models.ForeignKey(Area, help_text='Area, which POI is situated in.')
	type           = models.IntegerField(choices=settings.SNP_POI_TYPES, help_text='Type of the POI.')
	active         = models.BooleanField(default=True, help_text='Boolean of controlling displaying POI in the map.')
	priority       = models.IntegerField(default=5, help_text='Displaying priority of the POI in the map.')
	note           = models.TextField(blank=True, help_text='Note about the POI.')
	photo          = models.ManyToManyField(Photo, blank=True, null=True, help_text='Photo of the POI.')
	jos_article_id = models.ManyToManyField(Jos_article_id, blank=True, null=True,
						help_text='Many-to-many relation with article ids (from Joomla DB).')
	jos_photo_id   = models.ManyToManyField(Jos_photo_id, blank=True, null=True,
						help_text='Many-to-many relation with photo ids (from Joomla DB).')
	created_by     = models.CharField(max_length=50, blank=True, help_text='Name of the creator of the POI.')
	created_at     = models.DateTimeField(blank=True, null=True, help_text='Date-time stamp of creation of the POI.')

	the_geom       = models.PointField(help_text='Spatial representation of the POI in the WGS84.')
	objects        = models.GeoManager()

	@property
	def has_photo(self):
		if self.photo is None and self.jos_photo_id is None:
			return False
		else:
			return True

	@property
	def has_article(self):
		if self.jos_article_id is not None:
			return True
		else:
			return False

	class Meta:
		get_latest_by = 'created_at'
		verbose_name = 'Point of interest'
		verbose_name_plural = 'Points of interest'

	def __unicode__(self):
		return self.name
