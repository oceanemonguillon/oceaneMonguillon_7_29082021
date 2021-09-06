//import du fichier base de données
const bdd = require('../connexionBdd');
//import du package filesystem (gestion de fichiers)
const fs = require('fs');


//fonction permettant de créer un post
exports.createPost = (req, res, next) => {
    //insert les elements entrés dans la bdd
    const postQuery = `INSERT INTO posts VALUES (NULL,"${req.body.userId}","${req.body.title}","${req.body.text}","","${req.body.url}", NOW())`;
    bdd.query(postQuery, function (err, result) {
        if (!err) {res.status(201).json({ message: 'Post créé !' });} //message de réussite 
        else {res.status(400).json({ error: err.code });}       //message d'erreur
        });
}



//fonction permettant de recuperer tout les posts
exports.getAllPosts = (req, res, next) => {
    //recuperation des posts dans la bdd
    let getAllPostsQuery = "SELECT users.pseudo, users.picture_url, posts.title, posts.text, posts.id, TIMEDIFF(NOW(),posts.date) as date FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY `date` ASC";
    bdd.query(getAllPostsQuery, function (err, result) {
      if (err) throw err; //declare les erreurs
      else {
        if(result.length > 0) { //posts apparaissent tant qu'il y en a dans la bdd
          const Posts = [];
          for (let i = 0; i < result.length; i++) {
            Posts.push({
              pseudo: result[i].pseudo,
              picture: result[i].picture_url,
              title: result[i].title,
              text: result[i].text,
              id: result[i].id,
              date: result[i].date
            })
          }
          res.status(200).json(Posts);
        }
        else {res.status(200).json([]);}
      }
    })
}



//Fonction permettant de récuperer un seul post 
exports.getOnePost = (req, res, next) => {
    //recuperation du post correspondant a l'id
    let getOnePostQuery = `SELECT users.pseudo, users.picture_url, posts.title, posts.id, posts.text, TIMEDIFF(NOW(),Posts.date) as date FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.id =${req.params.id}`;
    bdd.query(getOnePostQuery, function (err, result) {
      if (err) throw err; //declare les erreurs
      else { //montre les post ciblé s'il existe
        if(result.length > 0) {
          let postInfo = {
              pseudo: result[0].pseudo,
              picture: result[0].picture_url,
              title: result[0].title,
              text: result[0].text,
              id: result[0].id,
              date: result[0].date
            };
          //récupère le nombre de like s'il y en a 
          let getLikesQuery = `SELECT users.pseudo as usersLike FROM users INNER JOIN likes ON likes.user_id = users.id WHERE likes.post_id =${req.params.id}`;
          bdd.query(getLikesQuery, function (err, result) {
            if (err) throw err; //declare les erreurs
            //tant qu'il y a des likes, la liste apparait
            else { let usersLike = [];
              for (let i = 0; i < result.length; i++) {
                usersLike.push(result[i].usersLike);
                }
              const usersLikeObject = {usersLike: usersLike};
              postInfo = {...postInfo, ...usersLikeObject};
              
              //récupère le nombre de dislike s'il y en a
              let getDislikesQuery = `SELECT users.pseudo as usersDislike FROM users INNER JOIN dislikes ON dislikes.user_id = users.id WHERE dislikes.post_id =${req.params.id}`;
              bdd.query(getDislikesQuery, function (err, result) {
                if (err) throw err; //declare les erreurs
                //tant qu'il y a des dislike, la liste apparait 
                else { let usersDislike = [];
                  for (let i = 0; i < result.length; i++) {
                    usersDislike.push(result[i].usersDislike);
                    }
                  const usersDislikeObject = {usersDislike: usersDislike};
                  postInfo = {...postInfo, ...usersDislikeObject};
                  res.status(200).json(postInfo);}
                  })
            }
          })
        }
        //le post recherché n'existe pas 
        else {res.status(401).json({ error: 'Pas de post trouvé !' });}
      }
    })
}



//Fonction de modification de l'objet post (requête PUT)
exports.modifyPost = (req, res, next) => {
    //modification des données existantes
    const putQuery = `UPDATE posts SET title = "${req.body.title}", text = "${req.body.text}" WHERE id = ${req.params.id}`;
    bdd.query(putQuery, function (err, result) {
        if (!err) {res.status(200).json({ message: 'Post modifié !'})} //reussite de la modification
        else res.status(400).json({ error : err.code })     //declare les erreurs
    });
}





