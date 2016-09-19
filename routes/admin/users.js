var express = require('express');
var router = express.Router();
//导入数据
var MongoClient = require("mongodb").MongoClient;
var DB_Url = "mongodb://192.168.0.217:27017/blog";
var ObjectId = require("mongodb").ObjectId;

/* GET users listing. */
router.use('/login',checkNotLogin);
router.get('/login', function(req, res, next) {

  res.render("admin/login");


});
router.post("/login" , function(req,res){
  var username = req.body.username;
  var pwd = req.body.pwd;
  MongoClient.connect(DB_Url,function(err,db){
    if(err){
      res.send(err);
      return;
    }
    var c = db.collection("users");
    c.find({"username":username,"pwd":pwd}).toArray(function(err,result){
      if(err){
        res.send(err);
        return;
      }
      console.log(result.length);
      if(result.length){
        //登陆成功，进入管理后台
        req.session.isLogin = true;
        res.redirect("/admin")
      }else{
        // 登录失败
        res.redirect("/users/login");
      }
    })
  })
})
//用户注销
router.get('/logout',function(req,res){
  //清除session，然后跳转
  req.session.isLogin = null;
  console.log(req.session.isLogin);
  res.send("用户已注销<a href='/'>返回主页</a>");
  // res.redirect('/admin');
});
//判断是否在线
function checkNotLogin(req,res,next){
  if(req.session.isLogin){
    res.redirect("/");
    // console.log(req.session.isLogin)
  }
  next();
}

module.exports = router;
