<template>
  <div class="AddPost">
    <header class="header" id="posts-header">
      <img alt="logo" src="../assets/logo.png" id="logo">
      <nav id="nav">
        <ul>
          <li><router-link to="/addpost" id="add" class="link">Créer un Post </router-link></li>
          <li><router-link :to="'/user/'+id" class="link">Mon profil</router-link></li>
          <li class="disconnection link" @click = "disconnection"> Déconnexion </li>
        </ul>
      </nav>
    </header>
    <h1>Bonjour {{pseudo}}, regardez les nouvelles! <i class="fas fa-hand-point-down hand"></i></h1>
    <div id="postsDiv"></div>
    <p id="erreur" v-show="success===false">{{message}} </p>
  </div>
</template>

