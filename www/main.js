const base_url = "https://ewserver.di.unimi.it/mobicomp/accordo/"
import {getWall} from './comunicationController.js'


var sid = "dDYkswaNkBtycWDS"
var firstUse = true

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
      getWall(sid)
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