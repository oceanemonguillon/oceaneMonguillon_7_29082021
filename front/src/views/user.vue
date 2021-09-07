
<template>
  <div class="User">
    <header class="header" id="posts-header">
      <img alt="logo" src="../assets/logo.png" id="logo">
      <nav id="nav">
        <ul>
          <li><router-link to="/posts" class="link">Accueil </router-link></li>
          <li><router-link to="/addpost" id="add" class="link">Créer un Post </router-link></li>
          <li class="disconnection link" @click = "disconnection"> Déconnexion </li>
        </ul>
      </nav>
    </header>
    <h1>{{pseudo}}, voici votre profil</h1>
    <div id="profilDiv"></div>

    <button class="button button__modify modifyAvatar" v-if="id==urlId" @click="modifyUser"> Modifier ma photo de profil </button>
    <button class="button button__delete deleteAvatar" v-if="id==urlId" @click="deleteUser"> Supprimer mon compte </button>

    <p id="erreur" v-show="success===false"> {{message}} </p>
  </div>
</template>