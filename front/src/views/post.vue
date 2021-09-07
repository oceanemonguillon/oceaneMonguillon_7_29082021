<template>
  <div class="Post">
    <header class="header" id="posts-header">
      <img alt="logo" src="../assets/logo.png" id="logo">
      <nav id="nav">
        <ul>
          <li><router-link to="/posts" class="link"> Accueil</router-link></li>
          <li><router-link to="/addpost" id="add" class="link">Créer un Post </router-link></li>
          <li><router-link :to="'/user/'+id" class="link">Mon profil</router-link></li>
          <li class="disconnection link" @click = "disconnection"> Déconnexion </li>
        </ul>
      </nav>
    </header>
    <h1>{{pseudo}}, voici le post que vous souhaitez voir!</h1>

    <section>
        <div id="post"></div>

        <div id="commentDiv">
            <label for="comment">Ecrivez un commentaire :</label>
            <textarea type="text" id="comment" name="comment" minlength="1" maxlength="600"></textarea>
            <button type="button" class="button button__send" @click="postComment">Commenter</button>
        </div>

        <div class="allComments"></div>

        <button class = "button button__modify" v-if= "pseudo===postPseudo" @click= "modifyPost"> Modifier le post </button>
        <button class ="button button__delete" v-if= "pseudo===postPseudo" @click= "deletePost" ><i class="fas fa-trash"></i> Supprimer le post </button>

        <p id="erreur" v-show="success===false"> Echec de la requête : {{message}} </p>

    </section>

  </div>

</template>

