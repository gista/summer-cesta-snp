from django.db import models
from django.utils.translation import ugettext_lazy as _

TOP_AD_IMG_WIDTH = 680
TOP_AD_IMG_HEIGHT = 80

SIDE_AD_IMG_WIDTH = 236
SIDE_AD_IMG_HEIGHT = 110

MAX_AD_TITLE_LEN = 50
MAX_AD_URL_LEN = 100

class Help(models.Model):
	text = models.TextField(_(u'help text'), help_text=_(u'Help text in HTML format.'))
	language = models.CharField(_(u'language code'), max_length = 10, unique = True, help_text=_(u'Language code of the text language.'))

	def __unicode__(self):
		return "Help (%s)" % self.language

class Top_advertisment(models.Model):
	title = models.CharField(_(u'title of advertisement'), max_length=MAX_AD_TITLE_LEN,
				 help_text=_(u'Text of the title of the advertisement with maximum length {0} characters.'.format(MAX_AD_TITLE_LEN)))
	transparency = models.FloatField(_(u'window transparency'), help_text=_(u'Window transparency (float from 0 to 1).'))
	image = models.ImageField(_(u'image'), upload_to='ads/top',
				  help_text=_(u'Image of {0}x{1} px size'.format(TOP_AD_IMG_WIDTH, TOP_AD_IMG_HEIGHT)))
	url = models.CharField(_(u'URL'), max_length=MAX_AD_URL_LEN,
				help_text=_(u'URL referenced by advertisement. It must have at most {0} characters and it must have also protocol specified (http://, https:// ...).'.format(MAX_AD_URL_LEN)))
	active = models.BooleanField(_(u'advertisement activation'),
				     help_text=_(u'If it is set to True, advertisement will be showed on the site. Only one advertisement should be active.'))

	def __unicode__(self):
		return self.title

	class Meta:
		verbose_name = _(u'Top advertisement')

class Side_advertisment(models.Model):
	title = models.CharField(_(u'title of advertisement'), max_length=MAX_AD_TITLE_LEN,
				 help_text=_(u'Text of the title of the advertisement with maximum length {0} characters.'.format(MAX_AD_TITLE_LEN)))
	image = models.ImageField(_(u'image'), upload_to='ads/side',
				  help_text=_(u'Image of {0}x{1} px size.'.format(SIDE_AD_IMG_WIDTH, SIDE_AD_IMG_HEIGHT)))
	url = models.CharField(_(u'URL'), max_length=MAX_AD_URL_LEN,
		help_text=_(u'URL referenced by advertisement. It must have at most {0} characters and it must have also protocol specified (http://, https:// ...).'.format(MAX_AD_URL_LEN)))
	active = models.BooleanField(_(u'advertisement activation'),
				     help_text=_(u'If it is set to True, advertisement will be showed on the site. Only one advertisement should be active.'))

	def __unicode__(self):
		return self.title

	class Meta:
		verbose_name = _(u'Side advertisement')
