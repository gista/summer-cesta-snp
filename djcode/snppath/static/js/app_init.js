// app_init.js

var map;
var geoExtMapPanel;
// Stores
var activeUsersStore;
var inactiveUsersStore
var userRecordsStore;

Ext.onReady(function() {

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
	var gmap = new OpenLayers.Layer.Google("Turistická mapa",{
		type: google.maps.MapTypeId.HYBRID, 
		numZoomLevels: 20,
		});
	var osm = new OpenLayers.Layer.OSM("Satelitná mapa");
	map.addLayers([osm,gmap]);

	// call add overlayers function
	addOverLayers();

	// call add map controls
	addMapControls();

	// the place where the map should added 
	var mapPanel = Ext.getCmp('appMap');

	// create new map into the place holder
	geoExtMapPanel = new GeoExt.MapPanel({
		renderTo: mapPanel.body,
		map: map,
		width: mapPanel.getInnerWidth(),
		height: mapPanel.getInnerHeight(),
		zoom: 5,
		});

	// user browser size adapter (IE)
	mapPanel.on('resize', function(panel, w, h) {
		geoExtMapPanel.setWidth(panel.getInnerWidth());
		geoExtMapPanel.setHeight(panel.getInnerHeight());
		});

	// on load listeners for init stores
	configStore.on('load', function(store){
		var jData = store.reader.jsonData
		
		// set map default config
		var record = jData.location;
		var point = new OpenLayers.LonLat(record.lon, record.lat); 
		map.setCenter(point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),record.zoomlevel);

		// after setup the center & zoomlevel we add SnpPathLayer
		addSnpPathLayer();

		// fill the poi types combobox with data read from JsonDATA 
		var comboBox = Ext.getCmp('pointCats');
		comboBox.store = jData.poi_types;
		
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

		});

	userRecordsStore.on('load', function(store){
		// after loading data set current center into the first user record
		var record = store.getAt(0).data;
		var point = new OpenLayers.LonLat(record.lon, record.lat); 
		map.setCenter(point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),10);

		// select the first record in grid panel
		var liveTrackingRecordPanel = Ext.getCmp("liveTrackingRecords");

		// after loading data show the Record grid panel
		liveTrackingRecordPanel.getSelectionModel().selectFirstRow();
		liveTrackingRecordPanel.show();	
		
		// set the correct height for the vertical scrollers in track messages
		liveTrackingRecordPanel.setHeight(Ext.getCmp('liveTrackingPanel').getHeight());	
		});

	configStore.load();
	});

