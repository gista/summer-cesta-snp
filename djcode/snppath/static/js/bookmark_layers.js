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
		var icon = "";
		try {
			var styleMap = n.layer.getOptions().styleMap;
			icon = styleMap.styles.default.defaultStyle.externalGraphic;
			n.setIcon(icon);
			
			if (n.layer.name == gettext("SNP Path")){
			// set different IDs for SNP Paths depending on strategy
				if (n.layer.strategies[0].CLASS_NAME == "OpenLayers.Strategy.Fixed")
					n.setId(n.layer.name + "_fixed");
				else
					n.setId(n.layer.name + "_bbox");					
				}
			}
		catch(err) {
			// if I will not define styleMap, the layer will not be added into treenotes	
			return false;		
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
		if (checked)
			strategyPhoto.setFilter(filterHasPhoto);		
		else 
			strategyPhoto.setFilter(filterPhoto);							
		});

	Ext.getCmp("has_article").on('check', function(el,checked){
		if (checked)
			strategyArticle.setFilter(filterHasArticle);	
		else
			strategyArticle.setFilter(filterArticle);
		});

	});
