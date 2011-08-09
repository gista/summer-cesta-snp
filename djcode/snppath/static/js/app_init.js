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
	map.addLayers([gmap, osm]);

	// call add overlayers function
	addOverLayers();

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
	activeUsersStore.on('load', function(store){
		var jData = store.reader.jsonData
		
		// set map default config
		var record = jData.location;
		var point = new OpenLayers.LonLat(record.lon, record.lat); 
		map.setCenter(point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),record.zoomlevel);


		//var point = new OpenLayers.LonLat(jData.location.lon, jData.location.lat); 
		//console.log(point);
		//map.setCenter(point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),jData.location.zoomlevel);

		// after setup the center & zoomlevel we add SnpPathLayer
		addSnpPathLayer();

		/* fill the poi types combobox with data read from JsonDATA 
		[not properly working as in API - http://dev.sencha.com/deploy/ext-3.4.0/docs/source/Combo.html#cfg-Ext.form.ComboBox-store]
		var comboBox = Ext.getCmp('pointCats');
		comboBox.store = jData.poi_types;
		comboBox.update();
		*/

		// fill the data with JsonData read from UserStore
		inactiveUsersStore.loadData(jData);

		// filter just active users in store
		store.filter('is_active', true);
		});

	inactiveUsersStore.on('load', function(store){
		// filter just active users in store
		store.filter('is_active', false);		
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
		});

	activeUsersStore.load();
	});

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

	// append map over layers as specified
	var overLayers = [ 
		new OpenLayers.Layer.Vector(OVER_LAYERS[6][1], {
			visibility:OVER_LAYERS[6][2],
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois?type="+ OVER_LAYERS[6][0],
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[5][1], {
			visibility:OVER_LAYERS[5][2],
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois?type="+ OVER_LAYERS[5][0],
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[4][1], {
			visibility:OVER_LAYERS[4][2],
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois?type="+ OVER_LAYERS[4][0],
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[3][1], {
			visibility:OVER_LAYERS[3][2],
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois?type="+ OVER_LAYERS[3][0],
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[2][1], {
			visibility:OVER_LAYERS[2][2],
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois?type="+ OVER_LAYERS[2][0],
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[1][1], {
			visibility:OVER_LAYERS[1][2],
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois?type="+ OVER_LAYERS[1][0],
				format: new OpenLayers.Format.GeoJSON({
					ignoreExtraDims: true,
					projection: new OpenLayers.Projection("EPSG:900913")
					})
				})
			}),
		new OpenLayers.Layer.Vector(OVER_LAYERS[0][1], {
			visibility:OVER_LAYERS[0][2],
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol: new OpenLayers.Protocol.HTTP({
				url: "/mapdata/geojson/pois?type="+ OVER_LAYERS[0][0],
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
				console.log(e.feature.data.id);
        	        	},
       			"featureunselected": function(e) {
              			//alert("unselected");
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
			url: "/mapdata/geojson/snppath?geom_simplify=25&bbox="+ mapBounds.toBBOX(),
			format: new OpenLayers.Format.GeoJSON({
				ignoreExtraDims: true,
				projection: new OpenLayers.Projection("EPSG:900913")
				})
			})
		});
	
	map.addLayer(snpPathLayer);
	}
