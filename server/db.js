var mongoose = require('mongoose');

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

exports.connect = function(callback) {
   mongoose.connect(mongoUrl);

   var db = mongoose.connection;
   db.on('error', callback);
   db.once('open', function() { callback() });
}

exports.mongoose = mongoose;
