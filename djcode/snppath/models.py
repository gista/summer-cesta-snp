from django.db import models
from django.utils.translation import ugettext_lazy as _

class Help(models.Model):
	text = models.TextField(_(u'help text'), help_text=_(u'Help text in HTML format.'))
	language = models.CharField(_(u'language code'), max_length = 10, unique = True, help_text=_(u'Language code of the text language.'))
