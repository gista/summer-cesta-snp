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
			'background': '/static/icons/hut.png', 
			'background_selected': '/static/icons/hut.png'
		},
		{'urlId': 2, 
			'name': gettext('cottage'), 
			'visibility': true, 
			'background': '/static/icons/cottage.png', 
			'background_selected': '/static/icons/cottage.png'
		},
		{'urlId': 3, 
			'name': gettext('water'), 
			'visibility': true, 
			'background': '/static/icons/water.png', 
			'background_selected': '/static/icons/water.png'
		},
		{'urlId': 4, 
			'name': gettext('restaurant, pub'), 
			'visibility': true, 
			'background': '/static/icons/nutrition.png', 
			'background_selected': '/static/icons/nutrition.png'
		},
		{'urlId': 5, 
			'name': gettext('grocery'), 
			'visibility': true, 
			'background': '/static/icons/grocery.png', 
			'background_selected': '/static/icons/grocery.png'
		},
		{'urlId': 6, 
			'name': gettext('interesting place'), 
			'visibility': true, 
			'background': '/static/icons/interest.png', 
			'background_selected': '/static/icons/interest.png'
		},
		{'urlId': 7, 
			'name': gettext('other'), 
			'visibility': true, 
			'background': '/static/icons/other.png', 
			'background_selected': '/static/icons/other.png'
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
