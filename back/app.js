//import du package express
const express = require("express");
//import du chemin des fichiers images
const path = require("path");
//import du router d'authentification (auth.js)
const authRoutes = require("./routes/auth");
//import du router utilisateur (user.js)
const userRoutes = require("./routes/users");
//import du router de posts (posts.js)
const postRoutes = require("./routes/posts");


// Initialisation de l'app avec express
const app = express();


//Authorise la discussion entre plusieurs serveurs, les methodes définies et l'utilisation des headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});


//Fonction pour toutes requetes envoyées a images, on sert de manière statique le dossier images
app.use("/images", express.static(path.join(__dirname, "images")));

//Début des URL liés aux fichiers en question
app.use("/auth", authRoutes);
app.use("/profile", userRoutes);
app.use("/posts", postRoutes);


//Export de l'app express pour y avoir accès depuis les autres fichiers
module.exports = app;