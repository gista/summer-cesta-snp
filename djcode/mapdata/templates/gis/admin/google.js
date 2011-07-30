{% extends "gis/admin/openlayers.js" %}
{% block base_layer %}new OpenLayers.Layer.Google("Google Base Layer", {'type': G_HYBRID_MAP, 'sphericalMercator' : true});{% endblock %}
