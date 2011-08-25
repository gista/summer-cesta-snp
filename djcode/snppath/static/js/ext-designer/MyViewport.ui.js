/*
 * File: MyViewport.ui.js
 * Date: Sun Aug 07 2011 15:32:31 GMT+0200 (CEST)
 * 
 * This file was generated by Ext Designer version 1.1.2.
 * http://www.sencha.com/products/designer/
 *
 * This file will be auto-generated each and everytime you export.
 *
 * Do NOT hand edit this file.
 */

MyViewportUi = Ext.extend(Ext.Viewport, {
    layout: 'border',
    initComponent: function() {
        this.items = [
            {
                xtype: 'tabpanel',
                activeTab: 0,
                region: 'west',
                width: 250,
                collapsible: true,
                frame: true,
                id: 'appTabs',
                items: [
                    {
                        xtype: 'panel',
                        title: gettext("Layers") + '<br/>&nbsp;',
                        frame: true,
                        layout: 'border',
                        items: [
                            {
                                xtype: 'panel',
                                region: 'center',
                                items: [
                                    {
                                        xtype: 'panel',
                                        frame: true,
                                        id: '',
                                        items: [
                                            {
                                                xtype: 'panel',
                                                id: 'appBaseLayersHolder'
                                            },
                                            {
                                                xtype: 'panel',
                                                id: 'appOverLayersHolder'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'panel',
                                        title: gettext("Filter"),
                                        frame: true,
                                        style: '',
                                        bodyStyle: 'padding:10px',
                                        items: [
                                            {
                                                xtype: 'checkbox',
                                                boxLabel: gettext("points has photo"),
                                                id: 'has_photo'
                                            },
                                            {
                                                xtype: 'checkbox',
                                                boxLabel: gettext("points has article"),
                                                id: 'has_article'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'container',
                                region: 'south',
                                width: 100,
                                height: 120,
                                items: [
                                    {
                                        xtype: 'box',
                                        height: 110,
                                        width: 110,
                                        autoEl: {
                                            'tag': 'img',
                                            'src': 'http://www.jmorganmarketing.com/wp-content/uploads/2010/11/image4.jpg',
                                            'align': 'left',
                                            
                                        }
                                    },
                                    {
                                        xtype: 'box',
                                        height: 110,
                                        width: 110,
                                        autoEl: {
                                            'tag': 'img',
                                            'src': 'http://www.jmorganmarketing.com/wp-content/uploads/2010/11/image4.jpg',
                                            'align': 'right',
                                            
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        title: gettext("LIVE<br/>tracking"),
                        frame: true,
                        layout: 'border',
                        width: 250,
                        items: [
                            {
                                xtype: 'panel',
                                region: 'center',
                                layout: 'vbox',
				id: 'liveTrackingPanel',
                                items: [
                                    {
                                        xtype: 'grid',
                                        title: gettext("Actual on terrain"),
                                        store: 'activeTrackRecords',
					autoExpandColumn: 'last_location_time',
                                        hideHeaders: true,
                                        frame: true,
                                        defaults: {
                                            sortable: false,
                                            fixed: true,
                                            resizable: false,
                                            
                                        },
                                        width: 235,
                                        flex: 2,
                                        id: 'liveTrackingActive',
                                        columns: [
                                            {
                                                xtype: 'gridcolumn',
                                                dataIndex: 'username',
                                                sortable: true,
                                                width: 95
                                            },
                                            {
                                                xtype: 'datecolumn',
                                                dataIndex: 'last_location_time',
                                                sortable: true,
						id: 'last_location_time',
                                                format: 'd.m.Y - h:m'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'grid',
                                        title: gettext("Path ended"),
                                        store: 'inactiveTrackRecords',
					autoExpandColumn: 'last_location_time',
                                        hideHeaders: true,
                                        frame: true,
                                        defaults: {
                                            sortable: false,
                                            fixed: true,
                                            resizable: false,
                                            
                                        },
                                        width: 235,
                                        flex: 2,
                                        id: 'liveTrackingInactive',
                                        columns: [
                                            {
                                                xtype: 'gridcolumn',
                                                dataIndex: 'username',
                                                sortable: true,
                                                width: 95
                                            },
                                            {
                                                xtype: 'datecolumn',
                                                dataIndex: 'last_location_time',
                                                sortable: true,
						id: 'last_location_time',
                                                format: 'd.m.Y - h:m'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'grid',
                                        title: gettext("Actual on terrain"),
                                        store: 'userRecords',
                                        enableHdMenu: false,
                                        frame: true,
                                        defaults: {
                                            sortable: false,
                                            fixed: true,
                                            resizable: false,
                                            
                                        },
                                        viewConfig: {
                                            forceFit: true,
                                            
                                        },
                                        border: false,
                                        hidden: true,
                                        width: 235,
                                        flex: 1,
                                        id: 'liveTrackingRecords',
                                        tbar: {
                                            xtype: 'toolbar',
                                            items: [
                                                {
                                                    xtype: 'tbtext',
                                                    id: 'liveTrackingUsername'
                                                },
                                                {
                                                    xtype: 'tbfill'
                                                },
                                                {
                                                    xtype: 'buttongroup',
                                                    columns: 2,
                                                    autoWidth: true,
                                                    frame: false,
                                                    items: [
                                                        {
                                                            xtype: 'button',
                                                            text: gettext("Refresh"),
                                                            id: 'refreshButton'
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            text: gettext("Return"),
                                                            id: 'backButton'
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        columns: [
                                            {
                                                xtype: 'templatecolumn',
                                                sortable: true,
                                                width: 210,
                                                hideable: false,
                                                tpl: '<b>{time:date("d.m.Y H:i:s")}</b><br/><br/>{message}',
                                                menuDisabled: true
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'container',
                                width: 100,
                                height: 120,
                                region: 'south',
                                items: [
                                    {
                                        xtype: 'box',
                                        height: 110,
                                        width: 110,
                                        autoEl: {
                                            'tag': 'img',
                                            'src': 'http://www.jmorganmarketing.com/wp-content/uploads/2010/11/image4.jpg',
                                            'align': 'left',
                                            
                                        }
                                    },
                                    {
                                        xtype: 'box',
                                        height: 110,
                                        width: 110,
                                        autoEl: {
                                            'tag': 'img',
                                            'src': 'http://www.jmorganmarketing.com/wp-content/uploads/2010/11/image4.jpg',
                                            'align': 'right',
                                            
                                        }
                                    }
                                ]
                            }
                        ]
                    },
		    {
			xtype: 'panel',
                        title: gettext("Add<br/>point"),
                        frame: true,
			layout: 'border',
			items:[
			    {
				xtype: 'form',
				id: 'poiform',
				fileUpload: true,
                                region: 'center',
				buttonAlign: 'center',
				frame: true,
				width: 250,
				autoLoad:{
					url: 'mapdata/poi/',			
					},
										
				buttons:[
				      {
            				text: '<big>' + gettext("Add") + '</big>',
            				type: 'submit',
					id: 'formSubmit',
					cls: 'buttonStyle',
					width: 200
				      }
					],
			    },{
                                xtype: 'container',
                                region: 'south',
                                width: 100,
                                height: 120,
                                items: [
                                    {
                                        xtype: 'box',
                                        height: 110,
                                        width: 110,
                                        autoEl: {
                                            'tag': 'img',
                                            'src': 'http://www.jmorganmarketing.com/wp-content/uploads/2010/11/image4.jpg',
                                            'align': 'left',
                                            
                                        }
                                    },
                                    {
                                        xtype: 'box',
                                        height: 110,
                                        width: 110,
                                        autoEl: {
                                            'tag': 'img',
                                            'src': 'http://www.jmorganmarketing.com/wp-content/uploads/2010/11/image4.jpg',
                                            'align': 'right',
                                            
                                        }
                                    }
                                ]
                            }			
				]
			
		    },
                ]
            },
            {
                xtype: 'container',
                region: 'center',
                width: 100,
                layout: 'border',
                items: [
                    {
                        xtype: 'panel',
                        layout: 'fit',
                        region: 'center',
                        id: 'appMap'
                    },
                    {
                        xtype: 'container',
                        region: 'north',
                        height: 125,
                        id: 'appHeader',
			layout: 'hbox',
			items:[
			    {
				xtype: 'container',
				autoHeight: true,
				style: 'padding:20px',
				flex: 3,
				items: [
				    {
				        xtype: 'box',
					/*autoEl: {
				            'tag': 'img',
				            'src': 'http://cestasnp.sk/templates/greenlife/images/logo.png',
					},*/
				        columnWidth: 0.4
				    },
				    {
				        xtype: 'box',
					/*autoEl: {
				            'tag': 'img',
				            'src': 'http://cestasnp.sk/templates/greenlife/images/logo.png',
					},*/
				        columnWidth: 0.4
				    }
				]
			    },
			    {
				xtype: 'container',
				autoHeight: true,
				style: 'padding:20px',
				flex: 1,
				items: [
				    {
				        xtype: 'box',
				        autoEl: {
				            'tag': 'img',
				            'src': 'http://cestasnp.sk/templates/greenlife/images/logo.png',
					},
				    	listeners:{
						render:function(c) {
      							c.getEl().on('click', function(e) {
								document.location.href = "http://cestasnp.sk/";
							}, c);
						}
				        }
				    }
				]
                    	    }
                	]
		    }
		]
            },
            {
                xtype: 'container',
                region: 'south',
                height: 45,
                id: 'appFooter',
		layout: {
    			type: 'hbox',
    			pack: 'start',
    			align: 'stretch'
			},
		items:[
		   {
			xtype: 'container',
			width: 250,
			id: 'appFooterWest',
		   },
		   {
			xtype: 'container',
			flex: 1,
			id: 'appFooterCenter',
		   },
		   {
			xtype: 'container',
			width: 220,
			style: 'padding: 5px;',
			defaults:{
				style: 'font-size: 12px'	
			},
			items:[
			   {
				xtype: 'box',
				id: 'username',
			   },
			   {
				xtype: 'box',
				id: 'version',
			   }			
			]
		   }
		]
            }
        ];
        MyViewportUi.superclass.initComponent.call(this);
    }
});
