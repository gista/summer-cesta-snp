from django import forms
from mapdata.models import Poi
from django.utils.translation import ugettext_lazy as _
from validators import validate_lat, validate_lon

class PoiForm(forms.ModelForm):
	type = forms.IntegerField(required=True, 
			widget=forms.Select())
	lat = forms.FloatField(required=True,
			label=_(u'Latitude: (e.g. 49.04185)'))
	lon = forms.FloatField(required=True,
			label = _(u'Longitude: (e.g. 21.19626)'))
	photo = forms.ImageField(required=False)

	def clean_name(self):
		name = self.cleaned_data.get('name', '')
		if (len(name)<5):
			raise forms.ValidationError(_(u'Minimum 5characters!'))
		return name

	def clean_lat(self):
		lat = self.cleaned_data.get('lat', '')
		validate_lat(lat)
		return lat

	def clean_lon(self):
		lon = self.cleaned_data.get('lon', '')
		validate_lon(lon)
		return lon

	def clean_photo(self):
		photos = self.files
		try:
			photos = photos.getlist('photo')
			for photo in photos:
				if (photo.content_type != 'image/jpeg'):
					raise forms.ValidationError(_(u'File extension only JPEG allowed!'))
		except:
			pass

		return photos

	class Meta:
		model = Poi
		fields = ['name', 'type', 'lat', 'lon', 'note', 'photo']
		widgets = {
			'note': forms.Textarea(attrs={'style':'width: 216px; height: 60px;'}),
		}
