/**
 * Created by Administrator on 2/22/2017.
 */
var settings = require('../setting'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
module.exports = new Db(settings.db,new Server(settings.host,27017,{}));
