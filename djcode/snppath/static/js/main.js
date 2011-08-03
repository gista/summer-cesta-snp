/*
Click controler to handle users clicks on map
*/

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control,{                
	defaultHandlerOptions: {
		'single': true,
		'double': false,
		'pixelTolerance': 0,
		'stopSingle': true,
		'stopDouble': false
		},
	initialize: function(options) {
 		this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
		OpenLayers.Control.prototype.initialize.apply(this, arguments);
 
   	this.handler = new OpenLayers.Handler.Click(this, {
			'click': this.trigger
			}, this.handlerOptions);
  			}, 
		});

/*
Function to check if URL has map center parameters
*/

function hasParams(){
	var link = document.location.href;
	if ((link.indexOf("zoom") > -1) && (link.indexOf("lon") > -1) && (link.indexOf("lat") > -1)) return true;
	return false;
	}

var map;

/*
Set map center with correct projection
*/

function setMapCenter(){
	var url = document.location.hash;
	url = url.replace("#","?");
	var l = new OpenLayers.Util.getParameters(url);
	var proj = new OpenLayers.Projection("EPSG:4326");
	var point = new OpenLayers.LonLat(parseFloat(l.lon),parseFloat(l.lat));
	var href = OpenLayers.Util.getElement("permalink").href;
	OpenLayers.Util.getElement("permalink").href = href.replace("?","#");
	map.setCenter(point.transform(proj, map.getProjectionObject()),parseInt(l.zoom));
	}

/*
Function to handle the changes of document.location.hash 
*/

if ("onhashchange" in window) {
	window.onhashchange = function () {
		if (hasParams()){
			setMapCenter(document.location.hash);
			}
		}
	}
else {
	var storedHash = window.location.hash;
 	window.setInterval(function () {
 		if (window.location.hash != storedHash) {
			if (hasParams()){
				setMapCenter(document.location.hash);
				}
    			}
  		}, 100);
	}

/*
Function to handle measures of length and area 
*/

function handleMeasurements(event) {
	var geometry = event.geometry;
	var units = event.units;
	var order = event.order;
	var measure = event.measure;
	var element = document.getElementById('measures');
	var out = "";
	if(order == 1){
		out += "Nameraná dĺžka: " + measure.toFixed(2) + " " + units;
		length_measure_controller.deactivate();
		}
	else {
		out += "Nameraná plocha: " + measure.toFixed(2) + " " + units + "<sup>2</sup>";
		area_measure_controller.deactivate();
		}
	element.innerHTML = out;
  	}



/*
Function to show popup with coords & permalink  
*/

var popup_point;

function showPopup(loc){
	if (!popup_point){
		popup_point = new GeoExt.Popup({
   			title: "Bod na mape",
     			autoWidth: true,
			unpinnable: false,
       			map: map,
       			listeners: {
        			close: function() {
        	  			popup = null;
        	  			}
        	 		}
   			});
		} 
	else {
		popup_point.removeAll();			
		}
	
	var permalink = document.location.href + 
			"?zoom=" + map.zoom + 
			"&lat=" + loc.lat.toFixed(5) + 
			"&lon=" + loc.lon.toFixed(5);

	popup_point.add({
		xtype: "box",
		style:{
			"font-size":"13px",		
			},
		autoEl: {
    			html: "<b>Súradnice:</b> [" + loc.lon.toFixed(5) + 
					 "," + loc.lat.toFixed(5) + "]",
        		},
		},{
		xtype: "box",
		style:{	
			"font-size":"13px",		
			},
		autoEl: {
    			html: "<b>Permalink:</b> " + permalink,
        		},
    		});

	popup_point.location = map.getCenter();
 	popup_point.doLayout();
	popup_point.show();
	}

