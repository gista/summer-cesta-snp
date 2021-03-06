{% extends "gis/admin/openlayers.js" %}
{% block base_layer %}
new OpenLayers.Layer.Google("Google Base Layer", {
		'type': google.maps.MapTypeId.HYBRID,
		'sphericalMercator' : true});
{% endblock %}

{% block extra_layers %}
var freemap_urls = ["http://t1.freemap.sk/T", "http://t2.freemap.sk/T",
	"http://t3.freemap.sk/T", "http://t4.freemap.sk/T"]

fmap = new OpenLayers.Layer.TMS(gettext("Tourist map"), freemap_urls,{
	type: "jpeg",
	getURL: get_freemap_url,
	attribution: "<a href='http://www.freemap.sk' target='_blank'>Freemap Slovakia</a>, <a href='http://www.openstreetmap.org' target='_blank'>OpenStreetMap</a>",
});

{{ module }}.map.addLayer(fmap);

{% endblock %}
