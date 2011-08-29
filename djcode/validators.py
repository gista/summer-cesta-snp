from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

def validate_lat(value):
	if value < -90 or value > 90:
		raise ValidationError(_(u'Exceeded latitude!'))

def validate_lon(value):
	if value < -180 or value > 180:
		raise ValidationError(_(u'Exceeded longitude!'))

class RangeValidator(object):
	def __init__(self, min_value, max_value):
		self.vmax = max_value
		self.vmin = min_value

	def __call__(self, value):
		if not self.vmin <= value <= self.vmax:
			raise ValidationError(_(u'Value must be between {0} and {1}.'.format(self.vmin, self.vmax)))
