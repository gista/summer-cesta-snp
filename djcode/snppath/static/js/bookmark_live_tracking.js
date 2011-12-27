//// BOOKMARK LIVE tracking	

var liveTrackingDescription;
var markerLayer;

Ext.onReady(function() {

	// actual live trackin URL holder for refresh button
	var liveTrackingUrl;
	var liveTrackingActivePanel = Ext.getCmp('liveTrackingActive');
	var liveTrackingInactivePanel = Ext.getCmp('liveTrackingInactive');
	var liveTrackingRecordPanel = Ext.getCmp("liveTrackingRecords");

	userRecordsStore.on('load', function(store){
		// select the first record in grid panel
		var liveTrackingRecordPanel = Ext.getCmp("liveTrackingRecords");

		// after loading data show the Record grid panel
		liveTrackingRecordPanel.getSelectionModel().selectFirstRow();
		liveTrackingRecordPanel.show();	

		// set the correct height for the vertical scrollers in track messages
		liveTrackingRecordPanel.setHeight(250);
		liveTrackingRecordPanel.setHeight(Ext.getCmp('liveTrackingPanel').getHeight());	

		// fire rowclick event to setup correct map position
		liveTrackingRecordPanel.fireEvent("rowclick", liveTrackingRecordPanel, 0, null);
		}, this, true);

	liveTrackingActivePanel.on('rowclick', function(grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex).data;		
		// set username & description
		Ext.fly('liveTrackingUsername').update(record.username);
		if (record.description)
			liveTrackingRecordPanel.getColumnModel().setColumnHeader(0, '<strong>' + gettext("Description")+ ':</strong> <i>' + record.description + '</i>');
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
			liveTrackingRecordPanel.getColumnModel().setColumnHeader(0, '<strong>' + gettext("Description") + ':</strong> <i>' + record.description + '</i>');
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

		// hide grid with active & inactive users
		liveTrackingActivePanel.hide();
		liveTrackingInactivePanel.hide();
		});

	liveTrackingRecordPanel.on('rowclick', function(grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex).data;

		if (record.lon != 0 && record.lat != 0) {
			var point = new OpenLayers.LonLat(record.lon, record.lat).transform(map.displayProjection, map.projection); 
			map.panTo(point);

			if (typeof(markerLayer)=="undefined"){
				// if we want to see first time marker layer(first time we clicked into LIVE user messages)
				markerLayer = new OpenLayers.Layer.Markers(gettext("Live messages"));
				map.addLayer(markerLayer);
				markerLayer.setZIndex(map.Z_INDEX_BASE['Popup'] - 5);
				}
			else {
				// we remove 1st records, there is just 1 (destroy marker instances & remove marker from layer)
				//console.log(markerLayer.markers);
				markerLayer.markers[0].destroy();
				markerLayer.removeMarker(markerLayer.markers[0]);
				markerLayer.setVisibility(true);
				}

			var size = new OpenLayers.Size(32,37);
			var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
			var icon = new OpenLayers.Icon('/static/icons/LIVE_z.png', size, offset);
			markerLayer.addMarker(new OpenLayers.Marker(point, icon));
			}
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
			if (typeof(markerLayer)!="undefined")
				markerLayer.setVisibility(false);

			liveTrackingRecordPanel.hide();
			liveTrackingActivePanel.show();
			liveTrackingInactivePanel.show();
			});		
		});

	Ext.getCmp("appTabs").on('tabchange', function(parent, actual){
		if (actual.id!="liveTrackingBar")
			if (typeof(markerLayer)!="undefined")
				markerLayer.setVisibility(false);
		});

	});

function customRenderer(v, p, r){
	var ret = null;
	if (r.hasOwnProperty("data") && r.data.hasOwnProperty("lon") && r.data.hasOwnProperty("lat") && r.data.hasOwnProperty("time")){
		var cursorClass = (r.data.lon != 0 && r.data.lat != 0) ? "x-grid3-coordinates" : "x-grid3-no-coordinates";
		var ret = "<span class='"+ cursorClass +"'><h3>"+ r.data.time.format('d.m.Y H:i:s')+"</h3><br/>" + v + "</span>";
		}
	return ret;
	}
