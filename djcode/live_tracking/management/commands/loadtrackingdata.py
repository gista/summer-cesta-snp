from django.core.management.base import NoArgsCommand, CommandError
from live_tracking.models import User, Message, Sync_log
from django.contrib.gis.geos import Point
from django.db import transaction
from collections import namedtuple
import httplib
import json
from datetime import datetime, date, time, timedelta

URL = 'dev.freemap.sk'
PORT = 21180
DATETIME_FORMAT = '%Y-%m-%d %H:%M:%S'
DATE_FORMAT = '%Y-%m-%d'
OLDEST_DATE = date(2000, 1, 1)
EMPTY_DATE = '0000-00-00'

class Command(NoArgsCommand):
	"""Class extending django-admin commands. Called with python manage.py loadtrackingdata
	and updates DB of live tracking based on informations from remote server.
	"""

	help = 'Fetches live tracking data from remote location and stores it in the database.'


	def __is_empty_json(self, json):
		"""Tests whether json is empty.
		Empty jsons are: "", [], {}
		"""
		return True if len(json) == 0 else False

	def __minutes2decimal(self, h, m, s):
		"""Converts minutes format to decimal format."""
		return h + float(m) / 60.0 + float(s) / 3600.0

	def __str2degrees(self, s):
		"""Extracts hours, minutes and seconds from string with format:
		hh.mmssss
		"""
		h, ms = s.split('.')
		m = ms[:2]
		s = ms[2:] if len(ms) > 2 else 0
		Degree = namedtuple('Degree', ['h', 'm', 's'])
		return Degree(int(h), int(m), int(s))

	def __fetch_users_json(self):
		"""Fetches all users from freemap API."""
		try:
			conn = httplib.HTTPConnection(URL, PORT)
			request_url = '/api/0.1/cestasnp/users'

			self.stdout.write('D: GET:{0}\n'.format(request_url))
			conn.request('GET', request_url)
			resp = conn.getresponse()
			users_json = resp.read()
			conn.close()
		except httplib.HTTPException:
			raise CommandError('Error connecting to http://%s:%d/api/0.1/cestasnp/users' % (URL, PORT))
		try:
			return json.loads(users_json)
		except ValueError:
			raise CommandError('Error extracting json from string:\n{0}'.format(users_json))

	def __fetch_msgs_json(self, user_ids, datetime_from=OLDEST_DATE):
		"""Fetches all messages from freemap API of all users with list of IDs user_ids and older
		than date (or datetime) datetime_from (default OLDEST_DATE).
		"""
		if type(datetime_from) == datetime:
			date_from = datetime_from.date()
			time_from = datetime_from.time().replace(microsecond=0)
		else:						#type(datetime_from) == date
			date_from = datetime_from
			time_from = time(0, 0, 0)
		try:
			conn = httplib.HTTPConnection(URL, PORT)
			request_url = '/api/0.1/cestasnp/user/?id={0}&date_from={1}%20{2}'.format(','.join(user_ids),
												date_from.isoformat(),
												time_from.isoformat())
			self.stdout.write('D: GET:{0}\n'.format(request_url))
			conn.request('GET', request_url)
			resp = conn.getresponse()
			msgs_json = resp.read()
			conn.close()
		except httplib.HTTPException:
			raise CommandError('Error connecting to {0}:{1}{2}'.format(URL, PORT, request_url))
		try:
			return json.loads(msgs_json)
		except ValueError:
			raise CommandError('Error extracting json from string:\n{0}'.format(msgs_json))

	def __try_create_user(self, user_id, user_info):
		"""Creates or updates user in DB with ID user_id, based on data from json user_info.
		* If user doesn't exist in DB, it will be created, otherwise will be untouched.
		"""
		try:
			usr_db = User.objects.get(id=user_id)
		except User.DoesNotExist:
			usr = User(id=user_id, name=user_info['user'], track_name=user_info['device'])
			if user_info['description'] is not None:
				usr.description = user_info['description']

			if user_info['date_from'] is not None and user_info['date_from'] != EMPTY_DATE:
				usr.date_from = datetime.strptime(user_info['date_from'],
								DATE_FORMAT).date()

			if user_info['date_to'] is not None and user_info['date_to'] != EMPTY_DATE:
				usr.date_to = datetime.strptime(user_info['date_to'],
								DATE_FORMAT).date()

			usr.save()
			return usr
		return usr_db

	def __add_msgs(self, user, msgs_json):
		"""Adds messages to DB from user based on json msgs_json informations."""
		if self.__is_empty_json(msgs_json):
			return

		#iterate only over message infos belonging to given user
		for msg_info in filter(lambda x:x['device_id'] == user.id, msgs_json.values()):
			msg = Message(user=user)
			if msg_info['located'] is not None:
				msg.time = datetime.strptime(msg_info['located'], DATETIME_FORMAT)
			if msg_info['status'] is not None:
				msg.text = msg_info['status']
			if (msg_info['lat'] is not None and msg_info['lon'] is not None) and \
			   (msg_info['lat'] != '0' and msg_info['lon'] != '0'):
				if msg_info['latlon_format'] == 'D': 	#Decimal Format
					lon = float(msg_info['lon'])
					lat = float(msg_info['lat'])
				else:					#Minutes Format ('M')
					lat_deg = self.__str2degrees(msg_info['lat'])
					lat = self.__minutes2decimal(lat_deg.h, lat_deg.m, lat_deg.s)
					lon_deg = self.__str2degrees(msg_info['lon'])
					lon = self.__minutes2decimal(lon_deg.h, lon_deg.m, lon_deg.s)
				msg.the_geom = Point(lon, lat)
			msg.save()

	def handle_noargs(self, **options):
		"""Handler of Command class. Adds and updates users, adds all messages created
		later than last stored message of given user. On success writes to sync_log actual
		date and time and success value.
		"""
		sync_log = Sync_log(time=datetime.today(), success=False)
		try:
			with transaction.commit_on_success():
				users_json = self.__fetch_users_json()
				user_ids = users_json.keys()
				new_users = (self.__try_create_user(user_id, users_json[user_id]) for user_id in user_ids)
				try:
					latest_db_msg = Sync_log.objects.filter(success=True).latest()
					fetch_from = latest_db_msg.time + timedelta(seconds = 1)
				except Sync_log.DoesNotExist:
					fetch_from = OLDEST_DATE
				finally:
					msgs_json = self.__fetch_msgs_json(user_ids,
									datetime_from=fetch_from)
				for user in new_users:
					self.__add_msgs(user, msgs_json)
			sync_log.success = True
		finally:
			sync_log.save()
