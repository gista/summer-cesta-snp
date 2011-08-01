// SETTINGS
// number of decimals in coords
var COORDS_DEC = 100;

/*

	Click controler

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

function hasParams(){
	var link = document.location.href;
	if ((link.indexOf("zoom") > -1) && (link.indexOf("lon") > -1) && (link.indexOf("lat") > -1)) return true;
	return false;
	}

var map;

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

var popup;

function showPopup(loc, type){
	if (!popup){
		popup = new GeoExt.Popup({
   			title: "Bod na mape",
     			autoWidth: true,
       			map: map,
       			listeners: {
        			close: function() {
        	  			popup = null;
        	  			}
        	 		}
   			});
		} 
	else {
		popup.removeAll();			
		}
	
	popup.add({
		xtype: "box",
		style:{
			"text-align":"center",
			"font-size":"15px",		
			},
		autoEl: {
    			html: "Súradnice: [" + loc.lon.toFixed(2) + 
					 "," + loc.lat.toFixed(2) + "]",
        		},
		},{
		xtype: "box",
		style:{
			"text-align":"center",	
			"font-size":"15px",		
			},
		autoEl: {
    			html: "Permalink: " + document.location.href + 
					"?zoom=" + map.zoom + 
					"&lat=" + loc.lat.toFixed(5) + 
					"&lon=" + loc.lon.toFixed(5),
        		},
    		});
	popup.location = map.getCenter();
 	popup.doLayout();
	popup.show();
	}

Ext.onReady(function(){
	Ext.QuickTips.init();
	
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
      			showPopup(lonlat,0);
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
		listeners:{
			beforeshow: function(e){
				alert("GET /help");
				//e.update()				
				}			
			}					
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

	// LIVE TRACKING data 

	var data_json = {"root":[
{"id":"42","user":"jan.cernansky","device":"CestaSNP","description":null,"date_from":"2011-07-04","date_to":"0000-00-00","located":"2011-07-09 22:26:25"},{"id":"40","user":"jakubos","device":"skrz","description":"Skrz Slovenskom \r\nhttp:\/\/jakub.zilincan.com\/skrz\/?trasa\r\n","date_from":"2011-06-13","date_to":"0000-00-00","located":"2011-06-29 12:19:27"},{"id":"41","user":"Pista","device":"CestaSNP","description":"Pi\u0161ta a Tono vyr\u00e1\u017eaj\u00fa z Dukly. Napl\u00e1novali si 16 d\u0148ov\u00e9 dobrodru\u017estvo.","date_from":"2011-06-25","date_to":"0000-00-00","located":"2011-06-28 21:48:28"},{"id":"16","user":"wlacho","device":"CestaSNP","description":"Jakub na ceste od 3.j\u00fala.2010. Za\u010d\u00edna v Novej Sedlici. Po \u010dervenej pr\u00edde na Duklu a pokra\u010duje po Ceste Hrdinov SNP.","date_from":"0000-00-00","date_to":"0000-00-00","located":"2010-07-23 14:50:51"}]
			};


	var data_json2 = {"root":[
{"device_id":"42","located":"2011-07-12 11:31:15","lat":"48.5917","lon":"21.1035","status":"Poslednu noc som stravil v motoreste pri Velkom Sarisi. Konecne je chladnejsie pocasie a neprsi. ","latlon_format":"M"},
{"device_id":"42","located":"2011-07-10 22:44:39","lat":"49.1448","lon":"21.1213","status":"Hervartov - spim na obecnom urade. Osprchoval som sa, opral si veci a starosta mi po dedine zhanal nabijacku na mobil, lebo moja nejako nefunguje. V Bardejove som chcel kupit novu, ale hold smola, v nedelu nieco take nehrozi. Cesta bola zaujimava. Hore na Maguru bol chodnik uplne zapadany stromami, okolo malincie, v nom vcely. Tak som dostal zihadlo a potom este jedno od srsna. Bolo to do stehna a pri chodzi to boli. Dostavili sa aj prve otlaky. Zajtra ma prsat, tak asi prejdem trocha menej. ","latlon_format":"M"},{"device_id":"42","located":"2011-07-09 22:26:25","lat":"49.2129","lon":"21.1724","status":"Zborov - Kusok za zborovom som si spravil striesku. Dnes bolo tolko zazitkov. Napr diva svina s mladymi ma vynahanala, stretol som jelene, srny... Hral poker s ciganmi... A vela krat som zabludil, lebo vcerajsie burky zbahnili teren a ked som pozeral pod nohy, usla mi sem tam odbocka.","latlon_format":"M"},{"device_id":"42","located":"2011-07-08 20:59:34","lat":"49.181","lon":"21.3029","status":"Cierna Hora - uz 4 hodiny tu prsi. Ked zacalo, uz pol hodiny som bol v utulni a varil som polievku. Do vyhliadky hned vedla udreli 2 blesky, tak von nevychadzam. Vybral som si 2 kliestov a poberam sa spat, nech som zajtra fit. Zatial nastastie bez otlakov.","latlon_format":"M"},
{"device_id":"42","located":"2011-07-07 21:03:56","lat":"49.241","lon":"21.4202","status":"Tak som dorazil na Duklu. Asi 1km od pamatnika som si v podvozku stareho lietadla urobil vysute lozko z celty a povrazu, tak mam pohodlie a som aj skryty pred dazdom.","latlon_format":"M"},
{"device_id":"42","located":"2011-07-07 13:12:02","lat":"48.4312","lon":"21.1605","status":"Cestu zo Ziliny do Kosic mam za sebou. Po obede v mestskom parku som sa pobral na autobusovu stanicu, kde to vyzera z hladiska poctu romskych spoluobcanov o nieco bezpecnejsie ako park.","latlon_format":"M"}]};

	var html = '<div><a href="http://localhost:8000/#zoom=11&lat={lat}&lon={lon}&layers=B0FFTTTTT"><h3>{located}</h3></a><br/>{status}</div><br/><hr/><br/>';

	var tpl = new Ext.Template(html);
	tpl.compile(); 

	var data_store =  new Ext.data.SimpleStore({
		root:'root',
		id:'id',
		fields:[
			{name:'user', mapping:'user'},
			{name:'located', mapping:'located', type: 'date', dateFormat: 'Y-m-d h:i:s'},
			],
		data:data_json,
		autoLoad: true,
  		});

	var record_store =  new Ext.data.SimpleStore({
		root:'root',
		fields:[
			{name: 'located', mapping: 'located', type: 'date', dateFormat: 'Y-m-d h:i:s'},
			{name: 'status', mapping: 'status'},
			{name: 'lat', mapping: 'lat'},
			{name: 'lon', mapping: 'lon'}
			],
		data:data_json2,
		autoLoad: true,
  		});

	// LIVE TRACKING layout

	panel_live_actual = new Ext.grid.GridPanel({
		title: 'Aktuálne v teréne',
		flex: 2,
        	//margins: '0 0 2 0',
		id:'tracking_live',
		store: data_store,
		listeners: {
	  		render: function(grid) {
	  			grid.getView().el.select('.x-grid3-header').setStyle('display', 'none');
				
	    			},
			},
		colModel:new Ext.grid.ColumnModel({
	 		defaults: {
	      			sortable: false,
				
	      			},
	   		columns: [
				{dataIndex: 'user', width: 150,id:'user'},
				{dataIndex: 'located', renderer: Ext.util.Format.dateRenderer('d.m.Y - h:m'), }
				]		
	    		}),
		frame:true,
		});

	var panel_live_end =  new Ext.grid.GridPanel({
		title: 'Cestu ukončili',
		flex: 2,
		id:'tracking_end',
		store: data_store,
		listeners: {
	   		render: function(grid) {
	    			grid.getView().el.select('.x-grid3-header').setStyle('display', 'none');
	    			},
			},
		colModel:new Ext.grid.ColumnModel({
	  		defaults: {
	     			sortable: false,
	     			},
	 		columns: [
				{dataIndex: 'user',id:'user'},
				{dataIndex: 'located', width: 150, renderer: Ext.util.Format.dateRenderer('d.m.Y')}
				]	
	    		}),
		frame:true,		
		});

	function renderStatus(value, p, record){
		return '<b>' + record.data.located.format("d.m.Y - h:m") + '</b><br/><br/>'+ value;				
		}

	var panel_live_record = new Ext.Panel({
		id:'tracking_record',
		layout:'fit',
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
			store: record_store,
			colModel:new Ext.grid.ColumnModel({
	  			defaults: {
	     				sortable: false,
					menuDisabled: true,
					width: 250,
	     				},
	 			columns: [{
					header:'<div id="live_tracking_record_header">Janka</div><hr/>Description: <span id="live_tracking_record_desc">popis</span>',
					dataIndex: 'status', 
					width: 230,
					renderer:renderStatus, 
					}]	
	    			}),
			}],		
		region: 'north',	
		});

	//Ext.fly('live_tracking_record_header').update('Peter');
	//Ext.fly('live_tracking_record_desc').update('Môj vlastný popis');

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
			store: new Ext.data.SimpleStore({
				id:0,
				fields:[
                			'id',
                			'name'
            				],
        			data:data_layers
    				}),
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
			margins: '0 0 0 0',
			cmargins: '0 0 0 0',
			width: 266,
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
		var pnl = Ext.getCmp("tracking_record");
		pnl.setTitle("Aktuálne v teréne");
/*
		var arr = record_store.data.items;
		for(i=0;i<arr.length; i++){
			tpl.append('records',{lat:arr[i].data.lat, lon:arr[i].data.lon, located:arr[i].data.located, status:arr[i].data.status});
			}
*/
		pnl.show();

		Ext.getCmp("tracking_live").hide();
		Ext.getCmp("tracking_end").hide();
  	});

	Ext.getCmp("tracking_end").on('rowclick', function(grid, rowIndex, e) {
		var pnl = Ext.getCmp("tracking_record");
		pnl.setTitle("Cestu ukončili")
		pnl.show();

		Ext.getCmp("tracking_live").hide();
		Ext.getCmp("tracking_end").hide();
  	});
	
	// simple feature point functionality
	var lonLat = new OpenLayers.LonLat(21.12,49);

	lonLat = lonLat.transform(
		new OpenLayers.Projection("EPSG:4326"), 
		map.getProjectionObject() 
		);
	point = new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat);
	map.layers[5].addFeatures([new OpenLayers.Feature.Vector(point)]);

	var window_articles = new Ext.Window({
		title: 'Články k bodu',
		width: 500,
		autoHeight: true,
		layout: 'accordion',
		closeAction: 'hide',
		defaults: {
			bodyStyle: 'padding:15px',
			frame: true,
			},
		layoutConfig: {
			collapsible: true,
			animate: true,
			activeOnTop: false,
			},
		items:[{
			title: 'Článok 1',	
			html: 'Úvodný text článku',		
			}]
		});
	
	window_articles.add({title: 'Článok 2', html: 'Úvodný text článku 2'});
	window_articles.add({title: 'Článok 3', html: 'Úvodný text článku 3'});
	window_articles.add({title: 'Článok 4', html: 'Úvodný text článku 4'});

	var window_photos = new Ext.Window({
		title: 'Fotografie k bodu',
		width: 450,
		autoHeight: true,
		frame: true,	
		closeAction: 'hide',
		defaults: {
			frame: true,
			},
		items:[{
			id: 'window_photo_point',
			},{
			id: 'window_photo_web'
			}]
		});
	
	for(var i=0;i<3;i++)
		Ext.getCmp("window_photo_point").add({
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

	for(var i=0;i<14;i++)
		Ext.getCmp("window_photo_web").add({
			xtype: 'box',
			width: 80,
			height: 80,
			style:{
				"padding":"10px",
				},
			autoEl:{
				tag: 'img',	
				src: 'http://www.polianka.nfo.sk/wp-content/photos/moco-ganek.jpg',
				},
			});
	
	function create_point_info(feature) {
		var lonlat = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
		lonlat.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
		popup = new GeoExt.Popup({
            		title: 'Názov bodu',
            		location: feature,
            		width:350,
			items:[{
				xtype: 'box',
				autoEl:{
					tag: 'img',
					src: 'http://icons.iconarchive.com/icons/iron-devil/ids-3d-icons-20/16/Mountain-icon.png',
					href: 'x',
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
				}],
				buttons:[{
					style:{
						align: 'left',
						},
					text: 'Ćlánky súvisiace s bodom',
					handler:function(){
						window_articles.show();					
						}
					},{
					style:{
						align: 'right',
						},
					text: 'Fotografie súvisiace s bodom',
					handler:function(){
						window_photos.show();							
						}
					}]
        		});

		popup.on({
            		close: function() {
                		if(OpenLayers.Util.indexOf(vectors.selectedFeatures,this.feature) > -1) {
                	    		selectCtrl.unselect(this.feature);
                			}
            			}
        		});
        	popup.show();
	}


	if (!map.getCenter()) if (hasParams()) setMapCenter();

	map.addControl(new OpenLayers.Control.MousePosition());

	});
