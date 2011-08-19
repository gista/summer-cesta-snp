//// BOOKMARK LIVE tracking	

var liveTrackingDescription;
var markerLayer;

Ext.onReady(function() {

	userRecordsStore.on('load', function(store){
		// after loading data set current center into the first user record
		var record = store.getAt(0).data;
		var point = new OpenLayers.LonLat(record.lon, record.lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()); 
		map.setCenter(point,10);

		// add markers
		if (typeof(markerLayer)=="undefined"){
			markerLayer = new OpenLayers.Layer.Markers(gettext("Live messages"));
			}
		else {
			markerLayer.destroy();	
			markerLayer = new OpenLayers.Layer.Markers(gettext("Live messages"));
			}
		map.addLayer(markerLayer);
		
		var size = new OpenLayers.Size(21,25);
		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size,offset);
		markerLayer.addMarker(new OpenLayers.Marker(point, icon));           	
		for(var i=1;i<store.totalLength;i++){
			record = store.getAt(i).data;
			point = new OpenLayers.LonLat(record.lon, record.lat);
			point = point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()); 
			markerLayer.addMarker(new OpenLayers.Marker(point, icon.clone()));
			}
		
		// select the first record in grid panel
		var liveTrackingRecordPanel = Ext.getCmp("liveTrackingRecords");

		// after loading data show the Record grid panel
		liveTrackingRecordPanel.getSelectionModel().selectFirstRow();
		liveTrackingRecordPanel.show();	
		
		// set the correct height for the vertical scrollers in track messages
		liveTrackingRecordPanel.setHeight(Ext.getCmp('liveTrackingPanel').getHeight());	
		});

	// actual live trackin URL holder for refresh button
	var liveTrackingUrl;

	var liveTrackingActivePanel = Ext.getCmp('liveTrackingActive');
	var liveTrackingInactivePanel = Ext.getCmp('liveTrackingInactive');
	var liveTrackingRecordPanel = Ext.getCmp("liveTrackingRecords");

	liveTrackingActivePanel.on('rowclick', function(grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex).data;		
		// set username & description
		Ext.fly('liveTrackingUsername').update(record.username);
		if (record.description)
			liveTrackingRecordPanel.getColumnModel().setColumnHeader(0, '<b>' + gettext("Description")+ ':</b> ' + record.description);
		else 
			liveTrackingRecordPanel.getColumnModel().setColumnHeader(0, '');
		// set correct title for Record Grid panel
		liveTrackingRecordPanel.setTitle(gettext("Actual on terrain"));

		// set user click (specified parameters) & load the data into Record Grid panel
		liveTrackingUrl = userRecordsStore.url + Ext.urlEncode({track_id:record.track_id}); 
		userRecordsStore.proxy.conn.url = liveTrackingUrl;
		userRecordsStore.load();	

		// hide grid with active & inactive users
		liveTrackingActivePanel.hide();
		liveTrackingInactivePanel.hide();
  		});	

	liveTrackingInactivePanel.on('rowclick', function(grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex).data;
		// set username & description
		Ext.fly('liveTrackingUsername').update(record.username);
		if (record.description)
			liveTrackingRecordPanel.getColumnModel().setColumnHeader(0, '<b>' + gettext("Description") + ':</b>' + record.description);
		else 
			liveTrackingRecordPanel.getColumnModel().setColumnHeader(0, '');

		// set correct title for Record Grid panel
		liveTrackingRecordPanel.setTitle(gettext("Path ended"));

		// set user click (specified parameters) & load the data into Record Grid panel
		liveTrackingUrl = userRecordsStore.url + Ext.urlEncode({track_id:record.track_id}); 
		userRecordsStore.proxy.conn.url = liveTrackingUrl;
		userRecordsStore.load();

		// set username & description
		Ext.fly('liveTrackingUsername').update(record.username);
		//Ext.fly('liveTrackingDescription').update('Popis: ' + record.description);
		console.log(record.username);
		console.log(record.description);


		// hide grid with active & inactive users
		liveTrackingActivePanel.hide();
		liveTrackingInactivePanel.hide();
		});

	liveTrackingRecordPanel.on('rowclick', function(grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex).data;
		var point = new OpenLayers.LonLat(record.lon, record.lat); 
		map.panTo(point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()));
		});

	// some grid components need after render method for correct working
	liveTrackingRecordPanel.on('viewready', function(grid){
		// refresh button for records
		Ext.getCmp('refreshButton').on('click', function(){
			userRecordsStore.proxy.conn.url = liveTrackingUrl;
			userRecordsStore.load();		
			});

		// event on click for back button returns to lists of active & inactive users 
		Ext.getCmp('backButton').on('click', function(){
			liveTrackingRecordPanel.hide();
			liveTrackingActivePanel.show();
			liveTrackingInactivePanel.show();
			});		
		});


  	});
