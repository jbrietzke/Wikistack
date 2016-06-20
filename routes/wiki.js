var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.post('/', function(req, res, next) {
  // STUDENT ASSIGNMENT:
  // add definitions for `title` and `content`
  var user = User.findOrCreate({
    where: {
      name : req.body.name,
      email : req.body.email
    }
  })
  .then(function(values){
    var user = values[0];

    var page = Page.build({
    title: req.body.title,
    content: req.body.content
    });
    // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.

    return page.save().then(function(page){
      return page.setAuthor(user);
    });
  })
  .then(function(page){
    res.redirect(page.getRoutes);
  })
  // -> after save -> res.redirect('/');
  .catch(function(err){
    console.error(err);
  });
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/users/:id', function(req, res, next){
  var id = req.params.id;
  console.log("users/id accessed!!!!!!!------------------", '\n\n' + id);
  models.Page.findAll({
    where : {
      authorId : id
    }
  })
  .then(function(allArticles){
    console.log("All articles is ", allArticles);
    res.render('articlesID', {Articles : allArticles})
  })
});

router.get('/users', function(req, res, next){
  models.User.findAll({})
  .then(function(allUsers){
    res.render('users', {Users : allUsers})
  })
});

router.get('/:searchedTitle', function(req, res, next) {
  var searchedTitle = req.params.searchedTitle;
  // Create promise
  models.Page.findOne({
    where: {
      urlTitle: searchedTitle
    }
  })
  .then(function(foundPage){
    console.log("FoundPage Object is", foundPage);
    res.render('wikipage', {Page: foundPage})
  })
  .catch(next);
});

router.get('/', function(req, res, result){
  models.Page.findAll({})
  .then(function(allPages){
    res.render('index', {Pages : allPages});
  })
});





//Default error handler
router.use(function(err,req,res,next){
  console.error(err);
  res.status(500).end();
});


module.exports = router;