function addMapControls(){
	
	map.addControls([
		new OpenLayers.Control.Permalink(),
		new OpenLayers.Control.ScaleLine(),
		new OpenLayers.Control.MousePosition(),
		]);

	// Toggle buttons for map functionality	
	
	var lengthMeasureToggleButton, areaMeasureToggleButton, clickToggleButton;

	
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
		title: 'Meranie vzdialenosti',
		displayClass: 'olControlAreaMeasureButton', 
		eventListeners: {
			'activate': function(){
				//areaMeasureToggleButton.deactivate();
				//clickToggleButton.deactivate();

				lengthMeasureController.activate();
				},
			'deactivate': function(){
				lengthMeasureController.deactivate();
				}	
			},
		type: OpenLayers.Control.TYPE_TOGGLE
		});

	/*
	Controller to measure the area size	
	*/

	var areaMeasureController = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
		persist: true,
		immediate: true,
		geodesic: true,
    		eventListeners: {
			"measure": handleMeasurements,
 			//"measurepartial": handleMeasurements
    			}
		});

	map.addControl(areaMeasureController);
	
	//Toggle button to activate/deactivate the area measure controller	

	areaMeasureToggleButton = new OpenLayers.Control.Button({
		title: 'Meranie plochy',
		displayClass: "olControlAreaMeasureButton", 
		eventListeners: {
			'activate': function(){
				lengthMeasureToggleButton.deactivate();
				clickToggleButton.deactivate();

				areaMeasureController.activate();
				},
			'deactivate': function(){
				areaMeasureController.deactivate();
				}	
			},
		type: OpenLayers.Control.TYPE_TOGGLE
		});

	// Click controller to show the point info	

	var clickController = new OpenLayers.Control.Click({
		trigger: function(e) {
			var userClick = map.getLonLatFromViewPortPx(e.xy); 
			showPopup(userClick);
			},
		});

	map.addControl(clickController);

	
	// Toggle button to activate/deactivate the click controller	

	clickToggleButton = new OpenLayers.Control.Button({
		title: 'Zobrazenie info o bode (súradnice + permalink)',
		displayClass: "olControlClickButton", 
		eventListeners: {
			'activate': function(){
				lengthMeasureToggleButton.deactivate();
				areaMeasureToggleButton.deactivate();

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
		title: 'Exportovanie všetkých dát do .gpx',
    		displayClass: "olControlGPXButton", 
		trigger: function(){
			document.location.href = "gpx/"
			} 
		});	

	// help window with autoLoaded html data from URL 'help'

	var helpWindow = new Ext.Window({
		autoWidth: true,
		autoHeight: true,
		title: 'Help',
		closeAction: 'hide', 
		autoLoad:{
			url: 'help/',			
			},					
		});

	var helpButton = new OpenLayers.Control.Button({
		title: 'Zobrazenie pomocníka',
    		displayClass: "olControlHelpButton", 
		trigger: function(){
			helpWindow.show();	
			} 
		});	

	var controlPanel = new OpenLayers.Control.Panel({
		displayClass: 'olControlRightToolbar',		
		});

	controlPanel.addControls([
		lengthMeasureToggleButton,
		areaMeasureToggleButton,
		areaMeasureToggleButton,
		clickToggleButton,
		gpxButton,
		helpButton,
		]);

	map.addControl(controlPanel);	

	}

function addOverLayers(){

	var OVER_LAYERS = [
		[1, 'útulne, prístrešky', true],
		[2, 'chaty', true],
		[3, 'voda', true],
		[4, 'stravovanie, krčmy', true],
		[5, 'potraviny', true],
		[6, 'zaujímavé miesta', false],
		[7, 'nezaradené', false],
		];


	// create basic filter for applied for a map
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

	strategyPhoto = new OpenLayers.Strategy.Filter({
		filter: filterPhoto
		});

	strategyArticle = new OpenLayers.Strategy.Filter({
		filter: filterHasArticle
		});

	// append map over layers as specified
	var overLayers = [ 
		new OpenLayers.Layer.Vector(OVER_LAYERS[6][1], {
			visibility:OVER_LAYERS[6][2],
			strategies: [
				new OpenLayers.Strategy.Fixed(),
				strategyPhoto,
				strategyArticle
				],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois/?" + Ext.urlEncode({type:OVER_LAYERS[6][0]}),
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[5][1], {
			visibility:OVER_LAYERS[5][2],
			strategies: [
				new OpenLayers.Strategy.Fixed(),
				strategyPhoto,
				strategyArticle
				],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois/?" + Ext.urlEncode({type:OVER_LAYERS[5][0]}),
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[4][1], {
			visibility:OVER_LAYERS[4][2],
			strategies: [
				new OpenLayers.Strategy.Fixed(),
				strategyPhoto,
				strategyArticle
				],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois/?" + Ext.urlEncode({type:OVER_LAYERS[4][0]}),
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[3][1], {
			visibility:OVER_LAYERS[3][2],
			strategies: [
				new OpenLayers.Strategy.Fixed(),
				strategyPhoto,
				strategyArticle				
				],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois/?" + Ext.urlEncode({type:OVER_LAYERS[3][0]}),
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[2][1], {
			visibility:OVER_LAYERS[2][2],
			strategies: [
				new OpenLayers.Strategy.Fixed(),
				strategyPhoto,
				strategyArticle				
				],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois/?" + Ext.urlEncode({type:OVER_LAYERS[2][0]}),
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[1][1], {
			visibility:OVER_LAYERS[1][2],
			strategies: [
				new OpenLayers.Strategy.Fixed(),
				strategyPhoto,
				strategyArticle
				],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois/?" + Ext.urlEncode({type:OVER_LAYERS[1][0]}),
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[0][1], {
			visibility:OVER_LAYERS[0][2],
			strategies: [
				new OpenLayers.Strategy.Fixed(),
				strategyPhoto,
				strategyArticle				
				],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois/?" + Ext.urlEncode({type:OVER_LAYERS[0][0]}),
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		];
	
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
	console.log(overLayers[0]);
	
	for(var i=0;i<7;i++){
		overLayers[i].events.on({
	     		"featureselected": function(e) {			
				createPoint(e.feature);
        	        	},
       			"featureunselected": function(e) {
              			//popup = null;
        	        	}
        	    	});
		}
	
	}

function addSnpPathLayer(){
	// create bbox from map for url request & convert to correct projection
	var mapBounds = map.calculateBounds();
	mapBounds.transform(map.projection,map.displayProjection);

	// SNPpath layer
	var snpPathLayer = new OpenLayers.Layer.Vector("SNP Path", {
		style: {
			strokeColor: "red", 
			strokeWidth: 2, 
			cursor: "pointer"
			},
		strategies: [new OpenLayers.Strategy.Fixed()],
		protocol: new OpenLayers.Protocol.HTTP({
			url: "mapdata/geojson/snppath/?" + Ext.urlEncode({geom_simplify:25, bbox:mapBounds.toBBOX()}),
			format: new OpenLayers.Format.GeoJSON({
				ignoreExtraDims: true,
				projection: new OpenLayers.Projection("EPSG:900913")
				})
			})
		});
	
	map.addLayer(snpPathLayer);
	}
