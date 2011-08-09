/*
 * File: userRecordsStore.js
 * Date: Sun Aug 07 2011 15:32:31 GMT+0200 (CEST)
 * 
 * This file was generated by Ext Designer version 1.1.2.
 * http://www.sencha.com/products/designer/
 *
 * This file will be auto-generated each and everytime you export.
 *
 * Do NOT hand edit this file.
 */

userRecordsStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function(cfg) {
        cfg = cfg || {};
        userRecordsStore.superclass.constructor.call(this, Ext.apply({
            storeId: 'userRecords',
            url: 'live_tracking/user/?',
            fields: [
                {
                    name: 'lon',
                    mapping: 'lon',
                    type: 'float'
                },
                {
                    name: 'lat',
                    mapping: 'lat',
                    type: 'float'
                },
                {
                    name: 'time',
                    type: 'date',
                    mapping: 'time',
                    dateFormat: 'Y-m-d h:i:s'
                },
                {
                    name: 'message',
                    type: 'string',
                    mapping: 'message'
                }
            ]
        }, cfg));
    }
});
new userRecordsStore();
