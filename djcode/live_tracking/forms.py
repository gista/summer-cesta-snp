from django import forms
from live_tracking.models import Message, Track, User
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from datetime import datetime
from django.contrib.gis.geos import Point
from django.core import validators
from validators import validate_lat, validate_lon

class PhoneField(forms.CharField):
	default_validators = [validators.RegexValidator('^\+?\d+$')]

	def __init__(self, *args, **kwargs):
		super(PhoneField, self).__init__(*args, **kwargs)

	def clean(self, value):
		return super(PhoneField, self).clean(value)

	def validate(self, value):
		try:
			User.objects.get(phone=value)
		except User.DoesNotExist:
			raise forms.ValidationError('')

class MessageField(forms.Field):

	def __init__(self, *args, **kwargs):
		super(MessageField, self).__init__(*args, **kwargs)

	def clean(self, value):
		return super(MessageField, self).clean(value)

	def to_python(self, value):
		msg = dict()
		try:
			strs = value.split(' ', 4)
			if strs[0] != 'LOC':
				raise forms.ValidationError('')
			msg['track_name'] = strs[1]
			msg['lon'] = float(strs[2])
			msg['lat'] = float(strs[3])
			msg['text'] = strs[4]
		except Exception:
			raise forms.ValidationError('')
		return msg

	def validate(self, value):
		super(MessageField, self).validate(value)
		validate_lat(value['lat'])
		validate_lon(value['lon'])

class MessageForm(forms.ModelForm):
	phone = PhoneField(required=True)		#user's phone
	message = MessageField(required=True)		#LOC Track.name MM.MMMMM MM.MMMMM text text text ...
	secret = forms.CharField(required=True)		#secret key

	def clean_secret(self):
		secret = self.cleaned_data.get('secret')
		if settings.SMSSYNC_SECRET != secret:
			raise forms.ValidationError('')
		return secret

	def clean(self):
		cleaned_data = self.cleaned_data

		msg = cleaned_data.get('message')
		if msg is None:
			self._errors['message'] = self.error_class([''])
			raise forms.ValidationError('')

		phone = cleaned_data.get('phone')
		if phone is None:
			self._errors['phone'] = self.error_class([''])
			raise forms.ValidationError('')

		tracks = Track.objects.filter(name__exact=msg['track_name']).filter(user__phone__exact=phone)
		if not len(tracks) == 1:
			self._errors['track_name'] = self.error_class([''])
			raise forms.ValidationError('')
		return cleaned_data

	def save(self, commit=True):
		msg = super(MessageForm, self).save(commit=False)

		m = self.cleaned_data.get('message')
		phone = self.cleaned_data.get('phone')
		tracks = Track.objects.filter(name__exact=m['track_name']).filter(user__phone__exact=phone)

		msg.track = tracks[0]
		msg.time = datetime.today()
		msg.text = m['text']
		msg.the_geom = Point(m['lon'], m['lat'])

		if commit:
			msg.save()
		return msg

	class Meta:
		model = Message
		fields = list()
