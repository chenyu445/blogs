/**
 * Created by Administrator on 2016/9/1.
 */
var express = require("express");
var router =express.Router();

//连接数据库
var MongoClient = require("mongodb").MongoClient;
var DB_Url = "mongodb://192.168.0.217:27017/blog";
var ObjectId = require("mongodb").ObjectId;
//打开文章列表
router.get("/" , function(req,res){
    MongoClient.connect(DB_Url,function(err,db){
        if(err){
            res.send(err);
            return;
        }

        var c = db.collection("article");
        c.find().toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            // var status = "";
            // docs.forEach(function(item){
            //     if("publish"== item.submit){
            //         item.submit = "已发布"
            //     }else{
            //         item.submit  = "已保存"
            //     }
            // })
            res.render("admin/article_list" , {data:docs   })
        })
    })

})
//文章编辑页面
router.get('/edit' , function(req,res){
    var id = req.query.id;
    //console.log(id);
    MongoClient.connect(DB_Url,function(err,db){
        if(err){
            res.send(err);
            return;
        }



        var c = db.collection("article");
        // console.log(c)
        //console.log(c.find({_id:ObjectId(id)}));
        // c.find({_id:ObjectId(id)}).toArray(function(err,docs){
        //     if(err){
        //         res.send(err);
        //         return;
        //     }
        //     res.render("/admin/article_edit" , {data:docs[0]})
        // })
        c.find({_id : ObjectId(id)}).toArray(function(err,docs){
            if (err) {
                res.send(err);
                return;
            }
            var list = db.collection("cats");
            list.find().toArray(function(err,result){
                if(err){
                    res.send(err);
                    return;
                }
                res.render('admin/article_edit',{data : docs[0],data1:result }); //此处，只需要数组中的第一个对象
            })

        });
    })
})
//文章编辑提交路由
router.post("/edit" , function(req,res){
    var id = req.body.id,
        title = req.body.title,
        cats = req.body.cats,
        summary = req.body.summary,
        content = req.body.content,
        time = new Date(),
        submit = req.body.submit,
        article = {
            "cats":cats,"title":title,"summary":summary,"content":content,"time":time,"submit":submit
        };
   // console.log(id);
       // console.log(article);
    MongoClient.connect(DB_Url,function(err , db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection("article");
        c.update({_id:ObjectId(id)},{$set:article },function(err , result){
            if(err){
                res.send(err);
                return;
            }
            res.send("文章更新成功<a href='/admin/article'>返回文章列表</a>")
        });
    })
})
//打开文章添加页面
router.get("/add" , function(req,res){
    MongoClient.connect(DB_Url,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection("cats");
        c.find().toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            res.render("admin/article_add" , {data:docs})
        })
    })

})
//文章添加提交
router.post("/add" , function(req,res){
    var cats = req.body.cats,
        title = req.body.title,
        summary = req.body.summary,
        content = req.body.content,
        submit = req.body.submit,
        time = new Date(),
        article = {
            "cats":cats,
            "title":title,
            "summary":summary,
            "content":content,
            "time":time,
            "submit":submit
        };
        // console.log(1);
        // console.log(article);
    MongoClient.connect(DB_Url,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection("article");
        c.insert(article ,function(err,result){
            if(err){
                res.send(err);
                return;
            }
            res.send("文章添加成功，<a href = '/admin/article'>返回文章列表</a>");
        })
    })

})
//文章删除页面路由
router.get("/delete" ,function(req,res){
    var id = req.query.id;
    MongoClient.connect(DB_Url,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection("article");
        c.remove({_id:ObjectId(id)},function(err,result){
            if(err){
                res.send(err)
            }
            res.redirect("/admin/article")
        })
    })
})

module.exports = router; //导出路由