from django import forms
from mapdata.models import Poi
from django.utils.translation import ugettext_lazy as _

class PoiForm(forms.ModelForm):
	lat = forms.FloatField(required=True,
			label=_(u'Latitude: (e.g. 48.45789)'))
    	lon = forms.FloatField(required=True,
			label = _(u'Longitude: (e.g. 18.437129)'))
	photo = forms.ImageField(required=False)

	def clean_name(self):
        	name = self.cleaned_data.get('name', '')
        	if (len(name)<5):
            		raise forms.ValidationError(_(u'Minimum 5characters!'))
        	return name

	def clean_lat(self):
        	lat = self.cleaned_data.get('lat', '')
        	if (lat<-90 or lat>90):
            		raise forms.ValidationError(_(u'Exceeded latitude!'))
        	return lat

	def clean_lon(self):
        	lon = self.cleaned_data.get('lon', '')
        	if (lon<-180 or lon>180):
            		raise forms.ValidationError(_(u'Exceeded longitude!'))
        	return lon

	class Meta:
		model = Poi
		fields = ['name', 'type', 'lat', 'lon', 'note', 'photo']
		widgets = {
            		'note': forms.Textarea(attrs={'style':'width: 216px; height: 60px;'}),
        	}
