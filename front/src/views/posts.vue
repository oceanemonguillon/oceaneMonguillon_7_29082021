<template>
  <div class="AddPost">
    <header class="header" id="posts-header">
      <img alt="logo" src="../assets/logo.png" id="logo">
      <nav id="nav">
        <ul>
          <li><router-link to="/addpost" id="add" class="link" title="Créer un post"><i class="fas fa-plus"></i> </router-link></li>
          <li><router-link :to="'/user/'+id" class="link" title="Mon profil"><i class="fas fa-user-circle"></i></router-link></li>
          <li class="disconnection link" @click = "disconnection" title="Deconnexion"> <i class="fas fa-sign-out-alt"></i> </li>
        </ul>
      </nav>
    </header>
    <h1>Bonjour {{pseudo}}, regardez les nouvelles! <i class="fas fa-hand-point-down hand"></i></h1>
    <div id="postsList"></div>
    <p id="erreur" v-show="success===false">{{message}} </p>
  </div>
</template>

<script>
export default {
  //données actualisées au chargement de la page
  data: function() {
    return {
      success: true, //message d'erreur si false
      message :"", //message d'erreur
      id: "", 
      token: "",
      pseudo:"", 
      Posts: [] //liste des posts dans la bdd
    }
  },
  //JS monté, refresh de la page
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); //récuperation des infos de l'utilisateur
    if (userInfo) { //Vérification de la connexion
    this.pseudo = userInfo.pseudo;
    this.id = userInfo.id;
    this.token = userInfo.token;
    //chargement des posts (appel fonction)
    this.getAllPosts(); 
    }
    else this.$router.push({ name: 'login' }); //si utilisateur pas connécté, renvoie vers login
  },
  methods: {
    getAllPosts() { //fonction de recuperation des posts dans la bdd
      //Requete à la bdd
      const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
        }
      };
      fetch("http://localhost:3000/posts", options)
      .then (res => {
        if (res.status == 200) {res.json () //si données récupérées : 
          .then (json => {
            const postsDiv = document.getElementById('postsList'); //on place le resultat dans l'element div concerné
          
            if (json.length===0) { //pas de posts
              let nothing = document.createElement("p"); //création d'un balise p avec message d'avertissement
              nothing.textContent = "Aucun post n'a été crée, mais vous pouvez être le premier!";
              postsDiv.appendChild(nothing);
            }
            
            for (let i = 0; i < json.length; i++) { //il y a des posts
              let newDiv = document.createElement("div"); //création d'une div qui vas contenir un post
              newDiv.className = "post"; 
              newDiv.addEventListener('click', () => {this.$router.push("/post/"+json[i].id);})//au clic, redirection sur getOnePost
              postsDiv.appendChild(newDiv); //div placées dans postsDiv
              
              //Affichage de la photo de profil et du pseudo en petit
              const pictureContainer = document.createElement("div");
              pictureContainer.setAttribute("class", "pictureContainer");
              newDiv.appendChild(pictureContainer);
              pictureContainer.textContent = `${json[i].pseudo} `;
              const newPicture = document.createElement("img");
              newPicture.src = json[i].picture;
              newPicture.alt = json[i].picture;
              newPicture.width = 50;
              newPicture.height = 50;
              newPicture.setAttribute("class", "picture");
              pictureContainer.appendChild(newPicture);
      
              //Date de publication du post 
              const postHour= document.createElement("p");
              const postTime = parseInt(json[i].date.substring(0,json[i].date.indexOf(':')));//appel du Datetime de la bdd
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
              newDiv.appendChild(postHour);
              
              let newTitle = document.createElement("h2");//création h2 dans newDiv, titre du post
              newTitle.textContent = json[i].title;
              newDiv.appendChild(newTitle);

              let newText = document.createElement("p"); //création p dans newDiv, texte du post
              newText.textContent = json[i].text;
              newDiv.appendChild(newText);
            }
            this.success = true; //si false message d'erreur
            })
        } else { //si echec recuperation, redirection pge login
          res.json ().then (() => {this.$router.push({ name: 'login' });})
        }
      })
    
      .catch (() => {//pb serveur, message de'rreur
      this.success= false;
      this.message = "Veuillez nous excuser, un problème de serveur est survenu! Revenez plus tard :) !";
      })
    },

    //Fonction deconnexion
    disconnection() {
      localStorage.clear(); //efface les données de l'utilisateur du pc 
      this.$router.push({ name: 'login' }); //redirection page login
    }
  }  
}
</script>


<style lang="scss">
#posts-header{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  #logo{
    width: 10%;
    height: auto;
    margin-left: 0%;
    margin-top: 0%;
  }
  ul{
    display: flex;
    flex-direction: row;
    list-style-type: none;
    li{
      margin-right: 15px;
    }
  }
  .fa-plus{
    font-size: 25px;
  }
  .fa-user-circle{
    font-size: 25px;
  }
  .link{
    color: black;
    text-decoration: none;
    font-weight: lighter;
    &:hover{
      color: red;
    }
  }
}

.hand{
  color: red;
}

.post {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 2px 2px 20px #FAA0A0; 
  margin:30px auto;
  padding:5px;
  width:60%;
  height: auto;
  background-color: white;
  transform: scale(1);
  transition: all 400ms;
  &:hover { 
    transform: scale(1.1);
  }
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

</style>