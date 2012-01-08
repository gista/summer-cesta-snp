from django.db import models
from django.utils.translation import ugettext_lazy as _


class Help(models.Model):
	LANGUAGES = (
		('en-us', 'English (US)'),
		('sk', 'Slovak'),
	)
	text = models.TextField(_(u'text'), help_text=_(u'Help text in HTML format.'))
	language = models.CharField(_(u'language'), max_length = 6, unique = True,
		choices = LANGUAGES, help_text=_(u'Help language.'))

	def __unicode__(self):
		return "Help (%s)" % self.language

