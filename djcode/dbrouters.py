class DbRouter(object):
	"""Class routing accesses to the multiple databases."""

	def db_for_read(self, model, **hints):
		"""Method routing reading accesses according to application name:
		mapdata routes to default DB (postGIS)
		joomla routes to joomla DB
		"""
		if model._meta.app_label == 'mapdata':
			return 'default'
		elif model._meta.app_label == 'joomla':
			return 'joomla'
		else:
			return None

	def db_for_write(self, model, **hints):
		"""Method routing writing accesses according to application name:
		mapdata routes to default DB (postGIS)
		joomla is not allow to write to DB
		"""
		if model._meta.app_label == 'mapdata':
			return 'default'
		else:
			return None                     #Don't write any changes to Joomla DB

	def allow_relation(self, obj1, obj2, **hints):
		"""Method controlling relations between objects. Relations are allowed
		only between objects from the same DB.
		"""
		if obj1._meta.app_label == obj2._meta.app_label:
			return True
		else:
			return False

	def allow_syncdb(self, db, model):
		"""Method controlling synchronising models with DB. Only models in default
		DB (postGIS) is allowed synchronising.
		"""
		if db == 'joomla':
		    return False
		if model._meta.app_label == 'mapdata':
			return True
		elif model._meta.app_label == 'joomla':
			return False
		else:
			return None
