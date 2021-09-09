
<template>
  <div class="User">
    <header class="header" id="posts-header">
      <img alt="logo" src="../assets/logo.png" id="logo">
      <nav id="nav">
        <ul>
          <li><router-link to="/posts" class="link" title="Accueil"><i class="fas fa-home"></i></router-link></li>
          <li><router-link to="/addpost" id="add" class="link" title="Créer un post"><i class="fas fa-plus"></i> </router-link></li>
          <li class="disconnection link" @click = "disconnection" title="Deconnexion"> <i class="fas fa-sign-out-alt"></i> </li>
        </ul>
      </nav>
    </header>
    <h1>{{pseudo}}, voici votre profil</h1>
    <div id="profilDiv" class="card"></div>

    <button class="button button__modify modifyPicture" v-if="id==urlId" @click="modifyUser"> Modifier ma photo de profil </button>
    <button class="button button__delete deleteCount" v-if="id==urlId" @click="deleteUser"> Supprimer mon compte </button>

    <p id="erreur" v-show="success===false"> {{message}} </p>
  </div>
</template>



<script>
export default {
    //données actualisées au chargement de la page
    data: function() {
        return {
            success: true, //affichage d'un message d'erreur si passe à false
            message :"", //message d'erreur
            id: "", 
            token: "", 
            pseudo:"",
            urlId:""
        }
    },
    //JS monté, refresh de la page
    mounted() {
        this.urlId=window.location.href.substr((window.location.href.lastIndexOf("/") + 1));
        const userInfo = JSON.parse(localStorage.getItem('userInfo')); //récuperation des infos de l'utilisateur
        if (userInfo) { //Vérification de la connexion
            this.id = userInfo.id;
            this.pseudo = userInfo.pseudo;
            this.token = userInfo.token;
            this.getUserInfo();//chargement des infos (appel fonction)
        }
        else this.$router.push({ name: 'login' });//si utilisateur pas connécté, renvoie vers login
    },
    methods: {
        getUserInfo() {//fonction de récuperation des infos de l'utilisateur connécté 
            
            const options = {//Requete à la bdd
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${this.token}`
                }
            };
            fetch(`http://localhost:3000/user/${this.urlId}`, options)
            .then (res => {
            if (res.status == 200) {res.json ()//si info récupérées: 
                .then (json => {
                    const infoDiv = document.getElementById('profilDiv');
                    let newP = document.createElement("p");//creation balise p 
                    newP.textContent = "Adresse e-mail : "+json.email;//recuperation email , mis dans balise p 
                    infoDiv.appendChild(newP);
                    let newP2 = document.createElement("p");// creation balise p 
                    newP2.textContent = "Photo : ";
                    infoDiv.appendChild(newP2);
                    let imageContainer = document.createElement("div");//creation balise div 
                    infoDiv.appendChild(imageContainer);
                    let newImg = document.createElement("img");
                    newImg.src = json.pictureUrl;//photo de profil de l'utilisateur mise dans la div 
                    newImg.alt = json.pictureUrl;
                    newImg.setAttribute("id", "profileImage");
                    imageContainer.appendChild(newImg);
                })
            }
            else {res.json ().then (() => {this.$router.push({ name: 'login' });})}//si pb, redirection vers page login
            })
            .catch (() => {//pb serveur, message d'erreur
                this.success= false;
                this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
            })
        },



        deleteUser() {//fonction de suppression d'un utilisateur 
            const options = {//requete a la bdd 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.token}`
                }
            };
            let confirmation = confirm("Etes-vous certain de vouloir supprimer votre compte ?");//confirmation du choix
            if (confirmation == true) {//si confirmé :
                fetch(`http://localhost:3000/user/${this.id}`, options)
                    .then (res => {
                        if (res.status == 200) {res.json ()
                            .then (() => {
                                alert("Votre compte a été supprimé");//message de confirmation 
                                localStorage.clear();//suppression des données dans le localstorage
                                this.$router.push({ name: 'signup' });//redirection vers la page signup
                            })
                        }
                        else {res.json ().then (json => {//si pb, message d'erreur 
                            this.success = false;
                            this.message = json.error;
                            }
                        )}
                    })
                    .catch (() => {//pb serveur, message d'erreur
                        this.success= false;
                        this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
                    })
            }
        },



        modifyUser() {//fonction modification photo profil
        //création de tout le setup de la page 
            document.getElementsByClassName("modifyPicture")[0].setAttribute("style","display:none");
            document.getElementsByClassName("deleteCount")[0].setAttribute("style","display:none");
            const infoDiv= document.getElementById('profilDiv');
            const newDiv = document.createElement("div");
            infoDiv.appendChild(newDiv);
            const newLabel = document.createElement("label");
            newLabel.setAttribute("for", "picture");
            newLabel.classList.add("custom-file-upload");
            newLabel.innerHTML = '<i class="fa fa-upload" aria-hidden="true"></i> Télécharger une nouvelle photo de profil';
            newDiv.appendChild(newLabel);
            const newInput = document.createElement("input");
            newInput.setAttribute("type", "file");
            newInput.setAttribute("name", "picture");
            newInput.setAttribute("id", "picture");
            newInput.setAttribute("accept", "image/*");
            newInput.setAttribute("required", true);
            newDiv.appendChild(newInput);
            const newDiv2 = document.createElement("div");
            infoDiv.appendChild(newDiv2);
            const newConfirmButton = document.createElement("button");
            newConfirmButton.classList.add("confirm", "button", "button__modify");
            newConfirmButton.textContent = "Confirmer la modification";
            newDiv2.appendChild(newConfirmButton);
            //Fonction à réaliser en cas de click sur le bouton de modification de la photo
            newConfirmButton.addEventListener('click', () => {
            const fileToSend = document.getElementById("picture").files[0];

            //envoie de la nouvelle photo
            let formData = new FormData();
            formData.append('image', fileToSend);
            const options = {
                method: 'PUT',
                body: formData,
                headers: {'Accept': 'application/json, text/plain, */*',
                    'Authorization': `Bearer ${this.token}`}
            };
            fetch(`http://localhost:3000/user/${this.id}`, options)
                .then (res => {//si envoie ok :
                    if (res.status == 200) {res.json ()
                        .then (() => {
                            alert("Votre photo a été modifié"); //message de reussite 
                            this.$router.push({ name: 'posts' });//redirection vers page posts
                        })
                    }
                    else {res.json ()//pb d'envoie, message d'erreur
                        .then (json => {
                            this.success = false;
                            this.message = json.error;
                        }
                    )}
                })
                .catch (() => {//pb de serveur, message d'erreur
                    this.success= false;
                    this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
                })
        
        })
            //Bouton de cancel modif
            const newCancelButton = document.createElement("button");
            newCancelButton.classList.add("cancel", "button", "button__delete");
            newCancelButton.textContent = "Annuler la modification";
            newDiv2.appendChild(newCancelButton);

            newCancelButton.addEventListener('click', () => {//au clilc, annulation de la modification 
                document.getElementsByClassName("modifyPicture")[0].setAttribute("style","display:inline");
                document.getElementsByClassName("deleteCount")[0].setAttribute("style","display:inline");
                newDiv.remove();
                newDiv2.remove();
                newCancelButton.remove();
                newConfirmButton.remove();
            })

        
        },

        disconnection() {//fonction de deconnexion 
            localStorage.clear();//suppression des données de connexion 
            this.$router.push({ name: 'login' });//redirection vers page login 
        }
    }
}
</script>

<style lang="scss">
#profileImage{
    width: 30%;
    height: auto;
}

</style>