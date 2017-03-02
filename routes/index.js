var express = require('express');
var crypto = require('crypto');
User = require('../models/user');
Post = require('../models/post');
Label = require('../models/label');
Talkline = require('../models/talkline');
var app = express();
var router = express.Router();

//var app = express.app();
//middleware

function checkLogin(req, res, next) {
    if (!req.sesssion.user) {
        req.flash('error', '未登录');
        res.redirect('/login');
    }
    next();
}
function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', "已登录");
        res.redirect('back')
    }
    next();
}
/* GET home page. */
router.get('/', function (req, res, next) {
   /* Post.get(null,function (err,posts) {
        if(err){
            post = [];
        }
        res.render('index',{
            title:'index',
            user:req.session.user,
            posts:posts,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    });*/
});
//register router
//router.get('/reg',checkNotLogin);
router.get('/reg', function (req, res, next) {
    res.render('reg', {
        title: "Register",
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});
//router.post('/reg',checkNotLogin);
router.post('/reg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    //检验用户两次输入密码是否一致
    if (password_re != password) {
        req.flash('error', '两次输入的密码不一致');
        return res.redirect('/reg');
    }
    //生成密码的md5值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: req.body.name,
        password: password,
        email: req.body.email
    });
    User.get(newUser.name, function (err, user) {
        if (user) {
            req.flash('error', '用户已经存在！');
            return res.redirect('/reg');//用户存在则返回注册页
        }

        //如果不存在则新增用户
        newUser.save(
            function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = user;//user information 存入session
                req.flash('success', '注册成功！');
                res.redirect('/');//注册成功后返回主页
            });
    });
});

//login router
//router.get('/login', checkLogin);
router.get('/login', function (req, res, next) {
    res.render('login', {
        title: 'login',
        user: req.session.user,
        userName: req.flash('userName').toString(),
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
});
//router.post('/login', checkLogin);
router.post('/login', function (req, res) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.get(req.body.name, function (err, user) {
        if (!user) {
            req.flash('error', 'user is not define!');
            return res.redirect('/login');//turn on login page
        }
        //password
        if (user.password != password) {
            req.flash('error', 'password wrong!');
            return res.redirect('/login');
        }
        //if username and password was right, information store session
        req.session.user = user;
        req.flash('userName', user.name.toString());
        req.flash('success', '登录成功');
        res.redirect('/')
    })
})

router.get('/post', function (req, res, next) {
    res.render('post',{
        title: "Post",
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});
router.post('/post',function (req,res) {
        /*var post = new Post(req.body.title,req.body.creationTime,req.body.abstract,req.body.label,req.body.author,req.body.body);
        post.save(function (err) {
        if(err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success','succesfully');
        res.redirect('/');
    });*/
        res.redirect('/'+req.body.title);
})
//router.get('/logout',checkLogin);
router.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功！');
    res.redirect('/');
});

//blog
router.get('/blogList',function (req,res) {
    //res.writeHead(200,{'Content-Type':'application/json'});
    Post.getAll(function(err,data){
        if(err){
            console.log(err);
        }
        data.map(function (item) {
            delete item.body;
        })
        res.json(data);
    })
});
//
router.post('/ntl',function (req,res) {
    var talkline = new Talkline(req.body.data);

    talkline.save(function (err) {
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        console.log(req.body.data);
        req.flash('success','succesfully');
    });
});
//
router.get('/ntl',function (req,res) {
    Talkline.getAll(function(err,data){
        if(err){
            return res.rediract('/');
        }
        res.json(data);
    })
});
router.post('/addblog',function (req,res) {
    var post = new Post(req.body.blog);
     post.save(function (err) {
     if(err) {
     req.flash('error', err);
     return res.redirect('/');
     }
     req.flash('success','succesfully');
     });
});

router.post('/addlabel',function (req,res) {
    var label = new Label(req.body.label);
    label.save(function (err) {
        if(err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success','succesfully');
    });
});

router.get('/getlabel',function (req,res) {
    Label.getAll(function(err,data){
        if(err){
            console.log(err);
            return res.rediract('/');
        }
        res.json(data);
    })
});

router.get('/blog/:id',function (req,res) {
    Post.getOne(req.params.id, function (err, data) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        res.json(data);
    });
})

router.get('/delblg/:id',function(req,res){
    console.log("get:::",req.params.id);
    Post.remove(req.params.id, function (err) {
        if (err) {
            res.json({sucess:false});
            return res.redirect(null);
        }
        res.json({sucess:true});
    });
})
router.post('/editblog/:id',function(req,res){
    console.log(req.body.blog);
    Post.update(req.params.id,req.body.blog, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("success!");
    });
})

router.get('/delTlkln/:id',function(req,res){
    console.log(req.params.id);
    Talkline.remove(req.params.id, function (err) {
        if (err) {
            res.json({sucess:false});
        }
        res.json({sucess:true});
    });
})

module.exports = router;
