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
                                height: 120,
				id: 'sideAdvertisementLayers',
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
                                                format: 'd.m.Y',
						align: 'right'
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
                                                xtype: 'gridcolumn',
						dataIndex: 'message',
                                                sortable: false,
                                                width: 210,
                                                hideable: false,
                                                menuDisabled: true,
						renderer: customRenderer
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'container',
                                region: 'south',
                                height: 120,
                                id: 'sideAdvertisementLiveTracking'
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
				autoScroll: true,
				labelAlign: 'top',
                                labelWidth: 0,
				defaults: {
				    anchor: '92%',
				    msgTarget: 'side'
        			},
				items: [
				  {
					xtype: 'textfield',
                                        fieldLabel: gettext('Name'),
                                        name: 'name',
					id: 'poi-name',
					allowBlank: false,
					blankText: gettext('The name of POI is required.'),
					minLength: 5,
					minLengthText: gettext('The name of POI must be at least 5 characters long.')
				  },
				  {
                                        xtype: 'combo',	
					hiddenName: 'type',
                                        fieldLabel: gettext('Type'),
					store: 'comboStore',
					displayField: 'value',
            				valueField: 'name',
					mode: 'local',
            				triggerAction: 'all',
					id: 'poi-type',
					allowBlank: false,
					blankText: gettext('The type of POI is required.'),
                                  },
				  {
                                        xtype: 'label',
                                        html: gettext('Coordinates') + '</b><hr/>',
                                        style: {
                                            'font-size': '15px',
					    'font-weight': 'bold'
                                        }
                                  },
				  {
					xtype: 'textfield',
                                        fieldLabel: gettext('Longitude (e.g. 18.437129)'),
                                        name: 'lon',
					id: 'poi-lon',
					allowBlank: false,
					regex: /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/,
					maskRe: /[-\d\(.)]/i,
					regexText: gettext("Longitude must be a float number"),
					vtype: 'lon',
				  },
				  {
					xtype: 'textfield',
                                        fieldLabel: gettext('Latitude (e.g. 48.45789)'),
                                        name: 'lat',
					id: 'poi-lat',
					allowBlank: false,
					regex: /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/,
					maskRe: /[-\d\(.)]/i,
					regexText: gettext("Latitude must be a float number"),
					vtype: 'lat'
				  },
				  {
                                        xtype: 'textarea',
                                        fieldLabel: gettext('Note'),
                                        name: 'note',
					id: 'poi-notes',
					allowBlank: true,
                                  },
				  {
                                        xtype: 'label',
                                        html: gettext('Photos') + '</b><hr/>',
                                        style: {
                                            'font-size': '15px',
					    'font-weight': 'bold'
                                        }
                                  },
				  {
					xtype: 'hidden',
					name: 'csrfmiddlewaretoken',
					id: 'poi-csrf'
				  },
				  {
					xtype: 'hidden',
					id: 'poi-photo-counter',
					value: 1
				  },
				  {
					xtype: 'fileuploadfield',
					emptyText: gettext('Select an image'),
					fieldLabel: gettext('Photo') + ' #1',
					name: 'photo',
					id: 'poi-photo-1',
					allowBlank: true,
					buttonText: '',
					vtype: 'photo', 
					buttonCfg: {
						'iconCls': 'upload-icon'
						},
					listeners:{
						'fileselected': addNew				
						}
				   }
				],					
				buttons:[
				      {
            				text: '<big>' + gettext("Add") + '</big>',
            				type: 'submit',
					id: 'formSubmit',
					cls: 'buttonStyle',
					width: 200
				      }
					],
			    },
			    {
                                xtype: 'container',
                                region: 'south',
                                height: 120,
                                id: 'sideAdvertisementAddPoi'
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
			width: 230,
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
