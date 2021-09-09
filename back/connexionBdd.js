//import du package mysql
const mysql = require('mysql');
//import .env
require('dotenv').config()

// Connexion à MYSQL
const bdd = mysql.createConnection({
  host: process.env.BDD_HOST,
  user: process.env.BDD_USER,
  password: process.env.BDD_PASS,
  database: process.env.BDD_DATABASE,
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