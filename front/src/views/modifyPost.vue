<template>
  <div class="modifyPost">
    <header class="header" id="posts-header">
      <img alt="logo" src="../assets/logo.png" id="logo">
      <nav id="nav">
        <ul>
          <li><router-link to="/posts" class="link">Accueil </router-link></li>
          <li><router-link to="/addpost" id="add" class="link">Créer un Post </router-link></li>
          <li><router-link :to="'/user/'+id" class="link">Mon profil</router-link></li>
          <li class="disconnection link" @click = "disconnection"> Déconnexion </li>
        </ul>
      </nav>
    </header>
    <h1>Modifiez votre post: </h1>
    <div class="card">
        <form id="formElement" @submit="modifyPost">
            <label for="title">Titre <span class="required">*</span> </label>
            <input @input = "checkForm" type="text" id="title" name="title" minlength="2" maxlength= "49" required>
            
            <label for="description"> Texte <span class="required">*</span></label>
            <textarea @input = "checkForm" type="text" id="text" name="text" maxlength="1000"></textarea>
            
            <div class="required"> * Champs requis </div>
            <input type="submit" id="add-btn" value="Modifier">
        </form>
    </div>

    <p id="erreur" v-show="success===false">{{message}} </p>
  </div>
</template>



<script>
export default {
  data: function() {
    return {
      success: true, //message d'erreur si false 
      message :"", //message d'erreur
      id:"", 
      token:"", 
    }
  },
  //JS monté, refresh de la page
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); //récuperation des infos de l'utilisateur
    if (userInfo) { //Vérification de la connexion
      this.id = userInfo.id;
      this.token = userInfo.token;
      this.getPost(); //Appel fonction
    }
    else {this.$router.push({ name: 'login' });}//redirection si pb de connexion
  },
  methods: {
    getPost() {//fonction recuperation du post
      const optionsGetPost = {//requete a la bdd
      method: 'GET', 
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      };
      const postId = window.location.href.substr((window.location.href.lastIndexOf("/") + 1));
      fetch(`http://localhost:3000/posts/${postId}`, optionsGetPost)
        .then (res => {
          if (res.status == 200) {res.json ()//si chargement ok 
            .then (json => {
              document.getElementById('title').value = json.title; //title apparait dans le champ titre
              document.getElementById('text').value = json.text;//text apparait dans le champ texte 
            })
          }
          else {res.json ()//pd de connexion 
            .then (() => {this.$router.push({ name: 'login' });})//redirection vers page login 
          }
        })
        .catch (() => {//pb de serveur, message d'erreur 
          this.success= false;
          this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
        })
    },


    
    modifyPost(event) {//fonction de modification 
        event.preventDefault(); //supprime le comportement par defaut  
        const title= document.getElementById("title").value;//recuperation de la valeur de title
        const text = document.getElementById("text").value;// "" de text
        const currentUrl = window.location.href;
        const postId = currentUrl.substr((currentUrl.lastIndexOf("/") + 1));
        const optionsModifyPost = {//requete à la bdd
            method: 'PUT',
            body: JSON.stringify({"title": title, "text": text}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        };
        console.log(optionsModifyPost);
        fetch(`http://localhost:3000/posts/${postId}`, optionsModifyPost)
          .then (res => {
            if (res.status == 200) {//si envoie ok 
              res.json ()
              .then (() => {
                this.success=true;
                this.$router.push({ name: 'posts' });//redirection vers page post 
              }
            )}
            else {res.json ()//si pb d'envoie 
              .then (json => {
              this.success = false;
              this.message = json.error;//message d'erreur
              })
            }
          })
          .catch (() => {//si pb de bdd, message d'erreur
            this.success= false;
            this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
          })
    },


    
    disconnection() {//fonction de deconnexion 
      localStorage.clear();//suppression des données de connexion 
      this.$router.push({ name: 'login' });//redirection vers page login 
    }
  }
}
</script>