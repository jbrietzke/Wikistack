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
  }, {
    hooks: {
      generateUrlTitle : function (title) {
        if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
          page.urlTitle = title.replace(/\s+/g, '_').replace(/\W/g, '');
        } else {
    // Generates random 5 letter string
          page.urlTitle = Math.random().toString(36).substring(2, 7);
        }
      }
    }
  });

  // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.
  page.save().then(function(){
    res.redirect('/')
  }).catch(err);
  // -> after save -> res.redirect('/');
});

router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.post('/', function(req, res, next) {
  res.json(req.body);
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

module.exports = router;

