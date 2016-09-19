/**
 * Created by Administrator on 2016/9/1.
 */
var express = require("express");
var router = express.Router();

//创建标签列表路由
router.get("/",function(req,res){
    res.render("admin/tag_list")
})

//创建标签添加路由
router.get("/add" , function(req,res){
    res.render("admin/tag_add")
})

//创建标签修改路由
router.get("/edit" , function(req,res){
    res.render("admin/tag_edit")
})
module.exports = router;