class DbRouter(object):
	def db_for_read(self, model, **hints):
		if model._meta.app_label == 'mapdata':
			return 'default'
		elif model._meta.app_label == 'josdata':
			return 'joomla'
		else:
			return None

	def db_for_write(self, model, **hints):
		if model._meta.app_label == 'mapdata':
			return 'default'
		elif model._meta.app_label == 'josdata':
			return 'joomla'
		else:
			return None

	def allow_relation(self, obj1, obj2, **hints):
		if obj1._meta.app_label == obj2._meta.app_label:
			return True
		else:
			return False

	def allow_syncdb(self, db, model):
		if model._meta.app_label == 'mapdata':
			return True
		elif model._meta.app_label == 'josdata':
			return False
		else:
			return None

