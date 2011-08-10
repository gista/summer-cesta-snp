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
            url: 'config/',
            fields: [
                {
                    name: 'id',
                    mapping: 'id',
                    type: 'int'
                },
                {
                    name: 'username',
                    mapping: 'username'
                },
                {
                    name: 'track_name',
                    mapping: 'track_name',
                    type: 'string'
                },
                {
                    name: 'first_name',
                    mapping: 'first_name',
                    type: 'string'
                },
                {
                    name: 'last_name',
                    mapping: 'last_name',
                    type: 'string'
                },
                {
                    name: 'email',
                    mapping: 'email',
                    type: 'string'
                },
                {
                    name: 'phone',
                    mapping: 'phone',
                    type: 'string'
                },
                {
                    name: 'is_active',
                    mapping: 'is_active',
                    type: 'boolean'
                },
                {
                    name: 'last_location_time',
                    mapping: 'last_location_time',
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
                    mapping: 'username'
                },
                {
                    name: 'track_name',
                    mapping: 'track_name',
                    type: 'string'
                },
                {
                    name: 'first_name',
                    mapping: 'first_name',
                    type: 'string'
                },
                {
                    name: 'last_name',
                    mapping: 'last_name',
                    type: 'string'
                },
                {
                    name: 'email',
                    mapping: 'email',
                    type: 'string'
                },
                {
                    name: 'phone',
                    mapping: 'phone',
                    type: 'string'
                },
                {
                    name: 'is_active',
                    mapping: 'is_active',
                    type: 'boolean'
                },
                {
                    name: 'last_location_time',
                    mapping: 'last_location_time',
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

articlePointStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function(cfg) {
        cfg = cfg || {};
        articlePointStore.superclass.constructor.call(this, Ext.apply({
            storeId: 'articlePoints',
            root: 'articles',
            url: 'mapdata/poidetail/?',
            fields: [
                {
                    name: 'article_title',
                    mapping: 'article_title',
                    type: 'string'
                },
                {
                    name: 'article_introtext',
                    mapping: 'article_introtext',
                    type: 'string'
                },
                {
                    name: 'article_url',
                    mapping: 'article_url',
                    type: 'string'
                }
            ]
        }, cfg));
    }
});

// instantiative Stores for next use
var activeUsersStore = new activeUsersStore();
var inactiveUsersStore = new inactiveUsersStore();
var userRecordsStore = new userRecordsStore();
var articlePointStore = new articlePointStore();
