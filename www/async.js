const base_url = "https://ewserver.di.unimi.it/mobicomp/accordo/"

var sid = "dDYkswaNkBtycWDS"

window.onload = function () {
  console.log("sid " + sid);
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
      console.log(all_channels);

      document.getElementById("parent-list").innerHTML = printLista()

    },
    error: function (error) {
      console.log(error.responseText);
    }
  })

  //CONTROLLA SE C'è IL CLICK
  // locate your element and add the Click Event Listener
  document.getElementById("parent-list").addEventListener("click", function (e) {
    // e.target is our targetted element.
    // try doing console.log(e.target.nodeName), it will result LI
    if (e.target && e.target.nodeName == "LI") {
      console.log(e.target.id + " was clicked");
      cn = e.target.id.substring(3, e.target.id.length - 3);
      console.log(cn + " was clicked");
      //goToChannel(e.target.id)

      getChannel(cn)
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
      console.log("The ajax request succeeded!");
      console.log("The result is: ");
      console.dir(data);


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

function goToChannel(nomeCanale) {
  document.getElementById("p2").innerHTML = nomeCanale
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
      console.log("The ajax request succeeded!");
      console.log("The result is: ");
      console.dir(data);


      document.getElementById("p2").innerHTML = printPost()
    },
    error: function (error) {
      console.log(error.responseText);
    }
  })
  showscreen("#screen_canale")
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

    //LOGICA IMMAGINE PROFILO
    if (false){
      //SE HA LA FOTO LA CARICA
    }else{
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

          console.log("The ajax request succeeded!");
          console.log("The result is: ");
          console.dir(data);


          document.getElementById("parent-list-post").innerHTML += "<li id=%22" + uid + "%22>" + userPicture_img + "</li>"
          //TODO: SALVA FOTO
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
      if (false==true) {
        //se la hai salvata caricala
        console.log("foto post caricata da DB");
      } else {
        //CHIAMATA PRENDI IMMAGINE POST
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
            console.log("The ajax request succeeded!");
            console.log("The result is: ");
            console.dir(data);


            document.getElementById("parent-list-post").innerHTML += "<li id=%22" + uid + "%22>" + "post_img" + "</li>"
                      //TODO: SALVA FOTO
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

function printLista() {
  // Selecting the input element and get its value
  console.log("printLista()");
  nameList = "";

  all_channels.forEach((item, i) => {

    nameList += "<li id=%22" + item.ctitle + "%22 class=%22nome_canale%22>" + item.ctitle + "</li>";

  });

  return nameList
}