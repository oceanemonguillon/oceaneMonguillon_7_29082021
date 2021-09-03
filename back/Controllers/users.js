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
        let signupQuery = "INSERT INTO users VALUES (NULL,'" + userInformations.pseudo + "','" + hash + "','" + userInformations.email + "','"+imageUrl+"',NULL)";
        
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
  let loginQuery = "SELECT * FROM users WHERE email = '" + req.body.email + "'";

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


//Fonction qui permet de recuperer les infos d'un utilisateur
exports.getOneUser = (req, res, next) => {
    //recuperation des infos correspondant à l'id
    let getOneUserQuery = 'SELECT email, picture_url FROM users WHERE id = '+ bdd.escape(req.params.id);
    //retourne email et photo de l'utilisateur
    bdd.query(getOneUserQuery, function (err, result) {
      if (err) throw err;
      else {
        if(result.length > 0) {
          res.status(200).json({
              email: result[0].email,
              pictureUrl: result[0].picture_url,
            })
          }
        else {res.status(401).json({ error: "L'utilisateur n'a pas été trouvé !" });} //si erreur: message
      }
    })
  }
  
  
//Fonction qui permet la modification des infos utilisateur
exports.modifyUser = (req, res, next) => {
    //recuperation de l'url de l'image
    const pictureUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const pictureQuery = "SELECT picture_url FROM users WHERE id = "+ req.params.id;
    //si erreur: message, sinon on continue
    bdd.query(pictureQuery, function (err, result) {
      if (err) {res.status(400).json({ error : err.code });}
      else {
        //modification de l'image avec suppression de l'ancienne photo
        const oldPictureUrl = result[0].picture_url.split('/images/')[1];
        const modifyPictureQuery = "UPDATE users SET picture_url = '"+pictureUrl+"' WHERE id = "+ req.params.id;
        bdd.query(modifyPictureQuery, function (err, result) {
          if (err) {res.status(400).json({ error : err.code });}
          else {
            fs.unlink(`images/${oldPictureUrl}`, () => {res.status(200).json({ message: 'Votre photo à été modifiée !'});})
          }
        })
      }
    })
  }
  
  
//Fonction qui permet d'effacer un utilisateur de la bdd
exports.deleteUser = (req, res, next) => {
    //Recuperation de l'url de l'image dans la bdd
    const deletePictureQuery = "SELECT picture_url FROM users WHERE id = "+ req.params.id;
    //suppression de l'image correspondante dans le dossier images
    bdd.query(deletePictureQuery, function (err, result) {
      if (err) {res.status(400).json({ error : err.code });}
      else {
        const filename = result[0].picture_url.split('/images')[1];
        fs.unlink(`images/${filename}`, () => { //suppression de l'utilisateur complet
          let deleteQuery = "DELETE FROM users WHERE id = " + req.params.id;
            bdd.query(deleteQuery, function (err, result) {
              if (err) {res.status(400).json({ error : err.code });}
              else {res.status(200).json({ message: 'Votre compte utilisateur à été supprimé !'});}
          })
        })
      }
    })
  }