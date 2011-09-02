// Overridden control class for handling user click

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

function LayerSettings(){
	/*
	Singleton class used for get layer settings
	Private variable OVER_LAYERS holds the settings for layers		
	*/
	var OVER_LAYERS = [
		{'urlId': 1, 
			'name': gettext('hut, shelter'), 
			'visibility': true,  
			'background': '/static/icons/utulna.png', 
			'background_selected': '/static/icons/utulna.png'
		},
		{'urlId': 2, 
			'name': gettext('cottage'), 
			'visibility': true, 
			'background': '/static/icons/chata.png', 
			'background_selected': '/static/icons/chata.png'
		},
		{'urlId': 3, 
			'name': gettext('water'), 
			'visibility': true, 
			'background': '/static/icons/voda.png', 
			'background_selected': '/static/icons/voda.png'
		},
		{'urlId': 4, 
			'name': gettext('restaurant, pub'), 
			'visibility': true, 
			'background': '/static/icons/stravovanie.png', 
			'background_selected': '/static/icons/stravovanie.png'
		},
		{'urlId': 5, 
			'name': gettext('grocery'), 
			'visibility': true, 
			'background': '/static/icons/supermarket.png', 
			'background_selected': '/static/icons/supermarket.png'
		},
		{'urlId': 6, 
			'name': gettext('interesting place'), 
			'visibility': true, 
			'background': '/static/icons/zaujimavosti.png', 
			'background_selected': '/static/icons/zaujimavosti.png'
		},
		{'urlId': 7, 
			'name': gettext('other'), 
			'visibility': true, 
			'background': '/static/icons/ostatne.png', 
			'background_selected': '/static/icons/ostatne.png'
		}];

	var getInstance = function() {
		if (!LayerSettings.singletonInstance) {
			LayerSettings.singletonInstance = createInstance();
			}
		return LayerSettings.singletonInstance;
		}

	// Create an instance of the Cats class
	var createInstance = function() {
		return {
			get: function(pId) {
				return OVER_LAYERS[pId];
				},
			getByUrlId: function(pUrlId){
				for(var i=0;i<OVER_LAYERS.length;i++)
					if (OVER_LAYERS[i].urlId == pUrlId) 
						return OVER_LAYERS[i]
				return null;	
				},
			getLength: function(){
				return OVER_LAYERS.length;				
				}
			}
		}

	return getInstance();
	}
