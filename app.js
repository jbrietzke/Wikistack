var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var swig = require('swig');
var models = require('./models');
var wikiRouter = require('./routes/wiki');


app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({cache: false});

// Standard logger
app.use(function(req,res,next){
  console.log(req);
  next();
});

app.use('/wiki',wikiRouter);


app.use(express.static('public'));

app.get('/', function(req,res, next){
  res.render('index', {});
});

models.User.sync({ force: true })
.then(function () {
    return models.Page.sync({ force: true });
})
.then(function () {
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);

