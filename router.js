var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/' , function (req, res) {
    res.render('index.html',{
        user: req.session.user
    })
    console.log(req.session.user)
})

//登陆页面
router.get('/login' , function (req, res) {
    res.render('login.html')
})

router.post('/login' , function (req, res) {
    var body = req.body
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    },function (err,user) {
        if (err) {
            return res.status(500).json({
                err_code:500,
                message: err.message
            })
        }
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            })
        }
        req.session.user = user
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})

//注册页面
router.get('/register' , function (req, res) {
    res.render('register.html')
})

router.post('/register' , function (req, res) {
    var body = req.body
    User.findOne({
        $or: [
            {
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: '服务端错误'
            })
        }
        //console.log(data)
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: 'email or nickname already exists'
            })
            return res.send('wwww')
        }

        body.password = md5(md5(body.password))

        new User(body).save(function (err, user) {
            if (err) {
                return res.status(200).json({
                    err_code: 500,
                    message: 'Internal error.'
                })
            }

            req.session.user = user
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })
    })
})

//退出登陆状态
router.get('/logout', function (req ,res) {
    req.session.user = null;
    // 重定向网页
    res.redirect('/')
})

//评论查找设置
router.get('/topics/123', function (req,res){
    res.render('./topic/show.html', {
        user: req.session.user
    })
})

router.post('/topics/123', function (req,res){

})


//基本信息
router.get('/settings/profile' ,function (req,res){
        res.render('./settings/profile.html', {
                user: req.session.user
        })
})

//账号设置
router.get('/settings/admin' ,function (req,res){
    res.render('./settings/admin.html', {
        user: req.session.user
    })
})

//发送
router.get('/topics/new' ,function (req,res){
    res.render('./topic/new.html', {
        user: req.session.user
    })
})
module.exports = router
