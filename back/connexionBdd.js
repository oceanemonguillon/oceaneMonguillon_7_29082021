//import du package mysql
const mysql = require('mysql');

// Connexion à MYSQL
const bdd = mysql.createConnection({
  host: '192.168.64.2',
  user: 'root',
  password: '',
  database: 'bddGroupomania'
});

//export bdd
module.exports = bdd;