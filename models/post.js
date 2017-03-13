/**
 * Created by Administrator on 2/23/2017.
 */
var mongodb = require('./db');
var ObjectId = require('mongodb').ObjectID;

function Post(blog) {
    this.title = blog.title;
    this.creationTime = blog.creationTime;
    this.abstract = blog.abstract;
    this.body = blog.body;
    this.author = blog.author;
    this.label = blog.label;
}

module.exports = Post;

Post.prototype.save = function (callback) {
    /* var date = new Date();
     //fomat date
     var time = {
     date:date,
     year:date.getFullYear()+"-"+(date.getMonth()+1),
     month:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
     day: date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"-"+date.getHours()+"-"+date.getMinutes()
     };*/

    //store document
    var post = {
        title: this.title,
        creationTime: this.creationTime,
        abstract: this.abstract,
        body: this.body,
        author: this.author,
        label:this.label
    };

    //open db
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //read post collection
        db.collection('post', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(post, {
                safe: true
            }, function (err, post) {
                mongodb.close()
                callback(null);
            });
        });
    });
};

Post.getAll = function (callback) {

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //reader post collection
        db.collection('post', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //query
            collection.find().sort({
                time: -1
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};

Post.getOne = function (id, callback) {
//打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            console.log(err);
            return callback(err);
        }
//读取 posts 集合
        db.collection('post', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
//根据 query 对象查询文章
            collection.find({"_id": ObjectId(id)}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, docs);//成功！以数组形式返回查询的结果
            });
        });
    });
};

//删除一篇文章
Post.remove = function(id, callback) {
//打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
//读取 posts 集合
        db.collection('post', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
//根据用户名、日期和标题查找并删除一篇文章
            collection.remove({"_id": ObjectId(id)}, function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};
//更新一篇文章及其相关信息
Post.update = function(id,blog, callback) {
//打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            console.log(err);
            return callback(err);
        }
//读取 posts 集合
        db.collection('post', function (err, collection) {
            if (err) {
                console.log(err);
                mongodb.close();
                return callback(err);
            }
//更新文章内容
            console.log(blog);
            collection.update({"_id": ObjectId(id)},{
                $set: blog
            }, function (err, result) {
                mongodb.close();
                if (err) {
                    console.log(result);
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};