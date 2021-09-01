//import du package bcrypt pour hasher le mdp
const bcrypt = require('bcrypt');
//import du package jxt pour avoir un token secure
const jwt = require('jsonwebtoken');
//import du fichier base de données
const bdd = require('../connexionBdd');
//import du package filesystem (gestion de fichiers)
const fs = require('fs');
// regex pour mdp fort (min 8car: 1 min, 1 maj, 1 car spécial, et 1 num)
const Regexmdp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!\?@\.#\$%\^&\*])(?=.{8,})");



//Fonction qui permet de créer un compte
exports.signup = (req, res, next) => {
    //Récupère les infos du formulaire,
    const userInformations = JSON.parse(req.body.user);
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    if (Regexmdp.test(userInformations.password)) { //Si regex respecté
      bcrypt.hash(userInformations.password, 10) //mdp hashé 10x
      .then((hash) => { //Requête d'insertion des données dans la bdd
        let signupQuery = "INSERT INTO users VALUES (NULL,'" + userInformations.email + "','" + hash + "','" + userInformations.pseudo + "','"+imageUrl+"')";
        
        bdd.query(signupQuery, function (err, result) { //vérifie que l'utilisateur n'existe pas déjà
          if (!err) {
            res.status(201).json({ message: "Votre compte utilisateur à été créé !" })
          }
          else if (err.code==='ER_DUP_ENTRY') {
            res.status(401).json({ error: "L'utilisateur ou le pseudo existe déjà essayez autre chose!" })
          }
          else throw err;     
          });
      })
      .catch(error => res.status(500).json({ error }));
    }

    else {
      res.status(400).json({error: "Le mot de passe ne respecte pas les critères!"});
    }
}


//fonction qui permet de se connecter a l'application
exports.login = (req, res, next) => {
  //Requête de séléction des données correspondantes à l'adresse email entrée
  let loginQuery = "SELECT * FROM users where email = '" + req.body.email + "'";

  bdd.query(loginQuery, function (err, result) { //Vérifie que l'utilisateur existe bien 
    if (err) throw err;
    else {
      if(result.length > 0) {
        bcrypt.compare(req.body.password, result[0].password) //compare le mot de passe entré et le mot de passe dans la bdd
        .then((valid) => {
          if (!valid) {return res.status(401).json({ error: 'Le mot de passe est incorrect !' });}
          else {res.status(200).json({ //Retourne l'id de l'utilisateur, le pseudo et le Token de celui-ci
              id: result[0].id,
              pseudo: result[0].pseudo,
              token: jwt.sign({ userId: result[0].id },process.env.TOKEN,{ expiresIn: '24h' })
          });}
        })
        .catch(error => res.status(500).json({ error }));
      }
      else {res.status(401).json({ error: "l'utilisateur n'existe pas !" });}
    }
});
}

