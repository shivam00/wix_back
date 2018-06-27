var mysql = require('mysql');
const Keys = require('./keys');
var con = mysql.createConnection({
	host: Keys.mysql.host,
	user: Keys.mysql.user,
    password: Keys.mysql.pass,
    database: Keys.mysql.db
  });
  
 module.exports = con; 