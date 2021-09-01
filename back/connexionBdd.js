//import du package mysql
const mysql = require('mysql');

// Connexion à MYSQL
const bdd = mysql.createConnection({
  host: '192.168.64.2',
  user: 'root',
  password: '',
  database: 'bddGroupomania'
});

//verification du fonctionnement
bdd.connect((err) => {   
    if (err) {    
        throw err;
    }
    console.log('Connecté a mysql');
});

//export bdd
module.exports = bdd;