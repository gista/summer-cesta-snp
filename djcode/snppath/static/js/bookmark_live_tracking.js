//// BOOKMARK LIVE tracking	

var liveTrackingDescription;

Ext.onReady(function() {
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
			liveTrackingRecordPanel.getColumnModel().setColumnHeader(0, '<b>Popis:</b> '+ record.description);
		else 
			liveTrackingRecordPanel.getColumnModel().setColumnHeader(0, '');
		// set correct title for Record Grid panel
		liveTrackingRecordPanel.setTitle("Aktuálne v teréne");

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
			liveTrackingRecordPanel.getColumnModel().setColumnHeader(0, '<b>Popis:</b> '+ record.description);
		else 
			liveTrackingRecordPanel.getColumnModel().setColumnHeader(0, '');

		// set correct title for Record Grid panel
		liveTrackingRecordPanel.setTitle("Cestu ukončili");

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
