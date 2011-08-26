from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

def validate_lat(value):
	if(value < -90 or value > 90):
		raise ValidationError(_(u'Exceeded latitude!'))

def validate_lon(value):
	if(value < -180 or value > 180):
		raise ValidationError(_(u'Exceeded longitude!'))
