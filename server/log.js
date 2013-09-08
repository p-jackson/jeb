var logentries = require('node-logentries');

if (process.env.LOGENTRIES_TOKEN) {
   var l = logentries.logger({
      token: process.env.LOGENTRIES_TOKEN
   });

   exports.log = l.log;
   exports.error = l.error;
}
else {
   exports.log = console.log;
   exports.error = console.error;
}
