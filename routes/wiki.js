var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.post('/', function(req, res, next) {
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
    return page.save().then(function(page){
      return page.setAuthor(user);
    });
  })
  .then(function(page){
    res.redirect(page.getRoutes);
  });
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/users/:id', function(req, res, next){
  var id = req.params.id;
  var p1 = Page.findAll({
    where: {
      authorId: id
    }
  });
  var p2 = User.findOne({
    where: {
      id: id
    }
  });
  Promise.all([p1,p2]).then(function(data){
    res.render('user', {Articles: data[0], User: data[1]});
  });
});

router.get('/users', function(req, res, next){
  User.findAll({})
  .then(function(allUsers){
    res.render('users', {Users : allUsers});
  });
});

router.get('/:searchedTitle', function(req, res, next) {
  var searchedTitle = req.params.searchedTitle;
  Page.findOne({
    where: {
      urlTitle: searchedTitle
    },
    include: [{model: User, as: 'author'}]
  })
  .then(function(foundPage){
    console.log("waffles",foundPage);
    res.render('wikipage', {Page: foundPage});
  })
});

router.get('/', function(req, res, next){
  Page.findAll({})
  .then(function(allPages){
    res.render('index', {Pages : allPages});
  });
});



//Default error handler
router.use(function(err,req,res,next){
  console.error(err);
  res.status(500).end();
});


module.exports = router;