Ext.onReady(function(){
	Ext.QuickTips.init();

	var location; // Variable used as config location for map

	/*
	App init from url '/config' reading the JSON structure to JsonStore	
	*/
	live_users_store = new Ext.data.JsonStore({	
		// reader configs
		root:'live_users',
		fields:[
			{name:'id', mapping:'id', type: 'number'},
			{name:'user', mapping:'username', type: 'string'},
			{name:'track', mapping:'track_name', type: 'string'},	
			{name:'name', mapping:'first_name', type: 'string'},
			{name:'surname', mapping:'last_name',  type: 'string'},	
			{name:'email', mapping:'email', type: 'string'},
			{name:'phone', mapping:'phone',  type: 'string'},	
			{name:'last_time', mapping:'last_location_time', type: 'date', dateFormat: 'Y-m-d h:i:s'},
			{name:'is_active', mapping:'is_active', type: 'boolean'},	
			{name:'description', mapping:'description',  type: 'string'},			
			],	
		// store configs
		url: '/config',
		autoLoad: true,
  		});
	/*
	App combobox init	
	*/
	var poi_types_store = new Ext.data.JsonStore({
		root: 'poi_types',
		fields:['name'],
		})

	/*
	Users Store load function to handle other config params	
	*/
	live_users_store.on('load', function(store){
		var data = store.reader.jsonData;
		poi_types_store.loadData(data);
		location = data.location; 
		});

	/*
	LIVE tracking store to hold the data of selected user
	*/	
	var live_records_store =  new Ext.data.JsonStore({
		fields:[
			{name: 'lon', mapping: 'lon'},
			{name: 'lat', mapping: 'lat'},
			{name: 'message', mapping: 'message'},
			{name: 'time', mapping: 'time', type: 'date', dateFormat: 'Y-m-d h:i:s'},
			],
		url: '/live_tracking/user',
  		});
	/*
	Records store load function to show the grid panel with messages 	
	*/
	live_records_store.on('load', function(store){
		Ext.getCmp("tracking_record").show();
		});

	var HEADER_HEIGHT = 100;

	// Advertisement side settings constance
	var ADVERTISEMENT_SIDE_PANEL_HEIGHT = 100

	var ADVERTISEMENT_SIDE_IMAGE_LEFT_WIDTH = 100
	var ADVERTISEMENT_SIDE_IMAGE_LEFT_HEIGHT = 80
	var ADVERTISEMENT_SIDE_IMAGE_LEFT = 'http://www.jmorganmarketing.com/wp-content/uploads/2010/11/image4.jpg'

	var ADVERTISEMENT_SIDE_IMAGE_RIGHT_WIDTH = 100;
	var ADVERTISEMENT_SIDE_IMAGE_RIGHT_HEIGHT = 80;
	var ADVERTISEMENT_SIDE_IMAGE_RIGHT = 'http://www.jmorganmarketing.com/wp-content/uploads/2010/11/image4.jpg'

	var data_layers = 
		[
			[1, 'útulne, prístrešky', true],
			[2, 'chaty', true],
			[3, 'voda', true],
			[4, 'stravovanie, krčmy', true],	
			[5, 'potraviny', true],	
			[6, 'zaujímavé miesta', false],	
			[7, 'nezaradené', false],
		];

	var data_moutains = 
		[
			[1, 'Dukla, Čergov a Šarišská vrchovina'],
			[2, 'Čierna hora, Volovské vrchy'],
			[3, 'Nízke Tatry'],
			[4, 'Veľká Fatra'],	
			[5, 'Strážovské vrchy a Biele Karpaty'],	
			[6, 'Malé Karpaty'],	
		];

	map = new OpenLayers.Map({
		maxResolution: 156543.0339,
        	maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34),
		displayProjection: new OpenLayers.Projection("EPSG:4326"), // WGS-84		
		});

	var gmap = new OpenLayers.Layer.Google("Turistická mapa",{
		type: google.maps.MapTypeId.HYBRID, 
		numZoomLevels: 20,
		});

	var osm = new OpenLayers.Layer.OSM("Satelitná mapa");
	
	map.addLayers([gmap, osm]);

	vectors = [ 
		new OpenLayers.Layer.Vector(data_layers[6][1], {visibility:data_layers[6][2]}),
		new OpenLayers.Layer.Vector(data_layers[5][1], {visibility:data_layers[5][2]}),	
		new OpenLayers.Layer.Vector(data_layers[4][1], {visibility:data_layers[4][2]}),	
		new OpenLayers.Layer.Vector(data_layers[3][1], {visibility:data_layers[3][2]}),	
		new OpenLayers.Layer.Vector(data_layers[2][1], {visibility:data_layers[2][2]}),		
		new OpenLayers.Layer.Vector(data_layers[1][1], {visibility:data_layers[1][2]}),			
		new OpenLayers.Layer.Vector(data_layers[0][1], {visibility:data_layers[0][2]}),	
		];
	
	map.addLayers(vectors);

	/*
	Toggle buttons for map functionality	
	*/
	var length_measure_toggle_button, area_measure_toggle_button, click_toggle_button;

	/*
	Controller to measure the length of points
	*/

	var length_measure_controller = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
		persist: true,
		immediate: true,
		geodesic: true,
    		eventListeners: {
  			"measure": handleMeasurements,
    			"measurepartial": handleMeasurements	
    			}
		});

	map.addControl(length_measure_controller);

	length_measure_toggle_button = new OpenLayers.Control.Button({
		title: 'Meranie vzdialenosti',
		displayClass: "olControlLengthButton", 
		eventListeners: {
			'activate': function(){
				area_measure_toggle_button.deactivate();
				click_toggle_button.deactivate();

				length_measure_controller.activate();
				},
			'deactivate': function(){
				length_measure_controller.deactivate();
				}	
			},
		type: OpenLayers.Control.TYPE_TOGGLE
		});

	/*
	Controller to measure the area size	
	*/

	var area_measure_controller = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
		persist: true,
		immediate: true,
		geodesic: true,
    		eventListeners: {
			"measure": handleMeasurements,
 			"measurepartial": handleMeasurements
    			}
		});

	map.addControl(area_measure_controller);
	
	/*
	Toggle button to activate/deactivate the area measure controller	
	*/

	area_measure_toggle_button = new OpenLayers.Control.Button({
		title: 'Meranie plochy',
		displayClass: "olControlAreaMeasureButton", 
		eventListeners: {
			'activate': function(){
				length_measure_toggle_button.deactivate();
				click_toggle_button.deactivate();

				area_measure_controller.activate();
				},
			'deactivate': function(){
				area_measure_controller.deactivate();
				}	
			},
		type: OpenLayers.Control.TYPE_TOGGLE
		});

	/*
	Click controller to show the point info	
	*/

	var click_controller = new OpenLayers.Control.Click({
		trigger: function(e) {
			var lonlat = map.getLonLatFromViewPortPx(e.xy); 
			map.setCenter(lonlat);
			lonlat = lonlat.transform(
				new OpenLayers.Projection("EPSG:900913"),
    				new OpenLayers.Projection("EPSG:4326") 
				);
      			showPopup(lonlat);
			},
		});

	map.addControl(click_controller);

	/*
	Toggle button to activate/deactivate the click controller	
	*/

	click_toggle_button = new OpenLayers.Control.Button({
		title: 'Zobrazenie info o bode (súradnice + permalink)',
		displayClass: "olControlClickButton", 
		eventListeners: {
			'activate': function(){
				length_measure_toggle_button.deactivate();
				area_measure_toggle_button.deactivate();

				click_controller.activate();
				},
			'deactivate': function(){
				click_controller.deactivate();
				}	
			},
		type: OpenLayers.Control.TYPE_TOGGLE
		});

	/*
	Controller button to export POI into GPX	
	*/

	var gpx_button = new OpenLayers.Control.Button({
		title: 'Exportovanie všetkých dát do .gpx',
    		displayClass: "olControlGPXButton", 
		trigger: function(){
			alert("Export GPX");	
			} 
		});	

	/*
	Help window 	
	*/

	var help_window = new Ext.Window({
		width: 400,
		height:300,
		title: 'Help',
		closeAction: 'hide', 
		autoLoad:{
			url: '/help',			
			},					
		});
	
	/*
	Controller button to show the help window	
	*/

	var help_button = new OpenLayers.Control.Button({
		title: 'Zobrazenie pomocníka',
    		displayClass: "olControlHelpButton", 
		trigger: function(){
			help_window.show();	
			} 
		});	

	var mouse_controller = new OpenLayers.Control.Navigation({
		title:'Navigácia'
		}); 

	/*
	Control panel which holds the controller buttons
	*/

	var control_panel = new OpenLayers.Control.Panel({
		displayClass: 'olControlRightToolbar',
		defaultControl: mouse_controller		
		});

	control_panel.addControls([
		mouse_controller,
		length_measure_toggle_button,
		area_measure_toggle_button,
		click_toggle_button,
		gpx_button,
		help_button,
		]);

	map.addControl(control_panel);

	/*		
	Vector select controller	
	*/

	var select_controller = new OpenLayers.Control.SelectFeature(vectors,{
     		clickout: true, toggle: false,
       		multiple: false, hover: false,
     	 	toggleKey: "ctrlKey",
     		multipleKey: "shiftKey"
               		}
            	);

	map.addControl(select_controller);
	select_controller.activate();

	for(var i=0;i<7;i++){
		vectors[i].events.on({
	     		"featureselected": function(e) {			
				create_point_info(e.feature);
				
        	        	},
                	"featureunselected": function(e) {
              			popup.hide();
        	        	}
        	    	});
		}

	// Layers layout

	var panel_layers_filter = new Ext.Panel({
		id:'map_filter',
		title: 'Filter:',
		frame: true,
		bodyStyle : 'padding: 10px',
		items:[{
			xtype: 'checkbox',
			fieldLabel: "",
			boxLabel: 'k bodu je fotografia',
			id:'has_article',
			},{
			xtype: 'checkbox',
			fieldLabel: "",
			boxLabel: 'k bodu je článok',
			id:'has_photo',
			}]
		});

	var panel_layers_main = new Ext.Panel({
		region:'center',
		bodyStyle : 'padding: 10px',
		border : false,
		items:[{
			xtype: 'panel',
			frame: true,
			html: '<div id="map_layers"></div>',			
			},{
			xtype: 'panel',
			frame: true,
			html: '<div id="map_vectors"></div>',		
			},
			panel_layers_filter]
		});

	panel_advertisement = new Ext.Panel({
		region: 'south',
		border: false,
		height: ADVERTISEMENT_SIDE_PANEL_HEIGHT,
		bodyStyle: 'padding: 10px',
		items:[{
			xtype: 'box',
			autoEl: {
				tag: 'img',
				src: ADVERTISEMENT_SIDE_IMAGE_LEFT,
				align:'left',
				},
			width: ADVERTISEMENT_SIDE_IMAGE_LEFT_WIDTH,
			height: ADVERTISEMENT_SIDE_IMAGE_LEFT_HEIGHT,
			},{
			xtype: 'box',
			autoEl: {
				tag: 'img',
				src: ADVERTISEMENT_SIDE_IMAGE_RIGHT,
				align:'right',
				},
			width: ADVERTISEMENT_SIDE_IMAGE_RIGHT_WIDTH,
			height: ADVERTISEMENT_SIDE_IMAGE_RIGHT_HEIGHT,
			}]	
		});

	var panel_layers = new Ext.Panel({
		title: '<div class="x-tab-strip-text-down">Vrstvy<br/>&nbsp;</div>',
		layout:'border',
		
		items:[
			panel_layers_main,
		 	panel_advertisement.cloneConfig(),
			]
		});

	// LIVE TRACKING layout

	panel_live_actual = new Ext.grid.GridPanel({
		title: 'Aktuálne v teréne',
		flex: 2,
        	//margins: '0 0 2 0',
		id:'tracking_live',
		store: live_users_store,
		listeners: {
	  		render: function(grid) {
	  			grid.getView().el.select('.x-grid3-header').setStyle('display', 'none');
				
	    			},
			},
		colModel:new Ext.grid.ColumnModel({
	 		defaults: {
	      			sortable: false,
				fixed: true,
				resizable: false,
	      			},
	   		columns: [
				{dataIndex: 'user', width: 150,id:'user'},
				{dataIndex: 'last_time', renderer: Ext.util.Format.dateRenderer('d.m.Y - h:m'), }
				]		
	    		}),
		frame:true,
		});


	var panel_live_end =  new Ext.grid.GridPanel({
		title: 'Cestu ukončili',
		flex: 2,
		id:'tracking_end',
		store: live_users_store,
		listeners: {
	   		render: function(grid) {
	    			grid.getView().el.select('.x-grid3-header').setStyle('display', 'none');
	    			},
			},
		colModel:new Ext.grid.ColumnModel({
	  		defaults: {
	     			sortable: false,
				fixed: true,
				resizable: false,
	     			},
	 		columns: [
				{dataIndex: 'user', width: 150,id:'user'},
				{dataIndex: 'last_time', renderer: Ext.util.Format.dateRenderer('d.m.Y - h:m'), }
				]	
	    		}),
		frame:true,		
		});

	function renderStatus(value, p, record){
		console.log(record);
		return '<b>' + record.data.time.format("d.m.Y - h:m") + '</b><br/><br/>'+ value;				
		}

	var panel_live_record = new Ext.Panel({
		id:'tracking_record',
		autoHeight: true,
		frame: true,
		flex: 1,
		hidden: true,
		title: 'X',
		autoScroll:true,
		tbar:[{
			text: 'Refresh',
			listeners:{
				click: function(){
					// HERE goes datastore.load() function 
					alert("Refresh " + Ext.getCmp("tracking_record").items.item(0).value);				
					}
				}
			},'->',{
			text: 'Back to menu',		
			listeners:{
				click: function(){
					Ext.getCmp("tracking_record").hide();
					Ext.getCmp("tracking_live").show();
					Ext.getCmp("tracking_end").show();		
					}
				}
			}],
						
		items:[{
			xtype: 'hidden',				
			},{
			xtype: 'grid',
			frame: true,
			height: 500,
			store: live_records_store,
			colModel:new Ext.grid.ColumnModel({
	 			columns: [{
					header:'<div id="live_tracking_record_header">Janka</div><br/>Description: <div id="live_tracking_record_desc"></div>',
					dataIndex: 'message', 
					width: 220,
					minHeight: 75,
					resizable: false,
					sortable: false,
					menuDisabled: true,
					renderer:renderStatus, 
					}]	
	    			}),
			}],		
		});

	var panel_live = new Ext.Panel({
		title: '<center>LIVE<br/>Sledovanie</center>',
		layout:'border',
		defaults: {
			split: true,
			border : false,
			},
		items: [{
			xtype: 'panel',
			region: 'center',
			layout: {
        			type: 'vbox',
        			align: 'stretch',
    				},
			items: [
				panel_live_actual,
				panel_live_end,	
				panel_live_record,			
				],
			},
			panel_advertisement.cloneConfig(),
			]
		});

	// POI database part

	var panel_poi_db_side =  new Ext.form.FormPanel({
		region: 'center',
		buttonAlign: 'right',
		width: 250,
		labelAlign: 'top',
		labelWidth: 0,			
		frame:true,
		defaults: {
			xtype:'textfield',
      			},
		items: [{
			fieldLabel: 'Názov bodu: *',
			name: 'point_name',
			allowBlank:false,
			width: 220,
			},{
			fieldLabel: 'Kategória: *',
			xtype: 'combo',
			name: 'cathegory',
			allowBlank:false,
			store: poi_types_store,
			id: 'cathegory',
			valueField:'id',
    			displayField:'name',
			mode:'local',
			triggerAction:'all',
			width: 220,
			},{
			xtype:'label',
			html: '<hr/>',
			fieldLabel: 'Súradnice',
			labelStyle:'font-size:17px;',
			},{
			fieldLabel: 'Zemepisná šírka: * (napr. 48.45789)',
			name: 'coords_n',
			width: 220,
			allowBlank:false,
			},{
			fieldLabel: 'Zemepisná dĺžka: * (napr. 19.45732)',
			name: 'coords_e',
			width: 220,
			allowBlank:false,
			},{
			fieldLabel: 'Fotografia',
			id:'photo-upload',
			name: 'photo',
			width: 100,
			},{
			xtype: 'button',
			text: 'Search',
			width: 50,
			},{
			fieldLabel: 'Poznámka',
			xtype: 'textarea',
			name: 'notes',
			height: 50,	
			width: 220,			
			}],
		buttons:[{
			text:'Pridaj<br/>',
			handler: function(){
				alert("Add!");				
				}
			}]
		});



	var panel_poi_db =  new Ext.Panel({
		title: '<div class="x-tab-strip-text-down">Pridaj bod<br/>&nbsp;</div>',
		layout:'border',
		items:[
			panel_poi_db_side,
			panel_advertisement.cloneConfig(),		
			]				
		});

	var viewport = new Ext.Viewport({
		layout: 'border',
		monitorResize: true,
		defaults: {
			collapsible: false,
			split: true,
			},
		items: [{
        		id: 'footerPanel',
			region: 'south',
			height: 50,
			minSize: 50,
			maxSize: 50,
			items:[{
				layout: 'column',
				items:[{
					border: false,
					width: 248,
					height: 47,
					style: {
						"text-align":"center",						
						},
					html:'Link to main page of CestaSNP.sk'
					},{
					columnWidth: 1,
					height: 50,
					border: false,				
					style: {
						"text-align":"center",						
						},
					html:'Licence of GISTA & FREEMAP',					
					}]
				}]				
			},{	
			id: 'tabPanel',
			region:'west',
			collapsible: true,
			border: false,
			margins: '0 0 0 0',
			cmargins: '0 0 0 0',
			width: 266,
			maxWidth: 266,
			minWidth: 266,
			xtype: 'tabpanel',
			activeTab: 0,
			items: [
				panel_layers,
				panel_live,
				panel_poi_db,
				]
			},{
			id: 'mapPanel',
			collapsible: false,
			region:'center',
			xtype: 'gx_mappanel',
			padding: '0 0 0 0',
			map: map,
			center: [2351125, 6264883],
			zoom: 11,
			tbar: new Ext.Toolbar({	
				id:'map_tlbar',
				layout: 'column',
				height: HEADER_HEIGHT,
				items: [
					/*

					Header Main Advertisement

					*/
					{
					xtype: 'container',
					layout : {
						type : 'hbox',
						pack : 'center'
					},
					columnWidth: .7,
					frame: true,
					items:[{
						xtype: 'box',
						autoEl: {
							tag: 'img', 
							src: 'http://www.fws.gov/humancapital/images/MountainHeader800.jpg',
							},
						height: 95,
						width: 280,
						listeners: {
    							render: function(c) {
      								c.getEl().on('click', function(e) {
									alert("Redirect na stránku");
									}, c);
    								}
  							}
						},{
						xtype: 'box',
						autoEl: {
							tag: 'img', 
							src: 'http://www.fws.gov/humancapital/images/MountainHeader800.jpg',
							},
						height: 95,
						width: 280,
						listeners: {
    							render: function(c) {
      								c.getEl().on('click', function(e) {
									alert("Redirect na stránku");
									}, c);
    								}
  							}
						}]
					
					},{
					xtype: 'container',
					layout : {
						type : 'hbox',
						pack : 'center'
					},
					/*

					Header Right Advertisement

					*/
					columnWidth: .3,
					frame: true,
					items:[{
						xtype: 'box',
						autoEl: {
							tag: 'img', 
							src: 'http://cestasnp.sk/templates/greenlife/images/logo.png',
							},
						listeners: {
    							render: function(c) {
      								c.getEl().on('click', function(e) {
									document.location.href = "http://cestasnp.sk/";
									}, c);
    								}
  							}			
						}]
					}]
				})
			
			}],
		
		renderTo:document.body,
		});

	/*
	
	BaseLayers map holder

	*/

	var map_tree = new Ext.tree.TreePanel({
		autoHeight: true,
		padding: 10,
		renderTo: "map_layers",
		root: new GeoExt.tree.BaseLayerContainer({
			layerStore: document.getElementById('mapPanel.layers'),
			expanded: true,
			cls: 'x-tree-title-invisible',
 			})
		});
	/*
	
	Set the map default layer visibility

	*/

	osm.setVisibility(true);


	/*
	
	OverLayers map holder

	*/

	var layers_tree = new Ext.tree.TreePanel({
		width: 248,
		autoHeight: true,
		padding: 10,
		renderTo: "map_vectors",
		root: new GeoExt.tree.OverlayLayerContainer({
			layerStore: document.getElementById('mapPanel.layers'),
			expanded: true,
			cls: 'x-tree-title-invisible',
			})
		});

	/*

	Map Controllers used in map as basic functionality	
	
	*/

	map.addControls([
		new OpenLayers.Control.Permalink(),
		new OpenLayers.Control.ScaleLine(),
		new OpenLayers.Control.MousePosition(),
		]);

	// LIVE tracking functionality

	Ext.getCmp("tracking_live").on('rowclick', function(grid, rowIndex, e) {
		// Hide the panels with lists of users
		Ext.getCmp("tracking_live").hide();
		Ext.getCmp("tracking_end").hide();

		// Change the panel title, record header and description depends on user click
		var pnl = Ext.getCmp("tracking_record");
		pnl.setTitle("Aktuálne v teréne");

		var rec = grid.getStore().getAt(rowIndex);
		Ext.fly('live_tracking_record_header').update(rec.get('user'));
		Ext.fly('live_tracking_record_desc').update(rec.get('description'));

		var url = "live_tracking/user?id=" + rec.get('id') + "&track_name=" + rec.get('track');
		console.log(url);
		live_records_store.proxy.conn.url = url;
		live_records_store.load();
  		});

	Ext.getCmp("tracking_end").on('rowclick', function(grid, rowIndex, e) {
		// Hide the panels with lists of users
		Ext.getCmp("tracking_live").hide();
		Ext.getCmp("tracking_end").hide();

		// Change the panel title, record header and description depends on user click
		var pnl = Ext.getCmp("tracking_record");
		pnl.setTitle("Cestu ukončili")

		var rec = grid.getStore().getAt(rowIndex);
		var url = "live_tracking/user?id=" + rec.get('id') + "&track_name=" + rec.get('track');
		console.log(url);
		live_records_store.proxy.conn.url = url;
		live_records_store.load();

		pnl.show();

		//alert(rec.get('user') + rec.get('description'));

		Ext.fly('live_tracking_record_header').update(rec.get('user'));
		Ext.fly('live_tracking_record_desc').update(rec.get('description'));

  		});
	
	// simple feature point functionality
	var lonLat = new OpenLayers.LonLat(21.12,49);

	lonLat = lonLat.transform(
		new OpenLayers.Projection("EPSG:4326"), 
		map.getProjectionObject() 
		);
	point = new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat);
	map.layers[5].addFeatures([new OpenLayers.Feature.Vector(point)]);

	if (!map.getCenter()) if (hasParams()) setMapCenter();

	map.addControl(new OpenLayers.Control.MousePosition());
	
	var point_data_store = new Ext.data.Store({
    		proxy: new Ext.data.HttpProxy({
        		url: '/mapdata/poidetail?id=1'
    			}),
		reader: new Ext.data.JsonReader({
			root: 'articles',
			fields:[
				{name: 'article_title'},
				{name: 'article_introtext'},
				{name: 'article_url'},
				]
			}),
		});
		
	point_data_store.on('load', function(store) {
		var data = store.reader.jsonData;

		console.log(data);
		var articles = data.articles;
		
		for(i=0; i<articles.length; i++){
			//console.log(articles[i]);
			panel_point_articles.add({
				title: articles[i].article_title,
				html: articles[i].article_introtext + '<br/><br/><a href="' + articles[i].article_url + '" target="_blank">Odkaz na článok</a> ',
				});
			}

		var photos_jos = data.photos_jos;
		for(i=0; i<photos_jos.length; i++){
			//console.log(photos_jos[i]);
			Ext.getCmp("photo_jos").add({
				xtype: 'box',
				width: 80,
				height: 80,
				style:{
					"padding":"10px",
					},
				autoEl:{
					tag: 'img',	
					src: 'http://www.polianka.nfo.sk/wp-content/photos/moco-ganek.jpg',			
					}
				});
			}
		
		var photos_map = data.photos_map;
		for(i=0; i<photos_map.length; i++){
			//console.log(photos_map[i]);
			Ext.getCmp("photo_map").add({
				xtype: 'box',
				width: 80,
				height: 80,
				style:{
					"padding":"10px",
					},
				autoEl:{
					tag: 'img',	
					src: 'http://www.polianka.nfo.sk/wp-content/photos/moco-ganek.jpg',			
					}
				});
			}
		
		popup.show();
		});

	var panel_point_articles = new Ext.Panel({
		title: 'Články k bodu',
		frame: true,
		defaults: {
			bodyStyle: 'padding:15px',
			frame: true,
			collapsible: true,
			collapsed: true,
			},	
		
		});

	var panel_point_photos = new Ext.Panel({
		title: 'Fotografie k bodu',
		frame: true,
		defaults: {
			frame: true,
			},
		items:[{
			id: 'photo_jos',
			},{
			id: 'photo_map'
			}]
		});

	function create_point_info(feature) {
		point_data_store.load();

		var lonlat = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
		lonlat.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
		popup = new GeoExt.Popup({
			unpinnable: false,
			location: feature,
			width: 800,
        		autoHeight: true,
			closeAction: 'hide', 
			title: ' Bod',
			items:[{
				title: 'Informácie o bode',
				frame: true,
				defaults: {
					frame: true,
					},
				items:[{
					xtype: 'box',
					autoEl:{
						tag: 'img',
						src: 'http://icons.iconarchive.com/icons/iron-devil/ids-3d-icons-20/16/Mountain-icon.png',
						align:'left',
						},
					},{
					xtype: 'box',
					height: 30,
					autoEl:{		
						html: 'Vysoké Tatry',
						},
					},{
					xtype: 'box',
					height: 30,
					autoEl:{		
						html: '<b>Súradnice:</b> [ ' + lonlat.x + ',' + lonlat.y + ' ]',
						},
					},{	
					xtype: 'box',
					height: 20,
					autoEl:{		
						html: '<b>Poznámka:</b>',
						},			
					},{	
					xtype: 'box',
					autoHeight: true,
					autoEl:{		
						html: 'Tu sa bude nachádzať text poznámky. Tu sa bude nachádzať text poznámky. Tu sa bude nachádzať text poznámky. Tu sa bude nachádzať text poznámky. Tu sa bude nachádzať text poznámky.',
						},			
					}]
				},
				panel_point_articles,
				panel_point_photos,
				]		
			});

		popup.on({
            		close: function() {
                		if(OpenLayers.Util.indexOf(vectors.selectedFeatures,this.feature) > -1) {
                	    		selectCtrl.unselect(this.feature);
                			}
            			}
        		});		
		}

	});

