from os.path import abspath, dirname
from subprocess import Popen, PIPE

def get_version():
	""" Returns project version as string from 'git describe' command. """
	script_path = abspath(__file__)
	pipe = Popen('git --git-dir=%s/.git describe' % dirname(dirname(script_path)), stdout=PIPE, shell=True)
	version = pipe.stdout.read().strip()

	if version:
		return version
	else:
		return 'unknown version'
