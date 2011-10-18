// freemap.js

var fmap = {};

function InBox(x, y, L, R, T, B) {
	return ((x >= L) && (x <= R) && (y >= T) && (y <= B));
}

function getTileX(bounds) {
	return Math.round((bounds.left - fmap.map.maxExtent.left) / (fmap.map.getResolution() * fmap.map.tileSize.w));
}

function getTileY(bounds) {
	return Math.round ((fmap.map.maxExtent.top - bounds.top) / (fmap.map.getResolution() * fmap.map.tileSize.h));
}

function get_freemap_url (bounds) {
	var x = getTileX(bounds);
	var y = getTileY(bounds);
	var z = fmap.map.getZoom();
	var path = "/" + z + "/" + x + "/" + y;

	var useFreeMap = false;
	if 	(z == 8  && InBox(x, y, 139, 144, 87, 89)) useFreeMap = !useFreeMap;
	else if	(z == 9  && InBox(x, y, 279, 288, 174, 178)) useFreeMap = !useFreeMap;
	else if	(z == 10 && InBox(x, y, 559, 576, 348, 357)) useFreeMap = !useFreeMap;
	else if	(z == 11 && InBox(x, y, 1119,1152,697,714)) useFreeMap = !useFreeMap;
	else if	(z == 12 && InBox(x, y, 2239, 2304, 1395, 1428)) useFreeMap = !useFreeMap;
	else if	(z == 13 && InBox(x, y, 4478, 4609, 2791, 2856)) useFreeMap = !useFreeMap;
	else if	(z == 14 && InBox(x, y, 8957, 9219, 5583, 5713)) useFreeMap = !useFreeMap;
	else if (z == 15 && InBox(x, y, 17916,18438,11167,11427)) {
		userFreeMap = !(InBox(x, y, 17916, 17984, 11167, 11200) || InBox(x, y, 18160,18438,11370,11427) || InBox(x, y, 18102,18438,11394,11427));
	}
	else if (z == 16 && InBox(x, y, 35832,36876,22334,22855)) {
		userFreeMap = !(InBox(x, y, 35832,35968,22334,22400) || InBox(x, y, 36320,36876,22740,22855) || InBox(x, y, 32204,36876,22788,22855)); 
		}

	if (useFreeMap) {
		var url = fmap.selectUrl(path, fmap.url);
		path += ".jpeg"; 
	} else {
		var url = 'http://tile.openstreetmap.org';
		path += ".png";
	}

	return url + path;
}
