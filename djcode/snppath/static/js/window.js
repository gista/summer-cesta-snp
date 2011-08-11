var popup;

/// POINT handling
Ext.onReady(function() {

	// handle loaded data
	articlePointStore.on('load', function(store){
		console.log(store.reader.jsonData);
		var data = store.reader.jsonData;
		// setup correct point moutain read from store
		Ext.getCmp('moutain').html = "<b>Pohorie:</b> " +data.area;
		
		// setup correct point note read from store
		Ext.getCmp('notes').html = data.note;
		
		// add articles into popup, if there area some
		if (store.data.length > 0){	
			var articlePointPanel = Ext.getCmp('articles');
			var articles = data.articles;
			for(i=0; i<articles.length; i++){
				articlePointPanel.add({
					title: articles[i].article_title,
					html: articles[i].article_introtext + '<br/><br/> \
						<a href="' + articles[i].article_url + '" target="_blank">Odkaz na článok</a> ',
				});
			}
			// show article bookmark in popup
			articlePointPanel.show();			
			}

		// add jos photos into popup, if there area some
		if (data.photos_jos.length > 0){
			var photos_jos = data.photos_jos;
			for(i=0; i<photos_jos.length; i++){
				Ext.getCmp("photo_jos").add({
					xtype: 'box',
					width: 80,
					height: 80,
					style:{
						"padding":"10px",
						},
					autoEl:{
						tag: 'img',
						// right now just simple testing images	
						src: 'http://www.polianka.nfo.sk/wp-content/photos/moco-ganek.jpg',			
						}
					});
				}
			// if some added, show the photos panel in point popup
			Ext.getCmp('photos').show();
			}

		// add map photos into popup, if there area some
		if (data.photos_map.length > 0){
			var photos_map = data.photos_map;
			for(i=0; i<photos_map.length; i++){
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
			// if some added, show the photos panel in point popup
			Ext.getCmp('photos').show();			
			}

		// after all settings show the popup
		popup.show();
		});

	})

function createPoint(feature) {
	// get lonlat for next use
	var point = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
	point.transform(map.projection, map.displayProjection);

	// create basic popup
	console.log(feature);
	popup = new GeoExt.Popup({
		unpinnable: false,
		location: feature,
		autoWidth: true,
        	autoHeight: true,
		title: 'Bod',
		items:[{
			title: 'Informácie o bode',
			frame: true,
			defaults: {
				frame: true,
				},
			items:[{
				xtype: 'box',
				height: 30,
				id: 'moutain',
				},{
				xtype: 'box',
				height: 30,
				autoEl:{		
					html: '<b>Súradnice:</b> [ ' + point.x + ',' + point.y + ' ]',
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
				id: 'notes',		
				}]
			},{
			title: 'Články k bodu',
			id: 'articles',
			frame: true,
			hidden: true,
			defaults: {
				bodyStyle: 'padding:15px',
				frame: true,
				collapsible: true,
				collapsed: true,
				},	
		
			},{
			title: 'Fotografie k bodu',
			id: 'photos',
			frame: true,
			hidden: true,
			defaults: {
				frame: true,
				},
			items:[{
				id: 'photo_jos',
				},{
				id: 'photo_map'
				}]
			}]
		});

	// request data depends on feature id
	articlePointStore.proxy.conn.url = articlePointStore.url + Ext.urlEncode({id:feature.fid});
	articlePointStore.load();
	}

var popupPoint;

function showPopup(loc){
	// set the map center as user clicked
	map.setCenter(loc);
	loc = loc.transform(map.projection, map.displayProjection);

	// create permalink
	var permalink = document.location.href + 
			"?zoom=" + map.zoom + 
			"&lat=" + loc.lat + //.toFixed(5) + 
			"&lon=" + loc.lon; //.toFixed(5);

	// if there was already some point popup shown, destroy the old one
	if (popupPoint)
		popupPoint.destroy();		

	// create popup for user click point
	popupPoint = new GeoExt.Popup({
   		title: "Bod na mape",
     		autoWidth: true,
		unpinnable: false,
		map: map,
		location: map.getCenter(),
		items:[{
			xtype: "box",
			style:{
				"font-size": "13px",
				"padding": "10px"		
				},
			autoEl: {
	    			html: "<b>Súradnice:</b><br/> [" + loc.lon + 
						 "," + loc.lat + "]",
				},
			},{
			xtype: "box",
			style:{	
				"font-size":"13px",
				"padding": "10px"		
				},
			autoEl: {
	    			html: "<b>Permalink:</b><br/> " + permalink,
				},
	    		}]
   		});

	popupPoint.show();
	}	

//Function to handle measures of length and area 

function handleMeasurements(event) {
	var geometry = event.geometry;
	var units = event.units;
	var order = event.order;
	var measure = event.measure;
	var out = "";
	if(order == 1){
		out += "Nameraná&nbsp;dĺžka:&nbsp;" + measure.toFixed(2) + "&nbsp;" + units;
		}
	else {
		out += "Nameraná&nbsp;plocha:&nbsp;" + measure.toFixed(2) + "&nbsp;" + units + "<sup>2</sup>";
		}
	Ext.Msg.alert('Meranie', out);
  	}
