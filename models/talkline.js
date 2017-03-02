/**
 * Created by Administrator on 2/27/2017.
 */
var mongodb = require('./db');
var ObjectId = require('mongodb').ObjectID;

var Talkline = function (talkline){
    this.talkline = talkline;
}

module.exports = Talkline;

Talkline.prototype.save = function (callback) {

    var date = new Date();
    //fomat date
    var time = {
        date:date,
        year:date.getFullYear()+"-"+(date.getMonth()+1),
        month:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
        day: date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"-"+date.getHours()+"-"+date.getMinutes()
    };
    var Talkline = {
        Talkline:this.talkline,
        time:time
    }

    mongodb.open(function (err,db) {
        if(err) {
            return callback(err);
        }
        mongodb.collection('Talklines',function (err,collection) {
            if(err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(Talkline,{safe:true},function () {
                mongodb.close();
                return callback(null);
            })
        })

    })
}

Talkline.getAll = function (callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        mongodb.collection('Talklines',function(err,collection){
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

//删除talkline
Talkline.remove = function(id, callback) {
//打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('Talklines', function (err, collection) {
            if (err) {
                console.log(err);
                mongodb.close();
                return callback(err);
            }
            console.log("this id is:",id);
            collection.remove({"_id": ObjectId(id)}, function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};