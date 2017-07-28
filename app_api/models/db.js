var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
var dbURI = 'mongodb://localhost:27017/loc8r_data';
//var dbURI = 'mongodb://thongngo3301:14789632@ds155132.mlab.com:55132/loc8r_data';
if(process.env.NODE_ENV === 'production'){
  dbURI = process.env.MONGOLAB_URI;
};
mongoose.connect(dbURI,{
  useMongoClient: true
});
//var homeDB = mongoose.connection;
var homeDB = mongoose.createConnection(dbURI);

homeDB.on('connected',function(){
  console.log('mongoose connected to ' + dbURI);
});
homeDB.on('error',function(err){
  console.log('mongoose connection error : ' + err);
});
homeDB.on('disconnected',function(){
  console.log('mongoose disconnected');
});

var gracefulShutdown = function(msg, callback){
  mongoose.connection.close(function(){
    console.log('mongoose disconnected through ' + msg);
    callback();
  });
};

//Nodemon restarts
process.once('SIGUSR2',function(){
  gracefulShutdown('nodemon restart', function(){
    process.kill(process.pid,'SIGUSR2');
  });
});
//App termination
process.on('SIGINT',function(){
  gracefulShutdown('app termination',function(){
    process.exit(0);
  })
})
//Heroku app termination
process.on('SIGTERM',function(){
  gracefulShutdown('Heroku app termination',function(){
    process.exit(0);
  });
});

//Get models and schema
require('./locations.models');
require('./users.models');