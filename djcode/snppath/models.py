from django.db import models
from django.utils.translation import ugettext_lazy as _

TOP_AD_IMG_WIDTH = 680
TOP_AD_IMG_HEIGHT = 80

SIDE_AD_IMG_WIDTH = 236
SIDE_AD_IMG_HEIGHT = 110

class Help(models.Model):
	text = models.TextField(_(u'help text'), help_text=_(u'Help text in HTML format.'))
	language = models.CharField(_(u'language code'), max_length = 10, unique = True, help_text=_(u'Language code of the text language.'))

class Top_advertisment(models.Model):
	title = models.CharField(_(u'title of advertisment'), max_length=50,
				 help_text=_(u'Text of the title of the advertisement with maximum length 50 characters.'))
	transparency = models.FloatField(_(u'window transparency'), help_text=_(u'Window transparency (float from 0 to 1).'))
	image = models.ImageField(_(u'image'), upload_to='ads/top', height_field=TOP_AD_IMG_HEIGHT,
				  width_field=TOP_AD_IMG_WIDTH,
				  help_text=_(u'Image of {0}x{1} px size'.format(TOP_AD_IMG_WIDTH, TOP_AD_IMG_HEIGHT)))
	url = models.CharField(_(u'url'), max_length=100,
				help_text=_(u'Url referenced by advertisement. It must have at most 100 characters.'))

	def save(self, *args, **kwargs):
		if self.transparency is None:
			super(Top_advertisment, self).save(*args, **kwargs)
		elif 0 <= self.transparency <= 1:
			super(Top_advertisment, self).save(*args, **kwargs)
		else:
			raise ValueError

class Side_advertisment(models.Model):
	title = models.CharField(_(u'title of advertisment'), max_length=50,
				 help_text=_(u'Text of the title of the advertisement with maximum length 50 characters.'))
	image = models.ImageField(_(u'image'), upload_to='ads/side', height_field=SIDE_AD_IMG_HEIGHT,
				  width_field=SIDE_AD_IMG_WIDTH,
				  help_text=_(u'Image of {0}x{1} px size.'.format(SIDE_AD_IMG_WIDTH, SIDE_AD_IMG_HEIGHT)))
