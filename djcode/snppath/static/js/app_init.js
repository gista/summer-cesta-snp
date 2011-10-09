// app_init.js
var map;
var geoExtMapPanel;
var overLayers = [];
var permalinkProvider;

// Stores
var activeUsersStore;
var inactiveUsersStore;
var userRecordsStore;
var comboStore;

Ext.onReady(function() {
	Ext.QuickTips.init();
	Shadowbox.init();	

	// set map options and instantiative map
	var options = {
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:4326"),
		units: "m",
		maxResolution: 156543.0339,
		maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
		};
	map = new OpenLayers.Map('map', options);

	// add required base layers
	var gmap = new OpenLayers.Layer.Google(gettext("Google Hybrid map"),{
		type: google.maps.MapTypeId.HYBRID, 
		numZoomLevels: 20,
		});

	var freemap_urls = ["http://t1.freemap.sk/T", "http://t2.freemap.sk/T",
	    "http://t3.freemap.sk/T", "http://t4.freemap.sk/T"]
	var fmap = new OpenLayers.Layer.TMS(gettext("Tourist map"), freemap_urls,{
		getURL: get_freemap_url,
		attribution: "<a href='http://www.freemap.sk' target='_blank'>Freemap Slovakia</a>, <a href='http://www.openstreetmap.org' target='_blan-->k'>OpenStreetMap</a>",
		});

	map.addLayers([gmap, fmap]);
	map.setBaseLayer(fmap);

	// call add overlayers function
	addOverLayers();

	// call add map controls
	addMapControls();

	// the place where the map should added 
	var mapPanel = Ext.getCmp('appMap');

	// for some GeoExt components there's no created compatibility with Openlayers e.g. Openlayers.Control.Permalink
	// but the solution is to use custom iGeoExt's state permalink provider to handle permalink on GeoExt.MapPanel
	permalinkProvider = new GeoExt.state.PermalinkProvider({encodeType: false});
	
	// set it in the state manager
	Ext.state.Manager.setProvider(permalinkProvider);

	// create new map into the place holder
	geoExtMapPanel = new GeoExt.MapPanel({
		renderTo: mapPanel.body,
		map: map,
		width: mapPanel.getInnerWidth(),
		height: mapPanel.getInnerHeight(),
		zoom: 8,
		center: [2143828.1628459, 6243978.1568337],
		stateId: "map",
		prettyStateKeys: true // for pretty permalinks
		});

	// create window for partial results as measures, permalink etc.
	resultWindow = new Ext.ux.ResultWindow({
		x: geoExtMapPanel.getPosition()[0] + 5,
		y: geoExtMapPanel.getPosition()[1] + geoExtMapPanel.getHeight() - 55,
		height: 50,
		width: geoExtMapPanel.getWidth() - 10,
		frame: false,
		shadow: false,
		border: true,
		plain: true,
		draggable: false,
		resizable: false,
		cls: 'x-window-floating',
		closeAction: 'hide'
		});

	// display permalink each time state is changed
	permalinkProvider.on('statechange', function(provider, name, value) {
		var point = new OpenLayers.LonLat(provider.get('map').x, provider.get('map').y); 
		point = point.transform(map.projection, map.displayProjection);
		var link = "?";
		link += Ext.urlEncode({map_lon:point.lon.toFixed(5)});
		link += "&" + Ext.urlEncode({map_lat:point.lat.toFixed(5)});
		link += "&" + Ext.urlEncode({map_zoom:provider.get('map').zoom});

		Ext.select(".olControlPermalink").update("<a href=" + link + ">" + gettext("Permalink") + "</a>");
		});

	// user browser size adapter (IE)
	mapPanel.on('resize', function(panel, w, h) {
		geoExtMapPanel.setWidth(panel.getInnerWidth());
		geoExtMapPanel.setHeight(panel.getInnerHeight());

		cestaSNPAdvertisement.setPosition([geoExtMapPanel.getWidth() + 50,geoExtMapPanel.getPosition()[1] + 15]);
		
		resultWindow.setWidth(geoExtMapPanel.getWidth() - 10);
		resultWindow.setPosition([resultWindow.getPosition()[0], geoExtMapPanel.getPosition()[1] + geoExtMapPanel.getHeight() - 55]);
		});

	// on load listeners for init stores
	configStore.on('load', function(store){
		var jData = store.reader.jsonData
		var poi_types = jData.poi_types;
		var pois = [];
		for(var i=0; i<poi_types.length; i++){
			pois.push({'name':(i+1), 'value':poi_types[i]}); 			
			}
		comboStore.loadData(pois);

		// read permalinkProvider URL data  
		var permalink = permalinkProvider.readURL();
		if (
			permalink.hasOwnProperty('map') && 
			permalink.map.hasOwnProperty('lat') && 			
			permalink.map.hasOwnProperty('lon') &&
			permalink.map.hasOwnProperty('zoom') &&
			parseFloat(permalink.map.lat) > -90 &&
			parseFloat(permalink.map.lat) < 90 &&
			parseFloat(permalink.map.lon) > -180 &&
			parseFloat(permalink.map.lon) < 180 &&
			parseInt(permalink.map.zoom) <= map.numZoomLevels		
		) {	
			// set map permalink config
			var record = permalinkProvider.readURL().map;
			var point = new OpenLayers.LonLat(record.lon, record.lat); 
			map.setCenter(point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),record.zoom);	

			if (permalink.map.hasOwnProperty('permalink')){
				// add icon for permalink point
				var permaLinkLayer = new OpenLayers.Layer.Markers(gettext("my point"));
				map.addLayer(permaLinkLayer);

				var size = new OpenLayers.Size(32,37);
				var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
				var icon = new OpenLayers.Icon('/static/icons/permalink.png', size, offset);
				permaLinkLayer.addMarker(new OpenLayers.Marker(point, icon));
				}	
			}
		else {
			// set map default config
			var record = jData.location;
			var point = new OpenLayers.LonLat(record.lon, record.lat); 
			map.setCenter(point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),record.zoomlevel);
			}
		
		// after setup the center & zoomlevel we add SnpPathLayer
		addSnpPathLayer();
		
		// prepare data for loading into stores with specific content
		var activeTracks = [];
		var inactiveTracks = [];
		var data = jData.live_users;
		for(var i=0;i<data.length;i++){
			var tracks = data[i].tracks;
			for(var j=0;j<tracks.length;j++){
				if (tracks[j].is_active){
					activeTracks.push({username:data[i].username, track_id:tracks[j].id,
					    description:tracks[j].description, last_location_time: tracks[j].last_location_time});
					}
				else {
					inactiveTracks.push({username:data[i].username, track_id:tracks[j].id, 
					    description:tracks[j].description, last_location_time: tracks[j].last_location_time});
					}
				}
			}

		//console.log(activeTracks);
		//console.log(inactiveTracks);

		// fill the stores with created active & inactive records
		activeLiveTrackingStore.loadData(activeTracks);
		inactiveLiveTrackingStore.loadData(inactiveTracks);

		// set the side advertisement
		var side = jData.advertisement.side;
		
		if (side.hasOwnProperty('title') && side.hasOwnProperty('image') && side.hasOwnProperty('url')){
			var hrefBox = new Ext.BoxComponent({
				autoEl: {
					'tag': 'a',
					'href': side.url,
					'target': '_blank',
					'html': '<img src="'+ side.image +'" style="width:236px; height:110px" title="'+ side.title +'" alt="'+ side.title +'">',
					}
				});

			Ext.getCmp('sideAdvertisementLayers').add(hrefBox);
			Ext.getCmp('sideAdvertisementLayers').doLayout();
			Ext.getCmp('sideAdvertisementLiveTracking').add(hrefBox.cloneConfig());
			Ext.getCmp('sideAdvertisementLiveTracking').doLayout();
			Ext.getCmp('sideAdvertisementAddPoi').add(hrefBox.cloneConfig());
			Ext.getCmp('sideAdvertisementAddPoi').doLayout();
			}

		// advertisement background window for cestaSNP.sk
		cestaSNPAdvertisement = new Ext.Window({
			x: geoExtMapPanel.getWidth() + 50,
			y: geoExtMapPanel.getPosition()[1] + 15,
			height: 100,
			width: 190,
			resizable: false,
			hidden: false,
			header: false,
			border: false,
			closable: false,
			draggable: false,
			frame: false,
			shadow: false,
			border: true,
			items:[{
				xtype: 'box',
				height: 90,
				width: 180,
				autoEl: {
					'tag': 'a',
					'href': 'http://cestasnp.sk/',
					'target': '_blank',
					'html': '<img src="/static/icons/cestaSNP.png" style="width:180px; height:90px;" title="CestaSNP.sk" alt="CestaSNP.sk">',
					}		
				}]
			});

		// set the top advertisement window
		var top = jData.advertisement.top;

		if (top.hasOwnProperty('title') && top.hasOwnProperty('image') && top.hasOwnProperty('url') && top.hasOwnProperty('transparency')){
			// advertisement background window with custom opacity
			headerAdvertisement = new Ext.Window({
				x: geoExtMapPanel.getPosition()[0] + 100,
				y: geoExtMapPanel.getPosition()[1] + 5,
				height: 100,
				width: 700,
				bodyCfg: {
					cls: 'x-window-advertisement',
					style: "opacity: " + top.transparency,
					},
				resizable: false,
				hidden: false,
				header: false,
				border: false,
				closable: false,
				draggable: false,
				frame: false,
				shadow: true,
				border: true,
				});

			// advertisement foreground window with custom advertisement
			headerAdvertisement = new Ext.Window({
				x: geoExtMapPanel.getPosition()[0] + 100,
				y: geoExtMapPanel.getPosition()[1] + 5,
				height: 100,
				width: 700,
				resizable: false,
				hidden: false,
				header: false,
				border: false,
				closable: false,
				draggable: false,
				frame: false,
				shadow: false,
				border: true,
				items:[{
					xtype: 'box',
					height: 100,
					width: 700,
					autoEl: {
						'tag': 'a',
						'href': top.url,
						'target': '_blank',
						'html': '<img src="'+ top.image +'" style="width:680px; height:80px; padding: 10px;" title="'+ top.title +'" alt="'+ top.title +'">',
						}	
					}]
				});
			}
		});

	configStore.load();
	});

