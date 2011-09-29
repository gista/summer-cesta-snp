//// BOOKMARK layers	

var POIFORM_CLASS_CORRECT = 'correct'
var POIFORM_CLASS_ERROR = 'error'

// ! required for correct form validation
var POIFORM_INPUTS = ['name','type','lat','lon'];

Ext.onReady(function() {

	Ext.getCmp('formSubmit').on('click', function() {
		// check if form is with correct inputs 
		var form = Ext.getCmp('poiform').getForm();
		if (form.isValid()){
			form.submit({
				method: 'POST',
				url: 'mapdata/poi/',
				waitMsg: gettext("Verifying new POI..."),
				success: function(form,action) {
					// the id of layer, which I will refresh settled in server response 
					var layerId = action.result.layer;
					overLayers[overLayers.length-layerId].refresh();
					Ext.Msg.show({
						title: gettext("Point of Interest"),
						msg: gettext("New POI has been successfully added."),
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.INFO
						});
					var counter = Ext.getCmp('poiform').findById('poi-photo-counter');
					var photoCount = Number(counter.getValue());

					form.reset();
					// remove all file inputs from form					
					for(var i=2;i<=photoCount;i++)
						Ext.getCmp('poiform').remove(Ext.getCmp('poiform').findById('poi-photo-' + i));
					counter.setValue(1);
					},
				failure: function(form,action) { 
					Ext.Msg.show({
						title: gettext("Point of Interest"),
						msg: gettext("An error in POI form."),
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
						});
					}
				})
			}
		});
	});

// validators
Ext.apply(Ext.form.VTypes, {
	lat: function(pLat, field) {
		if ((pLat.length>0) && (Number(pLat)))
			if ((Number(pLat)>=47.7311897277832) && (Number(pLat)<=49.6138000488281))
				return true;
		return false;
		},
	latText: gettext('Latitude must be in bounds of Slovakia.'),
	});

Ext.apply(Ext.form.VTypes, {
	lon: function(pLon, field) {
		if ((pLon.length>0) && (Number(pLon)))
			if ((Number(pLon)>=16.8332004547119) && (Number(pLon)<=22.5656967163086))
				return true;
		return false;
		},
	lonText: gettext('Longitude must be in bounds of Slovakia.'),
	});

Ext.apply(Ext.form.VTypes, {
	photo: function(pPhoto, field) {
		var exp = /^.*\.(jpg|jpeg|JPG|JPEG)$/;
		return exp.test(pPhoto);
		},
	photoText: gettext('Photos only with JPEG extension allowed.'),
	});

// function for dynamic adding new photo inputs
var addNew = function(fb, v){
	// filefield extension validation  
	if (!fb.isValid())
		return;

	var counter = Ext.getCmp('poiform').findById('poi-photo-counter');
	var photoId = Number(counter.getValue()) + 1
	counter.setValue(photoId);

	var form = Ext.getCmp('poiform');
	form.add({
		xtype: 'fileuploadfield',
		emptyText: gettext('Select an image'),
		fieldLabel: gettext('Photo') + ' #' + photoId,
		name: 'photo',
		id: 'poi-photo-' + photoId,
		allowBlank: true,
		buttonText: '',
		vtype: 'photo',
		buttonCfg: {
			'iconCls': 'upload-icon'
			},
		listeners: {
			'fileselected': addNew
			}
		})
	form.doLayout();
	}
