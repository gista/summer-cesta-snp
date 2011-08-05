{% extends "gis/admin/openlayers.js" %}
{% block base_layer %}new OpenLayers.Layer.Google("Google Base Layer", {'type': google.maps.MapTypeId.HYBRID, 'sphericalMercator' : true});{% endblock %}
{% block extra_layers %}{{ module }}.map.addLayer(new OpenLayers.Layer.OSM("OpenStreetMap"));{% endblock %}

