var MongoClient = require('mongodb').MongoClient;
var url = require('./config').url;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log('数据库已创建',db);
  db.close();
})
