var express = require('express');
// If app.listen creates the server, then what is express() returning?
var app = express();
var bodyParser = require('body-parser');
var swig = require('swig');
var models = require('./models');
var wikiRouter = require('./routes/wiki');
var usersRouter = require('./routes/users');
var Promise = require('bluebird');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({cache: false});

models.User.sync({ force: true })
.then(function () {
    return models.Page.sync({ force: true });
})
.then(function () {
		/* Once database has synced successfully, then
		we CREATE a server that LISTENS with app.listen */
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(function(err){
	console.error(err);
});

// ROUTING BEGINS
// Standard logger
app.use(function(req,res,next){
  console.log(req);
  next();
});

app.use('/wiki',wikiRouter);
app.use('/users',usersRouter);

app.use(express.static('public'));

app.get('/', function(req,res, next){
  res.render('index', {});
});