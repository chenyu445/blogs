/**
 * Created by Administrator on 2016/9/1.
 */
//引入express 创建路由
var express = require("express");
var router = express.Router();
//连接数据库
var MongoClient = require("mongodb").MongoClient;
var DB_Url = "mongodb://192.168.0.217:27017/blog";
var ObjectId = require("mongodb").ObjectId;

router.get("/",function(req,res){
    var id = req.query.id;
    MongoClient.connect(DB_Url,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c= db.collection("article");
        c.find({_id:ObjectId(id)}).toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            res.render("home/article" ,{data:docs[0]});
        })
    })
})

module.exports = router;