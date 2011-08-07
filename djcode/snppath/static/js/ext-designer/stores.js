/*
 *
 * File: stores.js
 * 
 * Stores Classes together for simpler user & Ext-designer independent
 *
 */

activeUsersStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function(cfg) {
        cfg = cfg || {};
        activeUsersStore.superclass.constructor.call(this, Ext.apply({
            storeId: 'activeUsers',
            root: 'live_users',
            url: '/config',
            fields: [
                {
                    name: 'id',
                    mapping: 'id',
                    type: 'int'
                },
                {
                    name: 'username',
                    mapping: 'username',
                    type: 'string'
                },
                {
                    name: 'last_location_time',
                    mapping: 'last_location_time',
                    type: 'date',
                    dateFormat: 'Y-m-d h:i:s'
                },
                {
                    name: 'description',
                    mapping: 'description',
                    type: 'string'
                },
                {
                    name: 'is_active',
                    mapping: 'is_active',
                    type: 'boolean'
                }
            ]
        }, cfg));
    }
});

inactiveUsersStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function(cfg) {
        cfg = cfg || {};
        inactiveUsersStore.superclass.constructor.call(this, Ext.apply({
            storeId: 'inactiveUsers',
            root: 'live_users',
            fields: [
                {
                    name: 'id',
                    mapping: 'id',
                    type: 'int'
                },
                {
                    name: 'username',
                    mapping: 'username',
                    type: 'string'
                },
                {
                    name: 'last_location_time',
                    mapping: 'last_location_time',
                    type: 'date',
                    dateFormat: 'Y-m-d h:i:s'
                },
                {
                    name: 'description',
                    mapping: 'description',
                    type: 'string'
                },
                {
                    name: 'is_active',
                    mapping: 'is_active',
                    type: 'boolean'
                }
            ]
        }, cfg));
    }
});

userRecordsStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function(cfg) {
        cfg = cfg || {};
        userRecordsStore.superclass.constructor.call(this, Ext.apply({
            storeId: 'userRecords',
            url: '/live_tracking/user',
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


// instantiative Stores for next use
var activeUsersStore = new activeUsersStore();
var inactiveUsersStore = new inactiveUsersStore();
var userRecordsStore = new userRecordsStore();
