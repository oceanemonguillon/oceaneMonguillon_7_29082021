//import du package Express 
const express = require("express");
//création du router
const router = express.Router();
//import de la page auth des controllers
const userCtrl = require("../controllers/users");
//Import du middleware de gestion des images (multer-config)
const multer = require('../middleware/multer-config');
//Import du middleware de sécurisation des routes (auth)
const auth = require('../middleware/auth');



//fonction permettant de s'inscire sur l'app
router.post('/signup', multer, userCtrl.signup);
//fonction permettant de se connecter sur l'app
router.post('/login', userCtrl.login);
//fonction permettant de recuperer les infos d'un utilisateur
router.get('/:id', auth, userCtrl.getOneUser);
//fonction permettant de modifier l'utilisateur
router.put('/:id', auth, multer, userCtrl.modifyUser);
//fonction permettant de supprimer un utilisateur
router.delete('/:id', auth, userCtrl.deleteUser);


//Export du router
module.exports = router;
