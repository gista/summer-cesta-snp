from django import forms
from django.core.validators import URLValidator, MaxLengthValidator
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from django.core.files.images import get_image_dimensions

from validators import RangeValidator
from advertisement.models import *

class TopAdvertisementAdminForm(forms.ModelForm):
	class Meta:
		model = Top_advertisement

	def clean_transparency(self):
		transparency = self.cleaned_data['transparency']
		RangeValidator(0, 1)(transparency)
		return transparency

	def clean_image(self):
		image = self.cleaned_data['image']
		width, height = get_image_dimensions(image)
		if width != TOP_AD_IMG_WIDTH or height != TOP_AD_IMG_HEIGHT:
			raise ValidationError(_(u'Image must have {0}x{1} px size.'.format(TOP_AD_IMG_WIDTH,
											 TOP_AD_IMG_HEIGHT)))
		return image

	def clean_title(self):
		title = self.cleaned_data['title']
		try:
			MaxLengthValidator(MAX_AD_TITLE_LEN)(title)
		except ValidationError:
			raise ValidationError(_(u'Must have at most {0} characters'.format(MAX_AD_TITLE_LEN)))
		return title

	def clean_url(self):
		url = self.cleaned_data['url']
		try:
			MaxLengthValidator(MAX_AD_URL_LEN)(url)
		except ValidationError:
			raise ValidationError(_(u'Must have at most {0} characters.'.format(MAX_AD_URL_LEN)))
		try:
			URLValidator()(url)
		except ValidationError:
			raise ValidationError(_(u'Invalid URL.'))
		return url

class SideAdvertisementAdminForm(forms.ModelForm):
	class Meta:
		model = Side_advertisement

	def clean_title(self):
		title = self.cleaned_data['title']
		try:
			MaxLengthValidator(MAX_AD_TITLE_LEN)(title)
		except ValidationError:
			raise ValidationError(_(u'Must have at most {0} characters'.format(MAX_AD_TITLE_LEN)))
		return title

	def clean_image(self):
		image = self.cleaned_data['image']
		width, height = get_image_dimensions(image)
		if width != SIDE_AD_IMG_WIDTH or height != SIDE_AD_IMG_HEIGHT:
			raise ValidationError(_(u'Image must have {0}x{1} px size.'.format(SIDE_AD_IMG_WIDTH,
											 SIDE_AD_IMG_HEIGHT)))
		return image

	def clean_url(self):
		url = self.cleaned_data['url']
		try:
			MaxLengthValidator(MAX_AD_URL_LEN)(url)
		except ValidationError:
			raise ValidationError(_(u'Must have at most {0} characters.'.format(MAX_AD_URL_LEN)))
		try:
			URLValidator()(url)
		except ValidationError:
			raise ValidationError(_(u'Invalid URL.'))
		return url
