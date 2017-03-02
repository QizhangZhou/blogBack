/**
 * Created by Administrator on 2/22/2017.
 */
var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

//store the infomation of user
User.prototype.save = function (callback) {
    //user document
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    };

//open database
    mongodb.open(function (err, db) {
        if (err) {
            console.log(err);
            return callback(err);//return err information
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //insert user information
            collection.insert(user,{safe:true},function (err,user) {
                mongodb.close();//close db
                callback(null,user[0]);//successfully!err is null
            })
        });
    });
};

User.get = function (name,callback){
    //open db
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);//error, callback err information
        }
        //read users collection
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();//close db
                return callback(err);//return err infomation
            }
            //search document
            collection.findOne({
                name:name
            },function(err,user){
                mongodb.close();
                if(user){
                    return callback(null,user);
                }
                callback(err);
            });
        });
    });
};