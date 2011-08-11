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
                        title: 'Vrstvy<br/>&nbsp;',
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
                                        title: 'Filter',
                                        frame: true,
                                        style: '',
                                        bodyStyle: 'padding:10px',
                                        items: [
                                            {
                                                xtype: 'checkbox',
                                                boxLabel: 'k bodu je fotografia',
                                                id: 'has_photo'
                                            },
                                            {
                                                xtype: 'checkbox',
                                                boxLabel: 'k bodu je článok',
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
                        title: 'LIVE<br/>sledovanie',
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
                                        title: 'Aktuálne v teréne',
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
                                        title: 'Cestu ukončili',
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
                                        title: 'Aktuálne v teréne',
                                        store: 'userRecords',
                                        enableHdMenu: false,
                                        frame: true,
                                        hideHeaders: true,
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
                                                            text: 'Refresh',
                                                            id: 'refreshButton'
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            text: 'Return',
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
                        title: 'Pridaj<br/>bod',
                        frame: true,
                        layout: 'border',
                        items: [
                            {
                                xtype: 'form',
                                region: 'center',
                                frame: true,
                                labelAlign: 'top',
                                labelWidth: 0,
                                defaults: {
                                    'width': '220px'
                                },
                                buttonAlign: 'center',
                                width: 250,
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Názov bodu*',
                                        anchor: '100%',
                                        id: 'pointName'
                                    },
                                    {
                                        xtype: 'combo',
                                        fieldLabel: 'Kategória',
                                        anchor: '100%',
                                        id: 'pointCats'
                                    },
                                    {
                                        xtype: 'label',
                                        text: 'Súradnice',
                                        html: '<b>Súradnice</b><hr/>',
                                        style: {
                                            'font-size': '15px'
                                        }
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Zemepisná šírka: * (napr. 48.45789):',
                                        anchor: '100%',
                                        id: 'pointLat'
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Zemepisná dĺžka: * (napr. 19.45732):',
                                        anchor: '100%',
                                        id: 'pointLon'
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Fotografia',
                                        anchor: '100%',
                                        id: 'pointPhoto'
                                    },
                                    {
                                        xtype: 'textarea',
                                        anchor: '100%',
                                        fieldLabel: 'Poznámka',
                                        id: 'pointNotes'
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Pridaj'
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
                    }
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
                        height: 100,
                        id: 'appHeader'
                    }
                ]
            },
            {
                xtype: 'container',
                region: 'south',
                width: 100,
                height: 50,
                id: 'appFooter'
            }
        ];
        MyViewportUi.superclass.initComponent.call(this);
    }
});
