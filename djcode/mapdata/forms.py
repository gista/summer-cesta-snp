from django import forms
from mapdata.models import Poi

class PoiForm(forms.ModelForm):
	lat = forms.FloatField(required=True,
			label="Zemepisna sirka:(napr. 48.45789)")
    	lon = forms.FloatField(required=True,
			label = u"Zemepisna dlzka:(napr. 18.437129)")
	photo = forms.ImageField(required=False)

	class Meta:
		model = Poi
		fields = ['name', 'type', 'lat', 'lon', 'note', 'photo']
		widgets = {
            		'note': forms.Textarea(attrs={'style':'width: 216px; height: 60px;'}),
        	}
