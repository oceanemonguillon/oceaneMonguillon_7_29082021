const mysql = require('mysql');

// Connexion à MYSQL
const bdd = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bddGroupomania'
});

//verification
connection.connect ((err) => {
    if (err) throw err;
    console.log ('Connecté!');
  });

//exportation bdd
module.exports = bdd;