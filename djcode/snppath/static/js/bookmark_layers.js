//// BOOKMARK layers	

Ext.onReady(function() {

	// create tree panel with base layers
	var mapBaseLayersTree = new Ext.tree.TreePanel({
		autoHeight: true,
		padding: 10,
		renderTo: 'appBaseLayersHolder',
		root: new GeoExt.tree.BaseLayerContainer({
			layerStore: geoExtMapPanel.layers,
			expanded: true,
			cls: 'x-tree-title-invisible',
			})
		});

	// function for setup the icon image as in layers default stylemap specified	
	iconAdder = function(t,p,n,r){
		if (n.layer.CLASS_NAME == "OpenLayers.Layer.Markers")
			return false;

		if (n.layer.hasOwnProperty('protocol')) {
			var link = n.layer.protocol.url;
			var layerIdent = Ext.urlDecode(link.substr(link.indexOf("?")+1));
		
			if (layerIdent.hasOwnProperty('type')){
				n.setIcon(LayerSettings().getByUrlId(layerIdent.type).background);
				}
		
			if (n.layer.name == gettext("SNP Path")){
					if (n.layer.strategies[0].CLASS_NAME == "OpenLayers.Strategy.Fixed")	
						n.setId(n.layer.name + "_fixed");
					else
						n.setId(n.layer.name + "_bbox");	
					}
			}
		}		
	// create tree panel with over layers
	var mapOverLayersTree = new Ext.tree.TreePanel({
		autoHeight: true,
		padding: 10,
		renderTo: 'appOverLayersHolder',
		id: 'overLayerTree',
		root: new GeoExt.tree.OverlayLayerContainer({
			layerStore: geoExtMapPanel.layers,
			expanded: true,
			cls: 'x-tree-title-invisible',
			listeners:{
				beforeinsert: iconAdder,
				append: iconAdder,
				}
			}),
		});

	// Checkbox events for check/uncheck in Filter panel
	Ext.getCmp("has_photo").on('check', function(el,checked){
		activatePhotoStrategy(checked);	
		});

	Ext.getCmp("has_article").on('check', function(el,checked){
		activateArticleStrategy(checked);
		});

	});

function activatePhotoStrategy(pActivate){
	var layersLength = LayerSettings().getLength();
	for(var i=0; i<layersLength; i++)
		if (overLayers[i].strategies[0].CLASS_NAME == "OpenLayers.Strategy.Filter")
			if (pActivate) 
				overLayers[i].strategies[0].setFilter(filterHasPhoto);
			else 
				overLayers[i].strategies[0].setFilter(filterPhoto);
	}

function activateArticleStrategy(pActivate){
	var layersLength = LayerSettings().getLength();
	for(var i=0; i<layersLength; i++)
		if (overLayers[i].strategies[1].CLASS_NAME == "OpenLayers.Strategy.Filter")
			if (pActivate) 
				overLayers[i].strategies[1].setFilter(filterHasPhoto);
			else 
				overLayers[i].strategies[1].setFilter(filterPhoto);
	}
