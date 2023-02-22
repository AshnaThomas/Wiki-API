const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title:String,
  content:String
});

const Article = mongoose.model("Article",articleSchema);

/////////////////////////////Request for All Articles///////////////////////////

app.route("/articles")
.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }
    else{
      res.send(err);
    }
  });
})
.post(function(req,res){

  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added new article");
    }
    else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Articles deleted successfully");
    }
    else{
      res.send(err);
    }
  });
});

/////////////////////////////Request for a specific Article///////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(!err){
      res.send(foundArticle);
    }
    else{
      res.send("Article not found!");
    }
  });
})

.put(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    function(err){
      if(!err){
        res.send("Successfully updated the article");
      }
    });
})

.patch(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("Successfully updated the article");
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(!err){
      res.send("Successfully delete the article");
    }
    else{
      res.send(err);
    }
  });
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
