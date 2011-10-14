// window.js
var popup;

/// POINT handling
Ext.onReady(function() {

	// handle loaded data
	articlePointStore.on('load', function(store){

		// clear cached images from previous POI detail
		Shadowbox.clearCache();

		var data = store.reader.jsonData;
		var gallery = gettext("Photo Gallery");

		// setup correct point name read from store
		Ext.getCmp('name').html = '<strong>' + gettext("Name") + ':</strong>&nbsp;<span style="font-size:14px;">' + data.name + "</span>";		

		// setup correct point moutain read from store
		Ext.getCmp('moutain').html = '<strong>' + gettext("Moutain") + ':</strong>&nbsp;' + data.area;

		// setup correct point note read from store
		Ext.getCmp('notes').html = '<strong>' + gettext("Note") + ':</strong>&nbsp;' + data.note + "<hr/>";

		popup.show();

		// add jos photos into popup, if there area some
		if (data.photos_jos.length > 0){
			var photos_jos = data.photos_jos;
			for(i=0; i<photos_jos.length; i++){
				var newPhoto = Ext.DomHelper.append('photo_jos', 
					String.format('<a rel="shadowbox[{0}]" href="{1}" title="{2}"><img src="{3}"></a>', 
							gallery, photos_jos[i].photo_url, photos_jos[i].photo_title, photos_jos[i].photo_thumb_url)
							, true);

					Shadowbox.setup([newPhoto.dom]);
					}
			}

		// add map photos into popup, if there area some
		if (data.photos_map.length > 0){
			var photos_map = data.photos_map;
			for(i=0; i<photos_map.length; i++){
				var newPhoto = Ext.DomHelper.append('photo_jos', 
					String.format('<a rel="shadowbox[{0}]" href="{1}" title="{2}"><img src="{3}"></a>', 
							gallery, photos_map[i].photo_url, photos_map[i].photo_title, photos_map[i].photo_thumb_url)
							, true);

					Shadowbox.setup([newPhoto.dom]);
					}
			}

		// add articles into popup, if there area some
		if (store.totalLength > 0){	
			var article = '<div class="article" style="height:100px;"><h2>{title}</h2>{introtext}<br/><br/><a href="{url}" target="_blank">Link to article</a></div><br/>';
			var tpl = Ext.DomHelper.createTemplate(article);
			tpl.compile();

			var articles = data.articles;
			for(i=0; i<articles.length; i++){
				var article_introtext = articles[i].article_introtext;
				tpl.append('articles', {
					title: articles[i].article_title,
					introtext: article_introtext,
					url: articles[i].article_url
					});
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
			id: 'name',
			},{
			autoEl:{
				html: gettext("Category") + ': ' + feature.layer.name,
				},	
			},{
			id: 'moutain',
			},{
			autoEl:{		
				html: '<strong>' + gettext("Coordinates") + ':</strong> [ ' + point.x.toFixed(5) + ',' + point.y.toFixed(5) + ' ]',
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

function showLinkToPoint(loc){
	// set the map center as user clicked
	map.setCenter(loc);
	loc = loc.transform(map.projection, map.displayProjection);

	// create permalink
	var permalink = location.protocol + "//" + location.host + "/?";
	permalink += Ext.urlEncode({map_lon:loc.lon.toFixed(5)});  
	permalink += "&" + Ext.urlEncode({map_lat:loc.lat.toFixed(5)}); 
	permalink += "&" + Ext.urlEncode({map_zoom:map.zoom});
	permalink += "&" + Ext.urlEncode({map_permalink:'T'});
	
	resultWindow.setText(gettext("Point link") + ": " +
		" <a href=\"" + permalink + "\">" + loc.lon.toFixed(5) + ", " + loc.lat.toFixed(5) + "</a>");
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

	resultWindow.setText(msg);
	}
