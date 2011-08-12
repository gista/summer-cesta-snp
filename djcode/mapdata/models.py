from django.contrib.gis.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

class Area(models.Model):
	"""Model representing area, which contains path and Points of interest."""
	name = models.CharField(_(u'name'), max_length = 50, help_text=_(u'Name of the area.'))
	note = models.TextField(_(u'note'), blank = True, help_text=_(u'Note about the area.'))

	the_geom = models.PolygonField(_(u'the geom'), help_text=_(u'Spatial representation of the area in the WGS84.'))
	objects  = models.GeoManager()

	def __unicode__(self):
		return self.name

class Path(models.Model):
	"""Model representing path of Cesta hrdinov SNP and other surrounding paths."""
	area    = models.ForeignKey(Area, verbose_name=_(u'area'), help_text=_(u'Area, which path belongs to.'))
	type    = models.IntegerField(_(u'type'), choices=settings.SNP_PATH_TYPES, default=1, help_text=_(u'Type of the path (default 1).'))
	note    = models.TextField(_(u'note'), blank = True, help_text = _(u'note about the path'))

	the_geom = models.LineStringField(_(u'the geom'), help_text = _(u'Spatial representation of the path in the WGS84.'))
	objects  = models.GeoManager()

	def __unicode__(self):
		return self.area.name

class Jos_article_id(models.Model):
	"""Model representing ID of article in DB of Joomla"""
	id = models.IntegerField(_(u'id'), primary_key = True)

	def __unicode__(self):
		return str(self.id)

class Jos_photo_id(models.Model):
	"""Model representing ID of photo in DB of Joomla"""
	id = models.IntegerField(_(u'id'), primary_key = True)

	def __unicode__(self):
		return str(self.id)

class Photo(models.Model):
	title = models.CharField(_(u'title'), max_length=50)
	desctiption = models.CharField(_(u'description'), max_length=100, blank=True)
	photo = models.ImageField(_(u'photo'), upload_to='/tmp/photos/%Y/%m/%d', blank=True)

	def __unicode__(self):
		return self.title

class Poi(models.Model):
	"""Model representing Point of interest (POI)."""
	name           = models.CharField(_(u'name'), max_length=50, help_text=_(u'Name of the POI.'))
	area           = models.ForeignKey(Area, help_text=_(u'Area, which POI is situated in.'), verbose_name=_(u'area'))
	type           = models.IntegerField(_(u'type'), choices=settings.SNP_POI_TYPES, help_text=_(u'Type of the POI.'))
	active         = models.BooleanField(_(u'active'), default=True, help_text=_(u'Boolean of controlling displaying POI in the map.'))
	priority       = models.IntegerField(_(u'priority'), default=5, help_text=_(u'Displaying priority of the POI in the map.'))
	note           = models.TextField(_(u'note'), blank=True, help_text=_(u'Note about the POI.'))
	photo          = models.ManyToManyField(Photo, blank=True, null=True, verbose_name=_(u'list of photos'), help_text=_(u'Photo of the POI.'))
	jos_article_id = models.ManyToManyField(Jos_article_id, blank=True, null=True, verbose_name=_(u'list of articles'),
						help_text=_(u'Many-to-many relation with article ids (from Joomla DB).'))
	jos_photo_id   = models.ManyToManyField(Jos_photo_id, blank=True, null=True, verbose_name=_(u'list of joomla photos'),
						help_text=_(u'Many-to-many relation with photo ids (from Joomla DB).'))
	created_by     = models.CharField(_(u'author'), max_length=50, blank=True, help_text=_(u'Name of the creator of the POI.'))
	created_at     = models.DateTimeField(_(u'creation time'), blank=True, null=True, help_text=_(u'Date-time stamp of creation of the POI.'))

	the_geom       = models.PointField(_(u'the geom'), help_text=_(u'Spatial representation of the POI in the WGS84.'))
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
		verbose_name = _(u'Point of interest')
		verbose_name_plural = _(u'Points of interest')

	def __unicode__(self):
		return self.name
