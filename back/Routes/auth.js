//import du package Express 
const express   = require("express");
//création du router
const router    = express.Router();
//import de la page auth des controllers
const authCtrl  = require("../controllers/auth.js");


//fonction permettant de s'inscrire sur l'app 
router.post("/signup", authCtrl.signup); 
//fonction permettant de se connecter sur l'app
router.post("/login", authCtrl.login); 


//Export du router
module.exports = router;
