all: compile-python collect-staticfiles apache-reload

compile-python:
	python -m compileall .

collect-staticfiles:
	python manage.py collectstatic --noinput

wsgi-touch:
	touch snp.wsgi

apache-reload:
	sudo /etc/init.d/apache2 reload


clean:
	find . -name "*.pyc" -exec rm -v "{}" \;
	rm -rv ../static/*
	sudo rm -rv /tmp/cache-map_cestasnp_sk/*
