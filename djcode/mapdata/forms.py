from django import forms
from mapdata.models import Poi

class PoiForm(forms.ModelForm):
	lat = forms.FloatField(required=True,
			label="Zemepisna sirka:(napr. 48.45789)")
    	lon = forms.FloatField(required=True,
			label = u"Zemepisna dlzka:(napr. 18.437129)")
	photo = forms.ImageField(required=False)

	def clean_name(self):
        	name = self.cleaned_data.get('name', '')
        	if (len(name)<5):
            		raise forms.ValidationError("Minimum 5characters!")
        	return name

	def clean_lat(self):
        	lat = self.cleaned_data.get('lat', '')
        	if (lat<-90 or lat>90):
            		raise forms.ValidationError("Exceeded latitude!")
        	return lat

	def clean_lon(self):
        	lon = self.cleaned_data.get('lon', '')
        	if (lon<-180 or lon>180):
            		raise forms.ValidationError("Exceeded longitude!")
        	return lon

	class Meta:
		model = Poi
		fields = ['name', 'type', 'lat', 'lon', 'note', 'photo']
		widgets = {
            		'note': forms.Textarea(attrs={'style':'width: 216px; height: 60px;'}),
        	}
