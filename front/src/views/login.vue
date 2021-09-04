<template>
  <div id="login">
    <header class="header">
      <img alt="logo" src="../assets/logo.png" id="logo">
    </header>
    <h1> Bienvenue sur le reseau social de Groupomania! </h1>

    <div class="card">
      <h2> Se connecter </h2>
      <form id="formElement" @submit = "sendForm">
        <label for="mail"> Adresse e-mail : </label>
        <input @input = "checkForm" type="email" id="mail" name="email" required>
        
        <label for="password">Mot de passe : </label>
        <input @input = "checkForm" type="password" id="password" name="password" minlength="8" required>
        
        <input type="submit" id="connexion-btn" value="Connexion" disabled>
      </form>
    </div>

    <p id="erreur" v-show="success===false"> {{message}} </p>
    <div id="go-signup">
      <p> Pas encore de compte ? <router-link to="/signup">Créer un compte</router-link> </p>
    </div>
  </div>
</template>

<script>

export default {
  //data retournant un message
  data: function() {
    return {
      success: true, //un message s'affiche s'il y a une erreur
      message :"",
    }
  },

  methods: {
    //Verification des champs entrés
    checkForm() { //si les champs sont valides alors le bouton deviens actif
      if (document.getElementById("mail").checkValidity() && document.getElementById("password").checkValidity()) {
        document.getElementById("connexion-btn").disabled = false;
      } //sinon, il reste desactivé
      else document.getElementById("connexion-btn").disabled = true;
    },
    //Fonction après click sur bouton d'envoie
    sendForm(event) {
      event.preventDefault(); //appel du backend
      let email= document.getElementById("mail").value;
      let password = document.getElementById("password").value;
      const options = {
        method: 'POST',
        body: JSON.stringify({"email": email, "password": password}),
        headers: {'Content-Type': 'application/json'}
      };
      //récuperation de la bdd
      fetch("http://localhost:3000/user/login", options)
        .then (res => {//récuperation des données réussie
          if (res.status == 200) {res.json ()
            .then (json => {
              this.success=true;
              const userInfo = {id: json.id, pseudo: json.pseudo, token: json.token};
              //maintient de la connexion tant que l'utilisateur ne se deconnecte pas 
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
              //connexion établie, page la page des publications apparait
              this.$router.push({ name: 'posts' }); 
            })
          }
          else {res.json () //echec de la récuperation des données
            .then (json => {
              this.success = false;
              this.message = json.error;
            }
          )}
        })
        .catch (() => { //problème de serveur
          this.success= false;
          this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
        })
    }
  }
}
</script>


<style lang="scss">
#logo{
  width: 20%;
  height: auto;
  margin:20px auto;
}

h2{
  color: black;
}

.card{
  padding-top: 5px;
  border-radius: 15px;
  background: #FAA0A0;
  max-width: 400px;
  margin: 20px auto;
}

#formElement {
  color: black;
  margin: 15px auto;
  display:flex;
  flex-direction: column;
  padding: 15px;
  max-width: 400px;
}

#mail{
  margin-top: 10px;
  margin-bottom: 10px;
}

#password{
  margin-top: 10px;
  margin-bottom: 10px;
}

#connexion-btn {
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

a {
    font-weight: bold;
    color: blue;
}

#go-signup {
  margin-bottom: 70px;
}
</style>