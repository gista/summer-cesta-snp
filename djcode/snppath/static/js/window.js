// window.js
var popup;

/// POINT handling
Ext.onReady(function() {

	// handle loaded data
	articlePointStore.on('load', function(store){
		console.log(store.reader.jsonData);
		var data = store.reader.jsonData;
		// setup correct point moutain read from store
		Ext.getCmp('moutain').html = '<b>' + gettext("Moutain") + ':</b>&nbsp;' + data.area;

		// setup correct point note read from store
		Ext.getCmp('notes').html = '<b>' + gettext("Note") + ':</b>&nbsp;' + data.note + "<hr/>";

		popup.show();

		// add articles into popup, if there area some
		if (store.totalLength > 0){	
			var article = '<div class="article"><h2>{title}</h2>{introtext}<br/><br/><a href="{url}" target="_blank">Link to article</a></div><br/>';
			var tpl = Ext.DomHelper.createTemplate(article);
			tpl.compile();

			var articles = data.articles;
			for(i=0; i<articles.length; i++){
				tpl.append('articles', {
					title: articles[i].article_title,
					introtext: articles[i].article_introtext,
					url: articles[i].article_url
					});
				}			
			}

		
		var image = '<div><img src="{url}" style="padding: 10px; width: 60px; height: 60px;"></div>';
		var tpl = Ext.DomHelper.createTemplate(image);
		tpl.compile();
		
		// add jos photos into popup, if there area some
		if (data.photos_jos.length > 0){
			var photos_jos = data.photos_jos;
			for(i=0; i<photos_jos.length; i++){
				var photoUrl = '/media/' + photos_jos[i] + '/';
				tpl.append('photo_jos',{
					url:photoUrl
					})
				}
			}

		// add map photos into popup, if there area some
		if (data.photos_map.length > 0){
			var photos_map = data.photos_map;
			for(i=0; i<photos_map.length; i++){
				var photoUrl = '/media/' + photos_jos[i] + '/';
				tpl.append('photo_map',{
					url:photoUrl
					})
				}
			}
		
		});

	})

function createPoint(feature) {
	// get lonlat for next use
	var point = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
	point.transform(map.projection, map.displayProjection);

	// create basic window with height, width & position from map 
	popup = new Ext.Window({
		modal: false,
		x: geoExtMapPanel.getPosition()[0],
		y: geoExtMapPanel.getPosition()[1],
    		height: geoExtMapPanel.getHeight(),
    		width: geoExtMapPanel.getWidth(),
		plain: true,
		header: false,
		autoScroll: true,  
		border: false,
		bodyBorder: false,
		style: 'padding: 10px;',
		bodyStyle: 'padding:15px; ',
		cls: 'poi',
		defaults: {
			xtype: 'box',
			autoHeight: true,
			},	
		items:[{
			id: 'moutain',
			},{
			autoEl:{		
				html: '<b>' + gettext("Coordinates") + ':</b> [ ' + point.x + ',' + point.y + ' ]',
				},
			},{	
			id: 'notes',	
			},{
			id: 'articles',
			},{
			id: 'photo_jos',
			},{
			id: 'photo_map'
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
		title: gettext("Map point"),
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
				html: "<b>" + gettext("Coordinates") + ":</b><br/> [" + loc.lon +  "," + loc.lat + "]",
				},
			},{
			xtype: "box",
			style:{	
				"font-size":"13px",
				"padding": "10px"		
				},
			autoEl: {
				html: "<b>" + gettext("Permalink") + ":</b><br/> " + permalink,
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
	var msg = "";
	if(order == 1){
		msg += gettext("Measured&nbsp;length:&nbsp;") + measure.toFixed(2) + "&nbsp;" + units;
		}
	else {
		msg += gettext("Measured&nbsp;area:&nbsp;") + measure.toFixed(2) + "&nbsp;" + units + "<sup>2</sup>";
		}
	Ext.Msg.show({
		title: gettext("Measure"),
		msg: msg,
		buttons: Ext.Msg.OK,
		icon: Ext.MessageBox.INFO
		});
	}
