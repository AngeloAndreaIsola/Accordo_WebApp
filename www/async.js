const base_url = "https://ewserver.di.unimi.it/mobicomp/accordo/"

var sid = "dDYkswaNkBtycWDS"
var firstUse = true
var myDB

window.onload = function () {

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    // Now safe to use device APIs
    
    if (firstUse) {
      //TODO: Registrazione implicità
      //TODO: Inizializza db
      firstUse = false
    }
  }

  //CHIAMA LA WALL E LA MOSTRA
    getWall()
    //TODO: printWall()


  //CONTROLLA SE C'è IL CLICK
  // locate your element and add the Click Event Listener
  document.getElementById("parent-list").addEventListener("click", function (e) {
    // e.target is our targetted element.
    // try doing console.log(e.target.nodeName), it will result LI
    if (e.target && e.target.nodeName == "LI") {
      console.log(e.target.id + " was clicked");
      channel_name = e.target.id.substring(3, e.target.id.length - 3);
      console.log(channel_name + " was clicked");

      getChannel(channel_name)
      showscreen("#screen_canale")


    }
  });
}

function getChannel(nomeCanale) {
  //FA LA CHIAMATA
  $.ajax({
    type: "POST",
    url: base_url + "getChannel.php",
    data: JSON.stringify({
      "sid": sid,
      "ctitle": nomeCanale
    }),
    success: function (data) {
      json = JSON.parse(data);
      elenco_posts = json.posts;
      console.log("The ajax request for getChannel succeeded!");
      //console.log("The result is: ");
      //console.dir(data);


      document.getElementById("parent-list-post").innerHTML = printPost()
    },
    error: function (error) {
      console.log(error.responseText);
    }
  })
}

function showscreen(idToShow) {
  console.log("showscreen")
  $(".screen").hide()
  $(idToShow).show()
}

function printPost() {
  console.log("printPost()");
  postList = "";

  elenco_posts.forEach((item, i) => {
    uid = item.uid
    name = item.name
    type = item.type
    pid = item.pid
    pversion = item.pversion


    result = "a"
    if (result == pversion) {
      console.log("IMMAGINE GIA NEL DB");
    } else {
      //CHIAMATA IMMAGINE PROFILO
      //CHIAMATA PRENDI IMMAGINE POST
      $.ajax({
        type: "POST",
        url: base_url + "getUserPicture.php",
        data: JSON.stringify({
          "sid": sid,
          "uid": uid
        }),
        success: function (data) {
          json = JSON.parse(data);
          userPicture_img = json.content;
          userPicture_uid = json.uid
          userPicture_pversion = json.pversion

          console.log("The ajax request fro getUserPicture succeeded!");
          //console.log("The result is: ");
          //console.dir(data);


          document.getElementById("parent-list-post").innerHTML += "<li id=%22" + uid + "%22>" + userPicture_img + "</li>"
          
          
          //SALVA FOTO PROFILO

        },
        error: function (error) {
          console.log(error.responseText);
        }
      })
    }




    //LOGICA CONTENUTO POST
    if (type == "t") {
      content = item.content
      postList += "<li id=%22" + uid + "%22>" + content + "</li>";
    } else if (type == "i") {
      //postList += "<li id=%22" + uid + "%22>" + "img" + "</li>";
      if (false == true) {
        //se la hai salvata caricala
      } else {
        $.ajax({
          type: "POST",
          url: base_url + "getPostImage.php",
          data: JSON.stringify({
            "sid": sid,
            "pid": pid
          }),
          success: function (data) {
            json = JSON.parse(data);
            post_img = json.content;
            post_pid = json.pid
            console.log("The ajax request for getPostImage succeeded!");
            //console.log("The result is: ");
            //console.dir(data);


            document.getElementById("parent-list-post").innerHTML += "<li id=%22" + uid + "%22>" + "post_img" + "</li>"
            
            //SALVA FOTO POST
            
          },
          error: function (error) {
            console.log(error.responseText);
          }
        })
      }

    } else if (type == "l") {
      postList += "<li id=%22" + uid + "%22>" + "pos" + "<button></button>" + "</li>";
    }
  });

  return postList

}

function getWall(){
  var http = new XMLHttpRequest()
  $.ajax({
    type: "POST",
    url: base_url + "getWall.php",
    data: JSON.stringify({
      "sid": sid
    }),
    success: function (data) {
      json = JSON.parse(data);
      all_channels = json.channels;
      //console.log(all_channels);

      //TODO: SALVALA NEL MODEL
      document.getElementById("parent-list").innerHTML = printWall()

    },
    error: function (error) {
      console.log(error.responseText);
    }
  })
}

function printWall() {
  // Selecting the input element and get its value
  console.log("printLista()");
  nameList = "";

  all_channels.forEach((item, i) => {

    nameList += "<li id=%22" + item.ctitle + "%22 id=%22nome_canale%22>" + item.ctitle + "</li>";

  });

  return nameList
}

