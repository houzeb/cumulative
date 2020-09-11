var connection = require('./config').connection;

connection.connect();

var  sql = 'SELECT * FROM userInfo';
//查
connection.query(sql,function (err, result) {
  if(err){
    console.log('[SELECT ERROR] - ',err.message);
    return;
  }

  console.log('--------------------------SELECT----------------------------');
  console.log(result);
  console.log('------------------------------------------------------------\n\n');
});

connection.end();

/*
spring.datasource.url=jdbc:mysql://39.106.222.251:3306/snail?useUnicode\=true&characterEncoding\=utf-8
spring.datasource.username=root
spring.datasource.password=xiesu
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
*/
