/*
 * File: activeLiveTrackingStore.js
 * Date: Wed Aug 10 2011 17:29:10 GMT+0200 (CEST)
 * 
 * This file was generated by Ext Designer version 1.1.2.
 * http://www.sencha.com/products/designer/
 *
 * This file will be auto-generated each and everytime you export.
 *
 * Do NOT hand edit this file.
 */

activeLiveTrackingStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function(cfg) {
        cfg = cfg || {};
        activeLiveTrackingStore.superclass.constructor.call(this, Ext.apply({
            storeId: 'activeTrackRecords',
            sortField: 'last_location_time',
            fields: [
                {
                    name: 'track_id',
                    mapping: 'track_id',
                    type: 'int'
                },
                {
                    name: 'username',
                    mapping: 'username',
                    type: 'string'
                },
                {
                    name: 'last_location_time',
                    type: 'date',
                    dateFormat: 'Y-m-d h:i:s'
                },
                {
                    name: 'description',
                    type: 'string',
                    mapping: 'description'
                }
            ]
        }, cfg));
    }
});
new activeLiveTrackingStore();