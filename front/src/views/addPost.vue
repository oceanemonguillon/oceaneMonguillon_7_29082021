<template>
  <div class="AddPost">
    <header class="header" id="posts-header">
      <img alt="logo" src="../assets/logo.png" id="logo">
      <nav id="nav">
        <ul>
          <li><router-link to="/posts" class="link">Accueil </router-link></li>
          <li><router-link :to="'/user/'+id" class="link">Mon profil</router-link></li>
          <li class="disconnection link" @click = "disconnection"> Déconnexion </li>
        </ul>
      </nav>
    </header>
    <h1>Postez un message: <i class="far fa-envelope"></i></h1>
    <div class="card">
        <form id="formElement" @submit="addPost">
            <label for="title">Titre <span class="required">*</span> </label>
            <input @input = "checkForm" type="text" id="title" name="title" minlength="8" maxlength= "49" required>
            
            <label for="description"> Texte <span class="required">*</span></label>
            <textarea @input = "checkForm" type="text" id="Text" name="text" maxlength="1000"></textarea>
            
            <div class="required"> * Champs requis </div>
            <input type="submit" id="add-btn" value="Poster" disabled>
        </form>
    </div>

    <p id="erreur" v-show="success===false">{{message}} </p>

  </div>
</template>


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