<script>
export default {
    data: function() {
        //données actualisées au chargement de la page
        return {
            success: true, //si false, message d'erreur
            message :"", //message d'erreur
            id: "", 
            token: "", 
            pseudo:"", 
            postPseudo: "",
            userLike:false,
            userDislike:false,
            numberOfComments: 0 
        }
    },
    //JS monté, refresh de la page
    mounted() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')); //récuperation des infos de l'utilisateur
        if (userInfo) { //Vérification de la connexion
            this.id = userInfo.id;
            this.pseudo = userInfo.pseudo;
            this.token = userInfo.token;
            //chargement du post (appel fonction)
            this.getOnePost();
        }
        else this.$router.push({ name: 'login' }); //sinon on le renvoie vers la page login
    },
    methods: {
        getOnePost(){//fonction de recuperation d'un post dans la bdd           
            //Requete à la bdd
            const optionsGetPost = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`
                }
            };
            const postId = window.location.href.substr((window.location.href.lastIndexOf("/") + 1));
            fetch(`http://localhost:3000/posts/${postId}`, optionsGetPost)
            .then (res => {
                if (res.status == 200) {//si données récupérées :
                res.json ()
                    .then (json => {
                        const postsDiv = document.getElementById('post');//on place le resultat dans l'element div concerné
                        
                        //Affichage de la photo de profil et du pseudo en petit
                        const pictureContainer = document.createElement("div");
                        pictureContainer.setAttribute("class", "pictureContainer");
                        postsDiv.appendChild(pictureContainer);
                        pictureContainer.textContent = `${json.pseudo} `;
                        this.postPseudo=json.pseudo;
                        const newPicture = document.createElement("img");
                        newPicture.src = json.picture;
                        newPicture.alt = json.picture;
                        newPicture.width = 50;
                        newPicture.height = 50;
                        newPicture.setAttribute("class", "picture");
                        pictureContainer.appendChild(newPicture);
                        
                        //Date de publication du post
                        const postHour = document.createElement("p");
                        const postTime = parseInt(json.date.substring(0,json.date.indexOf(':')));//appel du Datetime de la bdd
                        switch (true) {
                            case postTime == 0:
                                postHour.textContent = "Publié il y a moins d'une heure";
                                break;
                            case postTime == 1:
                                postHour.textContent = `Publié il y a 1 heure`;
                                break;
                            case postTime<=23 && postTime>1:
                                postHour.textContent = `Publié il y a ${postTime} heures`;
                                break;
                            case postTime<=47 && postTime>23:
                                postHour.textContent = `Publié il y a 1 jour`;
                                break;
                            case postTime<=167 && postTime>47:
                                postHour.textContent = `Publié il y a ${Math.floor(postTime/24)} jours`;
                                break;
                            case postTime>167:
                                postHour.textContent = `Publié il y a plus d'1 semaine`;
                                break;
                        }
                        postsDiv.appendChild(postHour);
                                                
                        let newTitle = document.createElement("h2");//création h2 dans postsDiv, titre du post
                        newTitle.textContent = json.title;
                        postsDiv.appendChild(newTitle);

                        let newText = document.createElement("p"); //création p dans postsDiv, texte du post
                        newText.textContent = json.text;
                        postsDiv.appendChild(newText);
                        
                        
                        let likesAndComments = document.createElement("div");//création div, likes et commentaires du post
                        likesAndComments.setAttribute("id", "likesAndComments");
                        let likesDiv = document.createElement("div");//création div, likes et dislikes du post
                        likesDiv.setAttribute("class","likes-btn");
                        likesAndComments.appendChild(likesDiv);
                    
                        let likeDiv = document.createElement("div");//création div, likes du post
                        likeDiv.setAttribute("class", "like");
                        likeDiv.innerHTML='<i class="far fa-thumbs-up fa-lg"></i>'; 
                        if (json.usersLike.indexOf(this.pseudo) != -1)
                         {likeDiv.style.color = "green";//si deja liké par utilisateur, couleur verte
                         this.userLike=true;}

                        if (json.usersLike.length>0) {//nd de likes sur le post
                            likeDiv.innerHTML+= " "+ json.usersLike.length;
                        }
                        
                        likeDiv.addEventListener("click", this.postLike);//au click, ajout du like (appel fonction)
                        likesDiv.appendChild(likeDiv);

                        const dislikeDiv = document.createElement("div"); //creation div, dislikes du post 
                        dislikeDiv.setAttribute("class", "like");
                        dislikeDiv.innerHTML='<i class="far fa-thumbs-down fa-lg"></i>';
                        if (json.usersDislike.indexOf(this.pseudo) != -1)
                         {dislikeDiv.style.color = "red"; //si deja disliké par utilisateur, couleur rouge
                            this.userDislike=true;}

                        if (json.usersDislike.length>0) {//nb de dislikes sur le post
                            dislikeDiv.innerHTML+= " "+ json.usersDislike.length;
                        }

                        dislikeDiv.addEventListener("click", this.postDislike);//au click, ajout du dislike (appel fonction)
                        likesDiv.appendChild(dislikeDiv);

                        const numberComments = document.createElement("p");//creation balise p, nb commentaires
                        numberComments.setAttribute("id", "numberOfComments");

                        this.getAllComments();//appel fonction commentaire
                        
                        likesAndComments.appendChild(numberComments);
                        postsDiv.appendChild(likesAndComments);
                    })
                }else {
                    res.json ().then (() => {this.$router.push({ name: 'login' });})//si echec recuperation, redirection page login
                }
            })
            .catch (() => {//pb serveur, message d'erreur
                this.success= false;
                this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
            })
        },


        postLike(){//fonction création de like
            const postId = window.location.href.substr((window.location.href.lastIndexOf("/") + 1));
        
            if (this.userLike == true) {//déja liké, on dé-like
                const optionsLike = {
                    method: 'POST',
                    body: JSON.stringify({"userId": this.id, "like": 1}), //valeur 1 pour dé-liker 
                    headers: {'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`}
                };
                fetch(`http://localhost:3000/posts/${postId}/like`, optionsLike)
                    .then (res => {
                        if (res.status == 201) {res.json ()
                            .then (() => {
                                this.success=true;
                                alert("Vous avez enlevé votre like! :) ");
                                window.location.reload(); //rapel de la fonction pour refresh
                            })
                        }
                        else {res.json ()
                            .then (json => {//erreur , dé-like n'as pas fonctionné
                                this.success = false;
                                this.message = json.error;
                                })
                            }
                    })
                    .catch (() => {//pb serveur, message d'erreur
                        this.success= false;
                        this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
                    });
            }
            
            else {//post pas encore liké
                const optionsLike = {
                    method: 'POST',
                    body: JSON.stringify({"userId": this.id, "like": 2}),//valeur 2 pour ajouter un like
                    headers: {'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`}
                };
                fetch(`http://localhost:3000/posts/${postId}/like`, optionsLike)
                    .then (res => {
                        if (res.status == 201) {res.json ()
                            .then (() => {
                                this.success=true;
                                alert("Vous avez liké! :) ");
                                window.location.reload();//rappel de la fonction pour refresh
                            })
                        }
                        else {res.json ()//like n'as pas fonctionné, message d'erreur
                            .then (json => {
                                this.success = false;
                                this.message = json.error;
                                })
                            }
                    })
                    .catch (() => {//pb serveur, message d'erreur
                        this.success= false;
                        this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
                    });
            }
        },


        postDislike() { //fonction de création dislike
            const postId = window.location.href.substr((window.location.href.lastIndexOf("/") + 1));

            if (this.userDislike == true) {//déja disliké, on dé-dislike
                const optionsDislike = {
                    method: 'POST',
                    body: JSON.stringify({"userId": this.id, "like": -1}),//valeur -1 pour dé-disliker
                    headers: {'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`}
                };
                fetch(`http://localhost:3000/posts/${postId}/like`, optionsDislike)
                    .then (res => {
                        if (res.status == 201) {res.json ()
                            .then (() => {
                                this.success=true;
                                alert("vous avez enlevé votre dislike: :)");
                                window.location.reload();//rapel de la fonction pour refresh
                            })
                        }
                        else {res.json ()//dé-dislike n'as pas marché, message d'erreur
                            .then (json => {
                                this.success = false;
                                this.message = json.error;
                                })
                            }
                    })
                    .catch (() => {//pb serveur, message d'erreur
                        this.success= false;
                        this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
                    });
            }
            
            else {//post pas encore disliké
                const optionsDislike = {
                    method: 'POST',
                    body: JSON.stringify({"userId": this.id, "like": -2}),//valeur -2 pour disliker
                    headers: {'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`}
                };
                fetch(`http://localhost:3000/posts/${postId}/like`, optionsDislike)
                    .then (res => {
                        if (res.status == 201) {res.json ()
                            .then (() => {
                                this.success=true;
                                alert("Vous avez disliké! :)");
                                window.location.reload();//rapel de la fonction pour refresh
                            })
                        }
                        else {res.json ()//dislike n'as pas marché, message d'erreur
                            .then (json => {
                                this.success = false;
                                this.message = json.error;
                                })
                            }
                    })
                    .catch (() => {//pb serveur, message d'erreur
                        this.success= false;
                        this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
                    });
            }
        },

        
        disconnection() {//Fonction deconnexion
            localStorage.clear();//efface les données de l'utilisateur du pc
            this.$router.push({ name: 'login' }); //redirection page login
        },  


        modifyPost() {//fonction modification post 
            const postId = window.location.href.substr((window.location.href.lastIndexOf("/") + 1));
            this.$router.push({ path: `/modifypost/${postId}` })//revoie page modifyPost
        },

        
        getAllComments() {//fonction recuperation des commentaires
            //Requete a la bdd
            const optionsGetComments = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`
                }
            };
            const postId = window.location.href.substr((window.location.href.lastIndexOf("/") + 1));

            fetch(`http://localhost:3000/posts/${postId}/comment`, optionsGetComments)
                .then (res => {
                    if (res.status == 200) {res.json ()
                        .then (json => {
                            this.numberOfComments = json.length;
                            const postsDiv = document.getElementsByClassName('allComments')[0];
                            //nb de commentaire affichés
                            if (this.numberOfComments >= 0) {document.getElementById("numberOfComments").textContent= this.numberOfComments + " commentaires";}
                            
                            if (json.length>0) {//nb de com supperieur a 0
                                for (let i = 0; i < json.length; i++) {//affiche tout les commentaires
                                    const newP = document.createElement("p");
                                    const newSpan = document.createElement("span");
                                    //infos de l'utilisateur qui a écrit le com
                                    newSpan.innerHTML = `<img src='${json[i].picture_url}' width='40' height='40' alt='photo de ${json[i].pseudo}'> <p class="commentPseudo"> ${json[i].pseudo}: </p>  ${json[i].comment}`;
                                    newSpan.setAttribute("class","whoComment");
                                    newP.setAttribute("class", "commentStyle");
                                    newP.appendChild(newSpan);
                                    postsDiv.appendChild(newP);

                                    if (this.pseudo == json[i].pseudo) { //suppression du commentaire par l'utilisateur
                                        const newButton = document.createElement("button");
                                        newButton.setAttribute("type","button");
                                        newButton.setAttribute("class", "deleteComment");
                                        newButton.innerHTML = '<i class="fas fa-trash fa-lg"></i>';
                                        newP.appendChild(newButton);
                                        newButton.addEventListener("click", () => {//appel de la bdd si suppression 
                                            const optionsDeleteComment = {//requete a la bdd
                                                method: 'DELETE',
                                                headers: {
                                                    'Authorization': `Bearer ${this.token}`
                                                }
                                            };
                                                
                                        fetch(`http://localhost:3000/posts/${json[i].id}/comment`, optionsDeleteComment)
                                            .then (res => {
                                                if (res.status == 200) {res.json ()
                                                    .then (() => {
                                                        alert("Vous avez supprimé un commentaire!");
                                                        newP.remove();//suppression du com sur la page
                                                        this.numberOfComments--;//enleve 1 commentaire au total
                                                        window.location.reload();//refresh de la page en appelant la fonction 
                                                    })
                                                }
                                                else {res.json ()//erreur lors de la suppression 
                                                    .then (json => {
                                                        this.success = false;
                                                        this.message = json.error;
                                                    })
                                                }
                                            })
                                            .catch (() => {//pb de serveur, message d'erreur
                                                this.success= false;
                                                this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
                                            })
                                        }) 
                                    } 
                                } 
                            } 
                        }) 
                    }else {//la bdd ne repond pas, message d'erreur
                        res.json ()
                        .then (json => {
                            this.success = false;
                            this.message = json.error;
                        })
                    }
                })
                .catch (() => {//pb de serveur,message d'erreur
                    this.success= false;
                    this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
                })
        },



        deletePost() {//fonction de suppression de post 
            let confirmation = confirm("Voulez-vous vraiment supprimer ce post ?");//confirmation du choix 
            if (confirmation == true) {//si ok: 
                const optionsDeletePost = {//requete a la bdd pour supprimer 
                    method: 'DELETE',
                    headers: {
                    'Authorization': `Bearer ${this.token}`
                    }
                };
                const currentUrl = window.location.href;
                const postId = currentUrl.substr((currentUrl.lastIndexOf("/") + 1));
                fetch(`http://localhost:3000/posts/${postId}`, optionsDeletePost)
                    .then (res => {
                        if (res.status == 200) {res.json ()//suppression réussie 
                            .then (() => {
                                alert("Vous avez supprimé un post! :)");
                                this.$router.push({ name: 'posts' });//reussite de la suppression, redirection vers les posts
                            })
                        }
                        else {res.json ()
                            .then (json => {//echec de la suppression, message d'erreur
                                this.success = false;
                                this.message = json.error;
                            })
                        }
                    })
                    .catch (() => {//pb de serveur, message d'erreue
                        this.success= false;
                        this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
                    })
            }
        },



        postComment() {//fonction de création de commentaire
            const postId = window.location.href.substr((window.location.href.lastIndexOf("/") + 1));
            if (document.getElementById("comment").checkValidity()) {//verification du com 
                const post = {"userId": this.id, "comment": document.getElementById("comment").value};
                const optionsPostComment = {//requete a la bdd, envoie
                    method: 'post',
                    body:JSON.stringify(post),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                        }
                };
                fetch(`http://localhost:3000/posts/${postId}/comment`, optionsPostComment)
                    .then (res => {
                        if (res.status == 201) {res.json ()//reussite de l'envoie
                            .then (() => {
                                this.success=true;
                                alert("Vous avez écrit un commentaire :) !");
                                window.location.reload();//refresh de la page avec l'appel de fonction 
                            })
                        }
                        else {res.json ()//echec de l'envoie
                            .then (json => {
                                this.success = false;
                                this.message = json.error;//message d'erreur
                                })
                            }
                    })
                    .catch (() => {//pb de serveur, message d'erreur
                        this.success= false;
                        this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
                    });
            }         
        } 
    } 
}
</script>

<style lang="scss">
section {
    width:60%;
    margin:auto;
}
@media screen and (max-width: 600px) {
  section {width:90%;}
}

#post {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    box-shadow: 2px 2px 20px #FAA0A0; //effet d'ombre
    margin:30px auto;
    background-color: white;
    padding:5px;
    p{
        width: 95%;
        word-break: break-all;
    }
    .picture{
        border-radius: 100%;
        margin-right: 10px;
    }
    .pictureContainer{
        display: flex;
        flex-direction: row-reverse;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 90%;   
    }
}

#postText {
    text-align: center;
}

