//import du package express
const express = require('express');
//création du router
const router = express.Router();
//Import du middleware de sécurisation des routes (auth)
const auth = require('../middleware/auth');

//import de la page posts des controllers
const postsCtrl = require('../controllers/posts');



//fonction permettant de creer un post
router.post('/', auth, postsCtrl.createPost);
//fonction permettant de recuperer tout les posts
router.get('/', auth, postsCtrl.getAllPosts);
//fonction permettant de recuperer un post
router.get('/:id', auth, postsCtrl.getOnePost);
//fonction permettant demodifier un post
router.put('/:id', auth, postsCtrl.modifyPost);
//fonction permettant de supprimer un post
router.delete('/:id', auth, postsCtrl.deletePost);
//fonction permettant de liker un post
router.post('/:id/like', auth, postsCtrl.likePost);
//fonction permettant de commenter un post
router.post('/:id/comment', auth, postsCtrl.commentPost);
//fonction permettant de recuperer un commentaire
router.get('/:id/comment', auth, postsCtrl.getComments);
//fonction permettant de supprimer un commentaire
router.delete('/:id/comment', auth, postsCtrl.deleteComment);



//Export du router
module.exports = router;