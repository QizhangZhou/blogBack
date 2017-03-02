/**
 * Created by Administrator on 2/28/2017.
 */
/**
 * Created by Administrator on 2/27/2017.
 */
var mongodb = require('./db');

var Label = function (Label){
    this.Label = Label;
}

module.exports = Label;

Label.prototype.save = function (callback) {

    var Label = {
        Label:this.Label
    }

    mongodb.open(function (err,db) {
        if(err) {
            return callback(err);
        }
        mongodb.collection('Labels',function (err,collection) {
            if(err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(Label,{safe:true},function () {
                mongodb.close();
                return callback(null);
            })
        })

    })
}

Label.getAll = function (callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        mongodb.collection('Labels',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find().sort({
                time:-1
            }).toArray(function (err,docs) {
                mongodb.close();
                if(err){
                    return callback(err);
                }

                return callback(null,docs);
            })
        })
    })
}