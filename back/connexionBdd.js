//import du package mysql
const mysql = require('mysql');

// Connexion à MYSQL
const bdd = mysql.createConnection({
  host: '192.168.64.2',
  user: 'oceane3',
  password: 'password',
  database: 'bddGroupomania',
  namedPlaceholders: true,
});

//verification du fonctionnement
bdd.connect((err) => {   
  if (err) {    
      console.log('erreur de connection',err);
      return;
  }
  console.log('Connecté a mysql');
});

//export bdd
module.exports = bdd;