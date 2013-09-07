var express = require('express');
var less = require('less-middleware');
var os = require('os');
var mongo = require('mongodb');

if (process.env.VCAP_SERVICES) {
   var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
   var mongoOptions = evn['mongodb-1.8'][0]['credentials'];
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

function matchStr(query, str) {
   var q = query.toLowerCase();
   var s = str.toLowerCase();
   return s.indexOf(q) != -1;
}

function filterBooks(query) {
   var result = [];
   var matches = matchStr.bind(undefined, query);
   for (var i = 0; i < books.length; ++i) {
      var b = books[i];
      if (matches(b.title))
         result.push(b);
      else if(matches(b.author))
         result.push(b);
   }
   return result;
}

var mongoUrl = generateMongoUrl(mongoOptions);

var app = express();

var books = [
   { title: 'Emma', author: 'Jane Austin' },
   { title: 'Pride and Prejudice', author: 'Jane Austin' },
   { title: 'Bleak House', author: 'Charles Dickens' }
];

function invalidBookIndex(req, res) {
   if (books.length <= req.params.index || req.params.index < 0) {
      res.statusCode = 404;
      res.json('Book not found');
      return true;
   }

   return false;
}

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
      res.json(books);
   else
      res.json(filterBooks(req.query.q));
});

app.get('/books/:index', function(req, res) {
   if (invalidBookIndex(req, res))
      return;

   res.json(books[req.params.index]);
});

app.post('/books', function(req, res) {
   books.push({
      title: req.body.title,
      author: req.body.author
   });

   res.setHeader('Location', '/books/' + (books.length - 1));
   res.statusCode = 201;
   res.json(true);
});

app.delete('/books/:index', function(req, res) {
   if (invalidBookIndex(req, res))
      return;

   books.splice(req.params.index, 1);
   res.json(true);
});



var port = process.env.VCAP_APP_PORT || 3000;
var host = (process.env.VCAP_APP_HOST || 'localhost');
app.listen(port, host);
console.log('Listening on port ' + port);
