/**
 * Created by Administrator on 2016/8/31.
 */
var express = require("express");
var router = express.Router();
//创建数据库连接
var MongoClient = require("mongodb").MongoClient;
var DB_Url = "mongodb://192.168.0.217:27017/blog";
var ObjectId = require("mongodb").ObjectId;
//设置分类首页列表路由
router.get("/", function(req,res , next){
    MongoClient.connect(DB_Url , function(err , db){
        if(err){
            res.send(err);
            return
        }
        var c = db.collection("cats");
        c.find().toArray(function(err , docs){
            if(err){
                res.send(err);
                return
            }
            res.render("admin/category_list" , {data:docs});
        })
    })

})
//设置增加分类路由
router.get("/add" , function(req,res,next){
    res.render("admin/category_add");
})
//增加分类的动作
router.post("/add",function(req,res){
    //获取表单提交数据
    var title = req.body.title;
    var sort = req.body.sort;
    //必要的验证 如是否重复
    //数据保存到数据库中
    MongoClient.connect(DB_Url,function(err,db){
        if (err) {
            res.send(err);
            return;
        };
        var c = db.collection("cats");
        c.insert({"title":title,"sort":sort} ,function(err,result){
            if(err){
                res.send(err);
                return;
            }else {
                res.send('添加分类成功 <a href="/admin/cats">查看列表</a>');
            }
        })
    })
})
//设置编辑分类路由
// router.get("/edit", function(req,res){
//     //获取查询字符串ID
//     var id = req.query.id;
//    // console.log(id);
//     //查询数据，获取对应文档的数据
//     MongoClient.connect(DB_Url,function(err,db){
//         if(err){
//             res.send(err);
//             return;
//         }
//         var c = db.collection("cats");
//         c.find({_id : ObjectId(id)}).toArray(function(err,docs){
//             if(err){
//                 res.send(err);
//                 return;
//             }
//             res.render("admin/category_edit" ,{data:docs[0]});//发送数组中第一个对象到编辑页面
//         })
//     })
//
// })
router.get('/edit',function(req,res){
    //获取查询字符串id
    var id = req.query.id;
    //需要查询数据库，获取该id对应的文档
    MongoClient.connect(DB_Url,function(err,db){
        if (err) {
            res.send(err);
            return;
        }
        //获取集合
        var c = db.collection('cats');
        c.find({_id : ObjectId(id)}).toArray(function(err,docs){
            if (err) {
                res.send(err);
                return;
            }
            res.render('admin/category_edit',{data : docs[0] }); //此处，只需要数组中的第一个对象
        });
    });


});
//更新分类列表
router.post("/edit" ,function(req,res){
    //获取表单数据
    var title = req.body.title;
    var sort =req.body.sort;
    var id = req.body.id;
    // 更新数据库
    MongoClient.connect(DB_Url,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection("cats");
        c.update({_id:ObjectId(id)},{$set:{"title":title,"sort":sort}},function(err,result){
            if (err) {
                res.send(err);
            } else {
                res.send('更新成功 <a href="/admin/cats">返回列表</a>');
            }
        })
    })
})
//设置删除分类路由
router.get("/delete" , function(req,res){
    //获取ID
    var id = req.query.id;
    //删除操作
    MongoClient.connect(DB_Url,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection("cats");
        c.remove({_id:ObjectId(id)},function(err,result){
            if(err){
                res.send(err);
                return;
            }
            res.redirect("/admin/cats")
        })
    })
})
module.exports = router;