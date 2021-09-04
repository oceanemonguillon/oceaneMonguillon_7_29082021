<template>
  <div class="signup">
    <header class="header">
        <img alt="logo" src="../assets/logo.png" id="logo">
    </header>
    <h1> Bienvenue sur le reseau social de Groupomania ! </h1>

    <div class="card">
      <h2> Créer un compte </h2>
      <form id="formElement" @submit = "sendForm">
        <label for="pseudo">Pseudo <span class="required">*</span> </label>
        <input @input = "checkForm" type="text" id="pseudo" name="pseudo" required>
        
        <label for="picture" class="custom-file-upload"><i class="fa fa-upload" aria-hidden="true"></i> Importez une photo de profil <span class="required">*</span></label>
        <input @input = "checkForm" type="file" id="picture" name="picture" required accept="image/*">
        
        <label for="mail">Adresse e-mail <span class="required">*</span> </label>
        <input @input = "checkForm" type="email" id="mail" name="email" required>
        
        <label for="password">Mot de passe <span class="required">*</span> </label>
        <input @input = "checkForm" type="password" id="password" name="password" minlength="8" required>
        <p class="choice-password">Le mot de passe doit contenir un minimum de 8 caractères dont: 1 minuscule, 1 majuscule, 1 chiffre, et 1 caractère spécial</p>
        
        <input type="submit" id="inscription-btn" value="S'inscrire" disabled>
        <div class="required"> * Champs requis </div>
      </form>
    </div>
    <div id="go-login">
      <p id="erreur" v-show="success===false"> {{message}} </p>
      <p> Vous avez déjà un compte ? <router-link to="/">Se connecter</router-link> </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'signup',
  data: function() {
    return {
    success: true, //message d'erreur si false
    message :"", //message d'erreur
    }
  },
  methods: {
    //Vérification des données entrées
    checkForm() {
      if (document.getElementById("pseudo").checkValidity() && document.getElementById("picture").checkValidity()
      && document.getElementById("mail").checkValidity() && document.getElementById("password").checkValidity()) {
        document.getElementById("inscription-btn").disabled = false; //si ok, bouton d'envoie actif
      }
      else document.getElementById("inscription-btn").disabled = true; //si erreur, bouton reste desactivé
    },

    //Fonction d'envoie du formulaire 
    sendForm(event) {
      event.preventDefault(); //Appel du backend
      //
      let email= document.getElementById("mail").value;
      let password = document.getElementById("password").value;
      let pseudo = document.getElementById("pseudo").value;
      let user = { "email": email, "password": password, "pseudo": pseudo };
      let fileToSend = event.target.picture.files[0];

      let formData = new FormData();
      formData.append('user', JSON.stringify(user)); //envoie les infos sous format json
      formData.append('image', fileToSend); //envoie l'image en tant que fichier
      const options = { //requete post
        method: 'POST',
        body: formData,
        headers: {'Accept': 'application/json, text/plain, */*'}
      };
      fetch("http://localhost:3000/user/signup", options)
        .then (res => {
          if (res.status == 201) {
            this.success=true;
            this.$router.push({ name: 'login' }); //si compte crée, renvoie sur la page de connexion
          }
          else {res.json ()
            .then (json => { //si probleme, message d'erreur
              this.success = false;
              this.message = json.error;
            }
          )}
        })
          .catch (() => { //pd de serveur, message d'erreur
            this.success= false;
            this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
          })
      
    }
  }
}
</script>

<style lang="scss">

#picture{
  margin: 10px auto;
}

#pseudo{
  margin-top: 10px;
  margin-bottom: 10px;
}

.choice-password{
  font-size: 10px;
}

#inscription-btn {
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

.required{
  color: black;
  padding-bottom:10px;
}
</style>