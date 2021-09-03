<template>
  <div class="signup">
    <header class="header">
      <img alt="logo" src="../assets/logo.png" id="logo">
    </header>
    <h1> Bienvenue sur le reseau social de Groupomania! </h1>
    <div class="card">
      <h2> Créer un compte </h2>
      <form id="formElement" @submit = "sendForm">
        <label for="pseudo">Pseudo <span class="required">*</span> </label>
        <input @input = "checkForm" type="text" id="pseudo" name="pseudo" required>
        
        <label for="picture" class="custom-file-upload"><i class="fa fa-upload" aria-hidden="true"></i> Importez votre photo de profil <span class="required">*</span></label>
        <input @input = "checkForm" @change = "loadImagePreview" type="file" id="picture" name="picture" required accept="image/*">
        
        <label for="mail">E-mail <span class="required">*</span> </label>
        <input @input = "checkForm" type="email" id="mail" name="email" required>
        
        <label for="password">Mot de passe <span class="required">*</span> </label>
        <input @input = "checkForm" type="password" id="password" name="password" minlength="8" required>
        <p> * Le mot de passe doit contenir minimum 8 caractères dont: 1 minuscule, 1 majuscule, 1 chiffre, et 1 caractère spécial</p>
       
        <input type="submit" id="inscription-btn" value="S'inscrire" disabled>
      </form>
      <div class="required"> * Champs obligatoire </div>
    </div>

    <p id="erreur" v-show="success===false"> Echec de l'inscription : {{message}} </p>
    <div id="go-login">
    <p> Vous avez déjà un compte ? <router-link to="/">Se connecter</router-link> </p>
    </div>
  </div>
</template>