function addMapControls(){

	map.addControls([
		//new OpenLayers.Control.Permalink(),
		new OpenLayers.Control.Panel({
			displayClass: 'olControlPermalink',		
			}),
		new OpenLayers.Control.ScaleLine(),
		new OpenLayers.Control.MousePosition(),
		]);

	// Toggle buttons for map functionality	

	var lengthMeasureToggleButton, clickToggleButton, navigationToggleButton;

	// Controller for navigation
	var navigationController = new OpenLayers.Control.Navigation();

	map.addControl(navigationController);

	navigationToggleButton = new OpenLayers.Control.Button({
		title: gettext('Navigation'),
		displayClass: 'olControlNavigation', 
		eventListeners: {
			'activate': function(){
				lengthMeasureToggleButton.deactivate();
				clickToggleButton.deactivate();

				navigationController.activate();
				},
			'deactivate': function(){
				navigationController.deactivate();
				}	
			},
		type: OpenLayers.Control.TYPE_TOGGLE		
		})
	
	// Controller to measure the length of points

	var lengthMeasureController = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
		persist: true,
		immediate: true,
		geodesic: true,
		eventListeners: {
			"measure": handleMeasurements,
			//"measurepartial": handleMeasurements	
			}
		});

	map.addControl(lengthMeasureController);

	lengthMeasureToggleButton = new OpenLayers.Control.Button({
		title: gettext('Length measure'),
		displayClass: 'olControlDrawFeaturePath', 
		eventListeners: {
			'activate': function(){
				navigationToggleButton.deactivate();
				clickToggleButton.deactivate();

				lengthMeasureController.activate();
				},
			'deactivate': function(){
				lengthMeasureController.deactivate();
				}	
			},
		type: OpenLayers.Control.TYPE_TOGGLE
		});

	// Click controller to show the point info	

	var clickController = new OpenLayers.Control.Click({
		trigger: function(e) {
			var userClick = map.getLonLatFromViewPortPx(e.xy); 
			showLinkToPoint(userClick);
			},
		});

	map.addControl(clickController);

	// Toggle button to activate/deactivate the click controller	

	clickToggleButton = new OpenLayers.Control.Button({
		title: gettext('Point link (coordinates & permalink)'),
		displayClass: "olControlDrawFeaturePoint", 
		eventListeners: {
			'activate': function(){
				navigationToggleButton.deactivate();
				lengthMeasureToggleButton.deactivate();

				clickController.activate();
				},
			'deactivate': function(){
				clickController.deactivate();
				}	
			},
		type: OpenLayers.Control.TYPE_TOGGLE
		});

	// Controller button to export POI into GPX

	var gpxButton = new OpenLayers.Control.Button({
		title: gettext('Export all data into .gpx'),
		displayClass: "olControlGPXButton", 
		trigger: function(){
			document.location.href = "mapdata/gpx/"
			} 
		});

	// help window with autoLoaded html data from URL 'help'

	var helpWindow = new Ext.Window({
		autoWidth: true,
		autoHeight: true,
		title: gettext('Help'),
		id: 'helpWindow',
		closeAction: 'hide', 
		autoLoad:{
			url: 'help/',			
			},					
		});

	var helpButton = new OpenLayers.Control.Button({
		title: gettext('Show help'),
		displayClass: "olControlHelpButton", 
		trigger: function(){
			helpWindow.show();	
			} 
		});	

	var controlPanel = new OpenLayers.Control.Panel({
		displayClass: 'olControlEditingToolbar',		
		});

	controlPanel.addControls([
		navigationToggleButton,
		lengthMeasureToggleButton,
		clickToggleButton,
		gpxButton,
		helpButton,
		]);

	map.addControl(controlPanel);	

	}

