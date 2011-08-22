// freemap.js

function get_freemap_url (bounds) {
	var res = this.map.getResolution();
	var x = Math.round ((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
	var y = Math.round ((this.maxExtent.top - bounds.top) / (res *this.tileSize.h));
	var z = this.map.getZoom();
	var path = "/" + z + "/" + x + "/" + y;
	var url = this.url;
	if (url instanceof Array) { url = this.selectUrl(path, url); }
	return url + path;
}