//fonction permattant de liker et disliker un post 
exports.likePost = (req, res, next) => {

    //Liker un post 
    if (req.body.like==2) {
      //Liker un post déja disliké, on supprime le dislike
      const supQuery = `DELETE FROM dislikes WHERE post_id = ${req.params.id} AND user_id = ${req.body.userId}`;
      bdd.query(supQuery, function (err, result) {
        if (!err) {
          const likeQuery = `INSERT INTO likes VALUES (${req.params.id},${req.body.userId})`;
          bdd.query(likeQuery, function (err, result) {
            if (!err) {res.status(201).json({ message: 'Vous avez liké !' })}
            else res.status(400).json({ error : err.code })     
          });
        }
        else res.status(400).json({ error : err.code })     
        });
      }
  
    //enlever le like d'un post 
    else if (req.body.like==1) {
      const likeQuery = `DELETE FROM likes WHERE user_id = ${req.body.userId} AND post_id = ${req.params.id}`;
      bdd.query(likeQuery, function (err, result) {
        if (!err) {res.status(201).json({ message: 'Vous avez supprimé votre like !' })}
        else res.status(400).json({ error : err.code })    
        });
      }
    
    //enlever le dislike d'un post 
    else if (req.body.like==-1) {
      const dislikeQuery = `DELETE FROM dislikes WHERE user_id = ${req.body.userId} AND post_id = ${req.params.id}`;
      bdd.query(dislikeQuery, function (err, result) {
        if (!err) {res.status(201).json({ message: 'Vous avez supprimé votre dislike !' })}
        else res.status(400).json({ error : err.code })    
        });
      }
    
    //disliker un post 
    else {
      //disliker un post si il est déja liké, on supprime le like
      const supQuery = `DELETE FROM likes WHERE post_id = ${req.params.id} AND user_id = ${req.body.userId}`;
      bdd.query(supQuery, function (err, result) {
        if (!err) {
          const dislikeQuery = `INSERT INTO dislikes VALUES (${req.params.id},${req.body.userId})`;;
          bdd.query(dislikeQuery, function (err, result) {
            if (!err) {
            res.status(201).json({ message: 'Vous avez disliké!' })
        }
        else res.status(400).json({ error : err.code })     
        });
      }
      else res.status(400).json({ error : err.code })
      })
    }
}



//Fonction permettant la suppression d'un post
exports.deletePost = (req, res, next) => {
    //suppression du post ciblé
    let deletePostQuery = "DELETE FROM posts WHERE id = " + req.params.id;
    bdd.query(deletePostQuery, function (err, result) {
      if (err) res.status(400).json({error: err.code}); //declare les erreurs
      else res.status(200).json({message: 'Post supprimé !'}); //reussite de la suppression
    })
}

  

//Fonction permettant de commenter un post
exports.commentPost = (req, res, next) => {
    //création et insertion du commentaire dans la bdd
    const commentPostQuery = `INSERT INTO comments VALUES (NULL,"${req.body.userId}","${req.params.id}","${req.body.comment}", NOW())`;
    bdd.query(commentPostQuery, function (err, result) {
      if (!err) {res.status(201).json({ message: 'Commentaire créé !' })} //réussite de la création d'un commentaire
      else res.status(400).json({ error : err.code })     //déclare les erreurs
    });
}



//Fonction permettant de récuperer les commentaires d'un post
exports.getComments = (req, res, next) => {
    //recuperation des données des commentaires d'un post
    let getCommentsQuery = `SELECT users.pseudo, users.picture_url, comments.id, comments.comment FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.post_id =${req.params.id} ORDER BY comments.date DESC`;
    bdd.query(getCommentsQuery, function (err, result) {
      if (err) throw err; //declare les erreurs
      else { //tant qu'il y a des commentaires, la liste continue
        if(result.length > 0) {
          const Comments = [];
          for (let i = 0; i < result.length; i++) {
            Comments.push({
              id: result[i].id,
              picture_url: result[i].picture_url,
              pseudo: result[i].pseudo,
              comment: result[i].comment
            })
          }
          res.status(200).json(Comments);
        }
        else {res.status(200).json([]);}
      }
    })
}




//Fonction permettant la suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
    //suppression du commentaire ciblé
    let deleteCommentQuery = "DELETE FROM comments WHERE id = " + req.params.id;
    bdd.query(deleteCommentQuery, function (err, result) {
      if (err) res.status(400).json({error: err.code}); //declare les erreurs
      else res.status(200).json({message: 'Commentaire supprimé !'}); //reussite de la suppression
    })
}
