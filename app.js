var express = require('express');
var less = require('less-middleware');
var os = require('os');

var db = require('./server/db');
var Book = require('./server/book').Book;
var logger = require('./server/log');
var api = require('./server/api');

var app = express();

app.engine('html', require('hogan-express'));
app.set('views', __dirname + '/public/js/views');
app.set('view engine', 'html');

function sendIndex(view, req, res) {
   return res.render('layout', {
      partials: { view: view }
   });
}

var tmpDir = os.tmpDir();

app.use(express.bodyParser());
app.use(express.query());

app.use(less({
   src: __dirname + '/public',
   dest: tmpDir,
   force: true
}));

app.use(express.static(__dirname + '/public'));
app.use(express.static(tmpDir));
app.get('/', sendIndex.bind(undefined, 'home'));
app.get('/home', sendIndex.bind(undefined, 'home'))
app.get('/add', sendIndex.bind(undefined, 'add'));
app.get('/search', sendIndex.bind(undefined, 'search'));
app.get('/book/*', sendIndex.bind(undefined, 'book'));

app.use(express.favicon());

app.use(express.logger('dev'));

api.setup(app);

function listen() {
   var port = process.env.VCAP_APP_PORT || 3000;
   var host = (process.env.VCAP_APP_HOST || undefined);
   app.listen(port, host);
   logger.log('Listening on port ' + port);
}

db.connect(function(err) {
   if (err)
      logger.error('Connection error: ', err);
   else {
      logger.log('Connected to mongo');
      listen();
   }
});
