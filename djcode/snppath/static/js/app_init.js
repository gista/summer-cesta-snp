// app_init.js
var map;
var geoExtMapPanel;
var overLayers = [];

// Stores
var activeUsersStore;
var inactiveUsersStore;
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
	var gmap = new OpenLayers.Layer.Google(gettext("Google Hybrid map"),{
		type: google.maps.MapTypeId.HYBRID, 
		numZoomLevels: 20,
		});

	var freemap_urls = ["http://t1.freemap.sk/T", "http://t2.freemap.sk/T",
	    "http://t3.freemap.sk/T", "http://t4.freemap.sk/T"]
	var fmap = new OpenLayers.Layer.TMS(gettext("Tourist map"), freemap_urls,{
		type: "jpeg",
		getURL: get_freemap_url,
		attribution: "<a href='http://www.freemap.sk' target='_blank'>Freemap Slovakia</a>, <a href='http://www.openstreetmap.org' target='_blan-->k'>OpenStreetMap</a>",
		});

	map.addLayers([fmap, gmap]);

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
		//var comboBox = Ext.getCmp('pointCats');
		//comboBox.store = jData.poi_types;
		
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

	configStore.load();
	});

function addMapControls(){

	map.addControls([
		new OpenLayers.Control.Permalink(),
		new OpenLayers.Control.ScaleLine(),
		new OpenLayers.Control.MousePosition(),
		]);

	// Toggle buttons for map functionality	

	var lengthMeasureToggleButton, areaMeasureToggleButton, clickToggleButton, navigationToggleButton;

	// Controller for navigation
	var navigationController = new OpenLayers.Control.Navigation();

	map.addControl(navigationController);

	navigationToggleButton = new OpenLayers.Control.Button({
		title: gettext('Navigation'),
		displayClass: 'olControlNavigation', 
		eventListeners: {
			'activate': function(){
				lengthMeasureToggleButton.deactivate();
				areaMeasureToggleButton.deactivate();
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
				areaMeasureToggleButton.deactivate();
				clickToggleButton.deactivate();

				lengthMeasureController.activate();
				},
			'deactivate': function(){
				lengthMeasureController.deactivate();
				}	
			},
		type: OpenLayers.Control.TYPE_TOGGLE
		});

	// Controller to measure the area size	

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
		title: gettext('Area measure'),
		displayClass: "olControlDrawFeaturePolygon", 
		eventListeners: {
			'activate': function(){
				navigationToggleButton.deactivate();
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
		title: gettext('Point info (coordinates & permalink)'),
		displayClass: "olControlDrawFeaturePoint", 
		eventListeners: {
			'activate': function(){
				navigationToggleButton.deactivate();
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
		[1, gettext('hut, shelter'), true, '/static/icons/shelter.svg', '/static/icons/shelter_b.svg'],
		[2, gettext('cottage'), true, '/static/icons/chalet.svg', '/static/icons/chalet_b.svg'],
		[3, gettext('water'), true, '/static/icons/water.svg', '/static/icons/water_b.svg'],
		[4, gettext('restaurant, pub'), true, '/static/icons/market.svg', '/static/icons/market_b.svg'],
		[5, gettext('grocery'), true, '/static/icons/food.svg', '/static/icons/food_b.svg'],
		[6, gettext('interesting place'), false, '/static/icons/poi.svg', '/static/icons/poi_b.svg'],
		[7, gettext('other'), false, '/static/icons/unknown.svg', '/static/icons/unknown_b.svg'],
		];

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

	strategyPhoto = new OpenLayers.Strategy.Filter({
		filter: filterPhoto
		});

	strategyArticle = new OpenLayers.Strategy.Filter({
		filter: filterHasArticle
		});

	var styleMap = [];
	for(var i=0;i<OVER_LAYERS.length;i++){
		var defaultStyle = new OpenLayers.Style({
			pointRadius: 10,
			externalGraphic: OVER_LAYERS[i][3],
			cursor: 'pointer'
			});
		var selectStyle = new OpenLayers.Style({
			pointRadius: 10,
			externalGraphic: OVER_LAYERS[i][4]
			});
		styleMap[i] = new OpenLayers.StyleMap({
			'default': defaultStyle,
			'select': selectStyle
			});
		}

	// append map over layers as specified
	
	for(var i=0;i<OVER_LAYERS.length;i++){
		var j = OVER_LAYERS.length-1-i;
		overLayers[i] = new OpenLayers.Layer.Vector(OVER_LAYERS[j][1], {
			visibility:OVER_LAYERS[j][2],
			styleMap: styleMap[j],
			strategies: [
				new OpenLayers.Strategy.Fixed(),
				strategyPhoto,
				strategyArticle
				],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois/?" + Ext.urlEncode({type:OVER_LAYERS[j][0]}),
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
				}
			});
		}
	}

function addSnpPathLayer(){

	var defaultStyle = new OpenLayers.Style({
			strokeColor: "red", 
			strokeWidth: 4,
			strokeOpacity: 0.5,
			cursor: "pointer"
			});

	// SNPpath layer with Fixed strategy
	var snpPathLayerFixed = new OpenLayers.Layer.Vector(gettext("SNP Path"), {
		visibility:true,
		styleMap: new OpenLayers.StyleMap({
			'default': defaultStyle,
			}),
		strategies: [new OpenLayers.Strategy.Fixed()],
		protocol: new OpenLayers.Protocol.HTTP({
			url: "mapdata/geojson/snppath/?" + Ext.urlEncode({simplify:25}),
			format: new OpenLayers.Format.GeoJSON({
				ignoreExtraDims: true,
				projection: new OpenLayers.Projection("EPSG:900913")
				})
			})
		});
	
	map.addLayer(snpPathLayerFixed);

	var snpPathLayerBBox;

	map.events.on({"zoomend": function(){
		var tree = Ext.getCmp('overLayerTree');
		if (map.numZoomLevels - map.getZoom() < 2){
			if (snpPathLayerFixed.getVisibility()){
				if (typeof(snpPathLayerBBox) == "undefined"){
					// SNPpath layer with BBox strategy add when we need it
					snpPathLayerBBox = new OpenLayers.Layer.Vector(gettext("SNP Path"),{
						visibility:false,
						styleMap: new OpenLayers.StyleMap({
							'default': defaultStyle,
							}),
						strategies: [new OpenLayers.Strategy.BBOX({})],
						protocol: new OpenLayers.Protocol.HTTP({
							url: "mapdata/geojson/snppath/",
							format: new OpenLayers.Format.GeoJSON({
								ignoreExtraDims: true,
								projection: new OpenLayers.Projection("EPSG:900913")
								})
							})
						});
	
					map.addLayer(snpPathLayerBBox);
					}
				
				Ext.getCmp('overLayerTree').getNodeById(gettext("SNP Path") + '_true').getUI().hide();
				Ext.getCmp('overLayerTree').getNodeById(gettext("SNP Path") + '_false').getUI().show();
				snpPathLayerFixed.setVisibility(false);
				snpPathLayerBBox.setVisibility(true);
				}			
			}	
		else if ((typeof(snpPathLayerBBox) != "undefined") && (snpPathLayerBBox.getVisibility()) ) {
			Ext.getCmp('overLayerTree').getNodeById(gettext("SNP Path") + '_true').getUI().show();
			Ext.getCmp('overLayerTree').getNodeById(gettext("SNP Path") + '_false').getUI().hide();
			snpPathLayerFixed.setVisibility(true);
			snpPathLayerBBox.setVisibility(false);		
			}
		}});
	}
