var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;



router.get('/:id', function(req, res, next){
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
  })
  .catch(next);
});

router.get('/', function(req, res, next){
  User.findAll({})
  .then(function(allUsers){
    res.render('users', {Users : allUsers});
  })
  .catch(next);
});

//Default error handler
router.use(function(err,req,res,next){
  console.error(err);
  res.status(500).end();
});


module.exports = router;
