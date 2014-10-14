var app = require('./server-config.js');

var port = process.env.PORT || 9000;
var db = process.env.MONGODB || 'mongodb://localhost/hnanalytics'
app.listen(port);
var mongoose = require('mongoose');
mongoose.connect(db);
var sync = require('./sync.js')
sync.syncData()
console.log('Badass Server now listening on port ' + port);