#commentDiv {
    margin:0px auto;    
    & > textarea {
        margin:5px;
        width:90%;
    }
}

.allComments > p {
    font-size:18px;
    margin:15px;
    word-wrap: break-word;
    text-align: left;
}

p span {
    background-color: white;
    margin-right: 10px;
}

#likesAndComments {
    display:flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    border-top: solid 1px black;
}

.likes-btn{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    border-right: solid 1px black;
}

.whoComment{
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    width:100%;
    border: solid 1px lightgrey;
    box-shadow: 2px 2px 20px lightgrey;


    img{
        border-radius: 100%;
        margin-right: 10px;
        margin-left: 10px;
    }
    .commentPseudo{
        font-weight: bold;
        margin-right: 10px;
    }
}

.commentStyle{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: left;
    width: 100%;
}

.fa-trash{
    color: white;
}

.deleteComment {
    background-color: red;
    border-radius: 8px;
    padding: 10px;
    border:none;
    transform: scale(1);
    transition: all 400ms;
    &:hover{
        transform: scale(1.1);
    }
}

.button {
    color: white;
    border: none;
    border-radius: 15px;
    margin: 15px 5px;
    padding: 10px;
    font-weight:bold;
    font-size: 16px;  
    transform: scale(1);
    transition: all 400ms;
    &__modify {
        background-color: blue;
    }
    &__delete {
        background-color: red;
    }
    &__send {
        background-color: green;
    }
    & > a {
        text-decoration: none;
    }
    &:hover{
        transform: scale(1.1);
    }
}

</style>