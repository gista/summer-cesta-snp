all: compile-python collect-staticfiles touch-wsgi

compile-python:
	python -m compileall .

collect-staticfiles:
	python manage.py collectstatic --noinput

touch-wsgi:
	touch snp.wsgi


clean:
	find . -name "*.pyc" -exec rm -v "{}" \;
	rm -rv ../static/*
