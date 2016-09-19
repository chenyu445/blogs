var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/home/index');
var posts = require('./routes/home/posts');
var admin =  require('./routes/admin/admin');
var cats =  require('./routes/admin/cats');
var article =  require('./routes/admin/article');
var tag =  require('./routes/admin/tag');
var users = require('./routes/admin/users');
//导入session模块
var session = require("express-session");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require("ejs").__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/admin')));
//调用session
app.use(session({
    secret:"blog",
    resave:false,
    saveUninitialized:true,
    cookie:{}
}));


app.use('/', routes);
app.use('/posts', posts);
app.use('/admin', CheckLogin);
app.use('/admin', admin);
// app.use('/admin/cats', CheckLogin);
app.use('/admin/cats', cats);
// app.use('/admin/article', CheckLogin);
app.use('/admin/article', article);
// app.use('/admin/tag', CheckLogin);
app.use('/admin/tag', tag);
// app.use('/admin/login', CheckLogin);
app.use('/users', users);

//设置登录开关
function CheckLogin(req,res,next){
    //判断用户是否已经登录，看session是否有登录的标志
    if(!req.session.isLogin){
        //如果没有登录，跳转登录页面
        res.redirect("/users/login");
    }
    //如果已经登录交给剩下的方法
    next();
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
