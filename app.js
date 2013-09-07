var express = require('express');
var less = require('less-middleware');
var os = require('os');
var mongoose = require('mongoose');
var logentries = require('node-logentries');

if (process.env.LOGENTRIES_TOKEN)
   var log = logentries.logger({
      token: process.env.LOGENTRIES_TOKEN
   }).info;
else
   var log = console.log;


if (process.env.VCAP_SERVICES) {
   var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
   var mongoOptions = vcap_services['mongodb-1.8'][0]['credentials'];
   log(mongoOptions);
}
else {
   var mongoOptions = {
      hostname: 'localhost',
      port: 27017,
      username: '',
      password: '',
      name: '',
      db: 'db'
   };
}

function generateMongoUrl(obj) {
   if (obj.username && obj.password)
      return 'mongodb://' + obj.username + ':' + obj.password + '@' + obj.hostname + ':' + obj.port + '/' + obj.db;
   else
      return 'mongodb://' + obj.hostname + ':' + obj.port + '/' + obj.db;
}


var mongoUrl = generateMongoUrl(mongoOptions);
mongoose.connect(mongoUrl);

var bookSchema = mongoose.Schema({
   title: String,
   author: String   
});
var Book = mongoose.model('Book', bookSchema);

var app = express();


var sendIndex = function(req, res) {
   res.sendfile(__dirname + '/public/index.html');
};

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
app.get('/add', sendIndex);
app.get('/search', sendIndex);

app.use(express.favicon());


app.use(express.logger('dev'));

app.get('/books', function(req, res) {
   if (!req.query || !req.query.q)
      var q = Book.find();
   else {
      var re = new RegExp(req.query.q, 'i');
      var q = Book.find({
         $or: [
            { title: re },
            { author: re }
         ]
      });
   }

   q.exec(function(err, docs) {
      if (err)
         log(err);
      else {
         res.json(docs);
      }
   });
});

app.get('/books/:index', function(req, res) {
   Book.findById(req.params.index).exec(function(err, book) {
      if (err) {
         res.statusCode = 404;
         res.json('Book not found');
      }
      else
         res.json(book.toObject());
   });
});

app.post('/books', function(req, res) {
   var b = new Book({
      title: req.body.title,
      author: req.body.author
   });

   b.save(function(err, book) {
      if (err) {
         log('failed');
      }
      else {
         res.setHeader('Location', '/books/' + book.id);
         res.statusCode = 201;
         res.json(true);
      }
   });
});

app.delete('/books/:index', function(req, res) {
   Book.findByIdAndRemove(req.params.index, function(err, book) {
      if (err) {
         res.statusCode = 404;
         res.json('Book not found');
      }
      else
         res.json(true);
   });
});


function listen() {
   var port = process.env.VCAP_APP_PORT || 3000;
   var host = (process.env.VCAP_APP_HOST || 'localhost');
   app.listen(port, host);
   log('Listening on port ' + port);
}


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
   log('Connected to mongo');
   listen();
});
