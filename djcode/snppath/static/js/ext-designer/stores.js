// stores.js
/*
 *
 * File: stores.js
 * 
 * Stores Classes together for simpler user & Ext-designer independent
 *
 */

configStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function(cfg) {
        cfg = cfg || {};
        configStore.superclass.constructor.call(this, Ext.apply({
            storeId: 'configStore',
            url: 'config/',
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
                }
            ]
        }, cfg));
    }
});

activeLiveTrackingStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function(cfg) {
        cfg = cfg || {};
        activeLiveTrackingStore.superclass.constructor.call(this, Ext.apply({
            storeId: 'activeTrackRecords',
            sortField: 'last_location_time',
            sortDir: 'DESC',
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
                    dateFormat: 'Y-m-dTh:i:s'
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

inactiveLiveTrackingStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function(cfg) {
        cfg = cfg || {};
        inactiveLiveTrackingStore.superclass.constructor.call(this, Ext.apply({
            storeId: 'inactiveTrackRecords',
            sortField: 'last_location_time',
            sortDir: 'DESC',
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
                    dateFormat: 'Y-m-dTh:i:s'
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
            url: 'live_tracking/messages/?',
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
                    dateFormat: 'Y-m-dTh:i:s'
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
var configStore = new configStore();

var activeLiveTrackingStore = new activeLiveTrackingStore();
var inactiveLiveTrackingStore = new inactiveLiveTrackingStore();

var userRecordsStore = new userRecordsStore();
var articlePointStore = new articlePointStore();
