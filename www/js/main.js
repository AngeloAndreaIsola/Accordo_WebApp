const base_url = "https://ewserver.di.unimi.it/mobicomp/accordo/"

import {
  getWall,
  getChannel,
  getProfile,
  addChannel
} from './comunicationController.js'


import {
  ModelWall,
  ViewWall,
  ControllerWall
} from './wall_MVC.js'

import {
  ModelChannel,
  ViewChannel,
  ControllerChannel
} from './channel_MVC.js'


var sid = "dDYkswaNkBtycWDS"
var firstUse = true


const app = new ControllerWall(new ModelWall(), new ViewWall())
const appc = new ControllerChannel(new ModelChannel(), new ViewChannel())



window.onload = function () {

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    // Now safe to use device APIs

    if (firstUse==true) {
      //TODO: Registrazione implicitàs

      //TODO: Inizializza db
      createDatabase()

      firstUse = false
    }
  }

  //Setta profilo nelle impostazioni
  getProfile(sid, (response)=> {
    console.log("Call %22getWall%22 succeded");

    var json = JSON.parse(response);
    var username = json.name;
    var picture = json.picture;

    $("#usernameSettings").text("")
    $("#usernameSettings").text(username)

    $("#settingsImmagineProfilo").attr("src","")
    $("#settingsImmagineProfilo").attr("src", "data:image/png;base64," + picture)
    //$("settingsImmagineProfilo").attr('<img src="data:image/png;base64,' + picture + '">')

    console.log("Settings inizialaized");
  })
  
  //Prende e mostra wall
  getWall(sid, (response) => {
    console.log("Call %22getWall%22 succeded");

    //SALVA LISTA CANALI NEL MODEL
    app.model.saveChannels(response)
    app.view.displayChannels(app.model._channels)


    $('.channel_title').click(function (event) {
      console.log("CLICK DA MAIN");

      if (event.target && event.target.nodeName == "SPAN") {

        const channelName = event.target.parentElement.id
        console.log(event.target.parentElement.id + " MAIN: was clicked");

        getChannel(sid, channelName, (response) => {
          console.log("Call %22getChannel%22 succeded");
          console.log(response);

          appc.model.savePosts(response)
          appc.view.displayPosts(appc.model._posts, channelName)
        })

      }
      
    })

    $('#settingsButton').click(function (event) {
      console.log("Click su settings");
      console.log(event.target);
      console.log(event.target.nodeName);

      if (event.target && event.target.nodeName == "svg") {


        console.log(event.target.parentElement.id + " MAIN: was clicked");

        showscreen('#settings')

      }

    })

    $('#fromSettingsToWall').click(function (event){
      if (event.target && event.target.nodeName == "svg") {

        showscreen('#root')

      }
    })

    $('#fromChannelToWall').click(function (event){
      if (event.target && event.target.nodeName == "svg") {

        showscreen('#root')

      }
    })

    $('#mapButton').click(function (event){
      if (event.target && event.target.nodeName == "svg") {

        //TODO: Crea il bottone invia

        showscreen('#mapScreen')

      }
    })

    $('#fromMapToChannel').click(function (event){
      if (event.target && event.target.nodeName == "svg") {

        showscreen('#channelScreen')

      }
    })




  })



}


function showscreen(idToShow) {
  $(".screen").hide()
  $(idToShow).show()
}

function createDatabase() {
  console.log('create db');
  try {
    if (window.openDatabase) {
      var shortName = 'db_edentiti';
      var version = '1.0';
      var displayName = 'Edentiti Information';
      var maxSize = 65536; // in bytes
      db = openDatabase(shortName, version, displayName, maxSize);
      alert('Sqlite Database created');
      console.log('Sqlite Database created');
    }
  } catch (e) {
    alert(e);
  }
}