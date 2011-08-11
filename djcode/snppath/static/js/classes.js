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

