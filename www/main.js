const base_url = "https://ewserver.di.unimi.it/mobicomp/accordo/"
import {
  getWall
} from './comunicationController.js'


var sid = "dDYkswaNkBtycWDS"
var firstUse = true


class Model {
  constructor() {

    this._channels = []

    /*
       this._channels = [
          {ctitle: 'CANALE INSERISTO STATICAMENTE 1', mine: 'f'},
          {ctitle: 'CANALE INSERISTO STATICAMENTE 2', mine: 't'},
        ]
    */

    //console.log(_channels);
  }

  saveChannels = (response) => {
    var json = JSON.parse(response);
    var channels_list = json.channels;

    channels_list.forEach(element => {
      var channel = {
        ctitle: element.ctitle,
        mine: element.mine
      }
      this._channels.push(channel)
    });
    console.log("All channles save into model");
    console.log(this._channels);
  }
}


class View {
  constructor() {
    // The root element
    this.app = this.getElement('#root')

    // The title of the app
    this.title = this.createElement('h1')
    this.title.textContent = 'Bacheca'

    // The form, with a [type="text"] input, and a submit button
    this.form = this.createElement('form')

    this.input = this.createElement('input')
    this.input.type = 'text'
    this.input.placeholder = 'Add channel'
    this.input.name = 'channel'

    this.submitButton = this.createElement('button')
    this.submitButton.textContent = 'Submit'

    // The visual representation of the todo list
    this.channelList = this.createElement('ul', 'channel-list')

    // Append the input and submit button to the form
    this.form.append(this.input, this.submitButton)

    // Append the title, form, and todo list to the app
    this.app.append(this.title, this.form, this.channelList)

  }

  displayTodos(_channels) {
    console.log("_channels da displayTodos: "+_channels);

    var channels = [
      {ctitle: 'CANALE INSERISTO STATICAMENTE 1', mine: 'f'},
      {ctitle: 'CANALE INSERISTO STATICAMENTE 2', mine: 't'},
    ]

    // Delete all nodes
    while (this.channelList.firstChild) {
      this.channelList.removeChild(this.channelList.firstChild)
    }

    // Show default message

    // Create todo item nodes for each todo in state
    _channels.forEach(channel => {                         
      const li = this.createElement('li')
      console.log("CHANNEL.CTITLE"+channel.ctitle);
      li.id = channel.ctitle

      // The todo item text will be in a contenteditable span
      const span = this.createElement('span')

      // Display the title
      span.textContent = channel.ctitle
      

      li.append(span);

      // Append nodes to the todo list
      this.channelList.append(li)

    })
  }

  _resetInput() {
    this.input.value = ''
  }

  // Create an element with an optional CSS class
  createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)

    return element
  }

  // Retrieve an element from the DOM
  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }
}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view
  }
}

console.log("1");
const app = new Controller(new Model(), new View())
console.log("2");



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
  var listaCanali = getWall(sid, (response) => {
    console.log("Call %22getWall%22 succeded");

    //SALVA LISTA CANALI NEL MODEL
    app.model.saveChannels(response)
    app.view.displayTodos(app.model._channels)

  })

}