function addOverLayers(){

	// create basic filter to applied for a map
	filterPhoto = new OpenLayers.Filter.Logical({
		type: OpenLayers.Filter.Logical.OR,
		filters: [
			new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.EQUAL_TO,
				property: 'has_photo',
				value: true
				}),
			new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.EQUAL_TO,
				property: 'has_photo',
				value: false
				})
			]
		});

	filterArticle = new OpenLayers.Filter.Logical({
		type: OpenLayers.Filter.Logical.OR,
		filters: [
			new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.EQUAL_TO,
				property: 'has_article',
				value: true
				}),
			new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.EQUAL_TO,
				property: 'has_article',
				value: false
				})
			]
		});

	// create filter for photos & articles
	filterHasPhoto = new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: 'has_photo',
			value: true
			});

	filterHasArticle = new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: 'has_article',
			value: true
			});

	var styleMap = [];
	var layersLength = LayerSettings().getLength();
	for(var i=0; i<layersLength; i++){
		var current = LayerSettings().get(i);
		var defaultStyle = new OpenLayers.Style({
			pointRadius: 10,
			externalGraphic: current.background,
			graphicYOffset: -35,
			graphicWidth: 32,
			graphicHeight: 37,
			cursor: 'pointer'
			});
		var selectStyle = new OpenLayers.Style({
			pointRadius: 10,
			externalGraphic: current.background_selected,
			graphicYOffset: -35,
			graphicWidth: 32,
			graphicHeight: 37,
			cursor: 'pointer'
			});
		styleMap[i] = new OpenLayers.StyleMap({
			'default': defaultStyle,
			'select': selectStyle
			});
		}

	// append map over layers as specified
	
	for(var i=0; i<layersLength; i++){
		var j = layersLength-1-i;
		var current = LayerSettings().get(j);
		overLayers[i] = new OpenLayers.Layer.Vector(current.name, {
			visibility: current.visibility,
			styleMap: styleMap[j],
			strategies: [
				new OpenLayers.Strategy.Filter({
					filter: filterPhoto
					}),
				new OpenLayers.Strategy.Filter({
					filter: filterArticle
					}),
				new OpenLayers.Strategy.Fixed(),
				],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois/?" + Ext.urlEncode({type:current.urlId}),
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			});			
		}
	
	// Add overLayers to map layers
	map.addLayers(overLayers);

	// Add a select feature control
	var select_feature_control = new OpenLayers.Control.SelectFeature(overLayers,{
			clickout: true, toggle: false,
			multiple: false, hover: false,
			}
		);
	map.addControl(select_feature_control);
	select_feature_control.activate();

	// Add on select feature listener
	
	for(var i=0;i<7;i++){
		overLayers[i].events.on({
			"featureselected": function(e) {			
				createPoint(e.feature);
				select_feature_control.unselect(e.feature);
				}
			});
		}
	}

