//// BOOKMARK layers	

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
					Ext.get('id_'+key).removeClass('correct');
					Ext.get('id_'+key).addClass('error');
					}
				}            
                	})
            	});	

	});

	function addFormInput(number){
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

