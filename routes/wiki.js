var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.post('/', function(req, res, next) {
  // STUDENT ASSIGNMENT:
  // add definitions for `title` and `content`
  var page = Page.build({
    title: req.body.title,
    content: req.body.content
  });

  // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.
  page.save().then(function(page){
  // -> after save -> res.redirect('/');
    res.json(page);
  }).catch(function(err){
    console.error(err);
  });
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
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


//Default error handler
router.use(function(err,req,res,next){
  console.error(err);
  res.status(500).end();
});


module.exports = router;

