// 导入MySQL模块
var mysql = require('mysql');

var db = mysql.createConnection({
    host:      '127.0.0.1',     // database host
    user:       'root',         // your database username
    password:   '123456',         // your database password
    port:       3306,         // default MySQL port
    database:       'ehrdb'         // your database name
});
db.connect();

module.exports = db