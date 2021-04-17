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

    if (firstUse) {
      //TODO: Registrazione implicità
      //TODO: Inizializza db
      firstUse = false
    }
  }

  //CHIAMA LA WALL
  getWall(sid, (response) => {
    console.log("Call %22getWall%22 succeded");

    //SALVA LISTA CANALI NEL MODEL
    app.model.saveChannels(response)
    app.view.displayChannels(app.model._channels)

    $('.channel_title').click(function(event){
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

  })

  /
  $('#addChannelButton').click(function(){
    console.log("CLick su addChannel");

    channelName= this.view._channelText()

    addChannel(sid, channelName, (response)=> {
      console.log("Call %22addChannel%22 succeded");

      //refresh()
    })
  })
  

}
  