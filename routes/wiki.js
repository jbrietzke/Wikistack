var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.post('/', function(req, res, next) {
  // Find or create INSERTS in database, thus no need to save
  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  })
  // .spread can be used to break up arguments
  /*
  .spread(function(foundUser, 2ndArg){
      title: req.body.title,
      content: req.body.content,
      status: req.body.status
  })
  */
  .then(function(values){
    var user = values[0];
    var page = Page.build({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      tags: req.body.tags.split(' ')
    });
    return page.save().then(function(page){
      return page.setAuthor(user);
    });
  })
  .then(function(page){
    res.redirect(page.getRoutes);
  })
  .catch(next);
});


router.get('/search', function(req,res,next){
  var searchTerms = req.query.searchTerms;
  if(searchTerms){
    var searchTermsArr = searchTerms.split(' ');
    console.log("Search terms are: ", searchTermsArr);
    Page.findByTag(searchTermsArr)
    .then(function (pages){
      res.render('search', {resultPages: pages});
    })
  }else{
    res.render('search', {resultPages: null});
  }
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
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
    var displayPage = foundPage;
    displayPage.findSimilar()
    .then(function(similarPages){
      res.render('wikipage', {Page: displayPage, 
                              SimilarPages: similarPages});
    })
  })
  .catch(next);
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