var def_simplify = 25;
var no_simplify = 0;
var simplify = def_simplify;

function addSnpPathLayer(){
	var snpPathLayerFixed;

	// if case, that the map was set by permalink to max zoomlevel, we change to no_simplify
	if (map.numZoomLevels - map.getZoom() < 2){
		simplify = no_simplify;
	}
	snpPathLayerFixed = addSnpPathFixedLayer();
	map.addLayer(snpPathLayerFixed);

	map.events.on({"zoomend": function(){
		var tree = Ext.getCmp('overLayerTree');

		if (map.numZoomLevels - map.getZoom() < 2 && simplify == def_simplify){
			simplify = no_simplify;
			snpPathLayerFixed.refresh({
				force: true,
				url: "mapdata/geojson/snppath/",
				params: {
//					key: Math.random(),
					simplify: simplify
				}
			});
		} else if (simplify == no_simplify) {
			simplify = def_simplify;
			snpPathLayerFixed.refresh({
				force: true,
				url: "mapdata/geojson/snppath/",
				params: {
//					key: Math.random(),
					simplify: simplify
				}
			});
		}
	}});
}

function addSnpPathFixedLayer(){
	// create & return SNPpath layer with Fixed strategy
	var defaultStyle = new OpenLayers.Style({
			strokeColor: "red", 
			strokeWidth: 4,
			strokeOpacity: 0.5,
			cursor: "pointer"
	});


	var snpPathFixed = new OpenLayers.Layer.Vector(gettext("SNP Path"), {
		visibility: true,
		styleMap: new OpenLayers.StyleMap({
			'default': defaultStyle,
		}),
		strategies: [new OpenLayers.Strategy.Fixed()],
		protocol: new OpenLayers.Protocol.HTTP({
			url: "mapdata/geojson/snppath/",
			params: {
//				key: Math.random(),
				simplify: simplify
			},
			format: new OpenLayers.Format.GeoJSON({
				ignoreExtraDims: true,
				projection: new OpenLayers.Projection("EPSG:900913")
			})
		})
	});
	return snpPathFixed;
}
