//// BOOKMARK layers	

var POIFORM_CLASS_CORRECT = 'correct'
var POIFORM_CLASS_ERROR = 'error'

// ! required for correct form validation
var POIFORM_INPUTS = ['name','type','lat','lon'];

Ext.onReady(function() {

	// CSRF solution

	Ext.Ajax.on('beforerequest', function (conn, options) {
		if (!(/^http:.*/.test(options.url) || /^https:.*/.test(options.url))) {
			if (typeof(options.headers) == "undefined") {
				options.headers = {'X-CSRFToken': Ext.util.Cookies.get('csrftoken')};
			} else {
				options.headers.extend({'X-CSRFToken': Ext.util.Cookies.get('csrftoken')});
				}
			}
		}, this);

	Ext.getCmp('formSubmit').on('click', function() {
		// check if form is with correct inputs 
		var result = true;
		result = (validateName(POIFORM_INPUTS[0])) && (result);
		result = (validateType(POIFORM_INPUTS[1])) && (result);
		result = (validateLat(POIFORM_INPUTS[2])) && (result);
		result = (validateLon(POIFORM_INPUTS[3])) && (result);;

		if (result){
			Ext.getCmp('poiform').getForm().submit({
				method: 'POST',
				url: 'mapdata/poi/',
				waitMsg: gettext("Loading..."),
				success: function(form,action) {
					// the id of layer, which I will refresh settled in server response 
					var layerId = action.result.layer;
					overLayers[overLayers.length-layerId].refresh();
					Ext.Msg.show({
						title: gettext("Point of Interest"),
						msg: gettext("New poi has been successfully added."),
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.INFO
						});
					},
				failure: function(form,action) { 
					var msg = ""
					var errors = action.result.errors;
					for(key in errors){
						Ext.fly('error_'+key).update(errors[key]);
						Ext.get('id_'+key).removeClass(POIFORM_CLASS_CORRECT);
						Ext.get('id_'+key).addClass(POIFORM_CLASS_ERROR);
						}
					}
				})
			}
		});	
	});

	function addFormInput(number){
	// function for dynamic creation of file inputs for user

		// first we get the number of file inputs
		var fileNo = parseInt(Ext.get('fileCounter').dom.value);
		if (number>=fileNo){
			// the user added new file, we update the file counter
			Ext.get('fileCounter').dom.value = fileNo+1; 

			// we create div where should be new file input placed
			var whereTo = 'myDiv'+fileNo;
			Ext.DomHelper.append('multiuploader', '<div class="upload" id="'+ whereTo +'">\n</div>');

			// add photo label
			Ext.DomHelper.append(whereTo, '<label for="realupload'+ fileNo +'">'+ gettext("Photo") + ' #'+ (parseInt(fileNo)+1) +'</label>');

			var whereForInput = 'fakeupload'+fileNo;

			// we must create fake div
			var whatToAppend = '<div class="fakeupload" id="'+whereForInput+'">\n</div>';	
			Ext.DomHelper.append(whereTo, whatToAppend);

			// then we append fake input
			Ext.DomHelper.append(whereForInput, '\t<input type="text" name="'+ whereForInput +'">\n');

			// and then we append invisible file input over it
			Ext.DomHelper.append(whereTo, '\n<input type="file" class="realupload" id="realupload'+ fileNo +'" name="photo" onchange="this.form.'+ whereForInput +'.value=this.value; addFormInput('+ (fileNo+1)+');">\n');
			}
		}

	function validateName(htmlName){
	// function for validation of 'Name' field in Poi form
		var htmlId = 'id_' + htmlName;
		var errorId = 'error_' + htmlName;
		var verifyName = Ext.get(htmlId).dom.value;
 
		if (verifyName.length>=5){
			Ext.get(htmlId).removeClass(POIFORM_CLASS_ERROR);
			Ext.get(htmlId).addClass(POIFORM_CLASS_CORRECT);
			Ext.fly(errorId).update('');
			return true;
			}
		else {
			Ext.get(htmlId).removeClass(POIFORM_CLASS_CORRECT);
			Ext.get(htmlId).addClass(POIFORM_CLASS_ERROR);
			Ext.fly(errorId).update(gettext("Minimum 5characters."));	
			return false;
			}
		}

	function validateType(htmlName){
	// function for validation of 'Type' field in Poi form
		var htmlId = 'id_' + htmlName;
		var errorId = 'error_' + htmlName;
		var type = Ext.get(htmlId).dom.value;

		if (Number(type)>0){
			Ext.get(htmlId).removeClass(POIFORM_CLASS_ERROR);
			Ext.get(htmlId).addClass(POIFORM_CLASS_CORRECT);
			Ext.fly(errorId).update('');
			return true;
			}
		else {
			Ext.get(htmlId).removeClass(POIFORM_CLASS_CORRECT);
			Ext.get(htmlId).addClass(POIFORM_CLASS_ERROR);
			Ext.fly(errorId).update(gettext("Type must be selected."));
			return false;
			}		
		}

	function validateLat(htmlName){
	// function for validation of 'Latitude' field in Poi form
		var htmlId = 'id_' + htmlName;
		var errorId = 'error_' + htmlName;
		var lat = Ext.get(htmlId).dom.value;

		if ((lat.length>0) && (Number(lat))){
			if ((Number(lat)>=47.7311897277832) && (Number(lat)<=49.6138000488281)){
			// latitude BBOX of Slovakia from 47.7311897277832 to 49.6138000488281
				Ext.get(htmlId).removeClass(POIFORM_CLASS_ERROR);
				Ext.get(htmlId).addClass(POIFORM_CLASS_CORRECT);
				Ext.fly(errorId).update('');
				return true;
				}
			else {
				Ext.get(htmlId).removeClass(POIFORM_CLASS_CORRECT);
				Ext.get(htmlId).addClass(POIFORM_CLASS_ERROR);
				Ext.fly(errorId).update(gettext("Latitude must be in bounds of Slovakia"));				
				}
			}
		else {
			Ext.get(htmlId).removeClass(POIFORM_CLASS_CORRECT);
			Ext.get(htmlId).addClass(POIFORM_CLASS_ERROR);
			Ext.fly(errorId).update(gettext("Must be a float number"));		
			}
		return false;		
		}

	function validateLon(htmlName){
	// function for validation of 'Longitude' field in Poi form
		var htmlId = 'id_' + htmlName;
		var errorId = 'error_' + htmlName;
		var lon = Ext.get(htmlId).dom.value;

		if ((lon.length>0) && (Number(lon))){
			if ((Number(lon)>=16.8332004547119) && (Number(lon)<=22.5656967163086)){
			// Longitude BBOX of Slovakia from 16.8332004547119 to 22.5656967163086
				Ext.get(htmlId).removeClass(POIFORM_CLASS_ERROR);
				Ext.get(htmlId).addClass(POIFORM_CLASS_CORRECT);
				Ext.fly(errorId).update('');
				return true;
				}
			else {
				Ext.get(htmlId).removeClass(POIFORM_CLASS_CORRECT);
				Ext.get(htmlId).addClass(POIFORM_CLASS_ERROR);
				Ext.fly(errorId).update(gettext("Longitude must be in bounds of Slovakia"));						
				}
			}
		else {
			Ext.get(htmlId).removeClass(POIFORM_CLASS_CORRECT);
			Ext.get(htmlId).addClass(POIFORM_CLASS_ERROR);
			Ext.fly(errorId).update(gettext("Must be a float number"));		
			}
		return false;		
		}
