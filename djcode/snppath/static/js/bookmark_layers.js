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

	// function for setup the icon image as in layers specified
	iconAdder = function(t,p,n,r){	
		var icon = n.layer.getOptions().styleMap.styles.default.defaultStyle.externalGraphic;
		if (icon)
			n.setIcon(icon);	
		}

	// create tree panel with over layers
	var mapOverLayersTree = new Ext.tree.TreePanel({
		autoHeight: true,
		padding: 10,
		renderTo: 'appOverLayersHolder',
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
