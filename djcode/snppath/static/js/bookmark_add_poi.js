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
			waitMsg:'Loading...',
			success: function(form,action) {
				alert("Success");
				},            
			failure: function(form,action) { 
				alert("failure");
				console.log(action);
				}            
                	})
            	});	

	});
