var express = require('express');
var router = express.Router();
// //连接数据库
var MongoClient = require("mongodb").MongoClient;
var DB_Url = "mongodb://192.168.0.217:27017/blog";
var ObjectId = require("mongodb").ObjectID;
/* GET home page. */
router.get('/', function(req, res, next) {
  MongoClient.connect(DB_Url,function(err,db){
    if(err){
      res.send(err);
      return;
    }
    var c = db.collection("article");
    c.find({"submit":"publish"}).toArray(function(err,docs){
      if(err){
        res.send(err);
        return;
      }
      console.log(docs);
      res.render('home/index', {data:docs });
    })
  })

});

module.exports = router;
