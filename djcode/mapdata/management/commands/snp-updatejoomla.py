from django.core.management.base import NoArgsCommand, CommandError
from mapdata.models import Jos_photo_id, Jos_article_id, Poi
from joomla.models import Jos_joom_gallery, Jos_content

class Command(NoArgsCommand):
	"""Class extending django-admin commands. Called with python manage.py snp-updatejoomla and
	synchronizes Jos_article_id, Jos_photo_id tables with corresponding joomla tables.
	"""

	help = 'Synchronizes Jos_article_id, Jos_photo_id tables with corresponding joomla tables.'

	def __synchronize(self, joomla_ids, mapdata_ids):
		"""Returns tuple (new_ids, old_ids), where new_ids is list of IDs needed to add
		to mapdata DB and old_ids is list of IDs, that needed to remove from mapdata DB."""
		joomla_ids = set(joomla_ids)
		mapdata_ids = set(mapdata_ids)
		new_ids = joomla_ids - mapdata_ids
		old_ids = mapdata_ids - joomla_ids
		return new_ids, old_ids

	def __update_photos(self):
		joomla_ids = Jos_joom_gallery.objects.values('id').values()
		joomla_ids = map(lambda x: x['id'], joomla_ids)
		mapdata_ids = Jos_photo_id.objects.values('id').values()
		mapdata_ids = map(lambda x: x['id'], mapdata_ids)
		new_ids, old_ids = self.__synchronize(joomla_ids, mapdata_ids)

		for old_id in old_ids:
			pois = Poi.objects.filter(jos_photo_id__id__exact=old_id)
			for poi in pois:
				poi.jos_photo_id.remove(old_id)

		Jos_photo_id.objects.filter(id__in=old_ids).delete()
		self.stdout.write('D: Deleting photos: {0}\n'.format(list(old_ids)))
		self.stdout.write('D: Adding photos: {0}\n'.format(list(new_ids)))
		for new_id in new_ids:
			Jos_photo_id(id = new_id).save()


	def __update_articles(self):
		joomla_ids = Jos_content.objects.values('id').values()
		joomla_ids = map(lambda x: x['id'], joomla_ids)
		mapdata_ids = Jos_article_id.objects.values('id').values()
		mapdata_ids = map(lambda x: x['id'], mapdata_ids)
		new_ids, old_ids = self.__synchronize(joomla_ids, mapdata_ids)

		for old_id in old_ids:
			pois = Poi.objects.filter(jos_article_id__id__exact=old_id)
			for poi in pois:
				poi.jos_article_id.remove(old_id)

		Jos_article_id.objects.filter(id__in=old_ids).delete()
		self.stdout.write('D: Deleting articles: {0}\n'.format(list(old_ids)))
		self.stdout.write('D: Adding articles: {0}\n'.format(list(new_ids)))
		for new_id in new_ids:
			Jos_article_id(id = new_id).save()

	def handle_noargs(self, **options):
		self.__update_photos()
		self.__update_articles()
