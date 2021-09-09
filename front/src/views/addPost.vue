<template>
  <div class="AddPost">
    <header class="header" id="posts-header">
      <img alt="logo" src="../assets/logo.png" id="logo">
      <nav id="nav">
        <ul>
          <li><router-link to="/posts" class="link" title="Accueil"><i class="fas fa-home"></i></router-link></li>
          <li><router-link :to="'/user/'+id" class="link" title="Mon profil"><i class="fas fa-user-circle"></i></router-link></li>
          <li class="disconnection link" @click = "disconnection" title="Deconnexion"> <i class="fas fa-sign-out-alt"></i> </li>
        </ul>
      </nav>
    </header>
    <h1>Postez un message: <i class="far fa-envelope"></i></h1>
    <div class="card">
        <form id="formElement" @submit="addPost">
            <label for="title">Titre <span class="required">*</span> </label>
            <input @input = "checkForm" type="text" id="title" name="title" minlength="2" maxlength= "49" required>
            
            <label for="description"> Texte <span class="required">*</span></label>
            <textarea @input = "checkForm" type="text" id="text" name="text" maxlength="1000"></textarea>
            
            <div class="required"> * Champs requis </div>
            <input type="submit" id="add-btn" value="Poster">
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
    token:"" 
    }
  },
  //JS monté, refresh de la page
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); //récuperation des infos de l'utilisateur
    if (userInfo) { //Vérification de la connexion
      this.id = userInfo.id;
      this.token = userInfo.token;
    }
    else {this.$router.push({ name: 'login' });}//redirection si pb de connexion
  },

  methods: {

    //Fonction envoie du formulaire 
    addPost(event) {
      event.preventDefault(); //appel du back
      const title= document.getElementById("title").value;
      const text = document.getElementById("text").value;
      const post = {"userId": this.id, "title": title, "text": text};//infos a enoyer
      const options = {//requete a la bdd
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        }
      };
        fetch("http://localhost:3000/posts", options)
          .then (res => {
            if (res.status == 201) {res.json ()//si reussite de l'envoie
              .then (() => {
                this.success=true;
                this.$router.push({ name: 'posts' });//redirection vers page posts
              }
            )}
            else {res.json ()//echec d'envoie, message d'erreur
            .then (json => {
                this.success = false;
                this.message = json.error; 
              }
            )}
          })
          .catch (() => { //pb de serveur, message d'erreur
            this.success= false;
            this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
          })
      },

    //fonction deconnexion
    disconnection() {
      localStorage.clear();//supprime les données de connexion du pc 
      this.$router.push({ name: 'login' });//redirection vers page login 
    },
  }
}
</script>

<style lang="scss">
#add-btn {
  margin:10px auto;
  border: solid 2px black;
  background-color: black;
	padding:10px;
	border-radius:8px;
  color: white;
  font-size:20px;
  &:disabled {
    background: grey;
    color: white;
  }
}
</style>