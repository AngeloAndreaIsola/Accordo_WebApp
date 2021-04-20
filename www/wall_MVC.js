import {
  getWall,
  getChannel,
  getProfile,
  addChannel
} from './comunicationController.js'

var sid = "dDYkswaNkBtycWDS"

export class ModelWall {
  constructor() {

    this._channels = []

  }

  refreshWall = () => {
    getWall(sid, (response) => {
      console.log("Call %22getWall%22 succeded");

      const app = new ControllerWall(new ModelWall(), new ViewWall())
      //SALVA LISTA CANALI NEL MODEL
      app.model.saveChannels(response)
      app.view.displayChannels(app.model._channels)
    })
  }

  saveChannels = (response) => {
    this._channels = []
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

  addTodo(todoText) {
    /*
      const todo = {
        id: this._channels.length > 0 ? this._channels[this._channels.length - 1].id + 1 : 1,
        ctitle: todoText,
        mine: true,
      }
  
      this._channels.push(todo)
      */
    addChannel(sid, todoText, () => {
      console.log("Call %22addChannel%22 succeded");
      

      refreshWall()
    })

  }

  bindOnChannelListChanged(callback) {
    this.onChannelListChanged = callback
  }
  
}


export class ViewWall {
  constructor() {
    // The root element
    this.app = this.getElement('#root')

    // The title of the app
    //this.title = this.createElement('h1')
    //this.title.textContent = 'Bacheca'

    // The form, with a [type="text"] input, and a submit button
    //this.form = this.createElement('form')
    this.form= this.getElement('#form')

    //this.input = this.createElement('input')
    //this.input.type = 'text'
    //this.input.placeholder = 'Add todo'
    //this.input.name = 'todo'

    //this.submitButton = this.createElement('button')
    //this.submitButton.textContent = 'Submit'

    // The visual representation of the todo list
    this.channelList = this.createElement('ul', 'channel-list')

    // Append the input and submit button to the form
    //this.form.append(this.input, this.submitButton)

    // Append the title, form, and todo list to the app
    //this.app.append(this.title, this.form, this.channelList)
    this.app.append(this.channelList)

  }

  showscreen(idToShow) {
    $(".screen").hide()
    $(idToShow).show()
  }

  displayChannels(_channels) {

    // Delete all nodes
    while (this.channelList.firstChild) {
      this.channelList.removeChild(this.channelList.firstChild)
    }

    // Show default message

    // Create todo item nodes for each todo in state
    _channels.forEach(channel => {
      const li = this.createElement('li')
      li.id = channel.ctitle

      // The todo item text will be in a contenteditable span
      const span = this.createElement('span', 'channel_title')

      // Display the title
      span.textContent = channel.ctitle


      li.append(span);

      // Append nodes to the todo list
      this.channelList.append(li)

    })

    this.showscreen('#root')
  }

  get _todoText() {
    return this.input.value
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

  bindClickOnChannel(handler) {
    this.channelList.addEventListener('click', event => {
      console.log(event);

      console.log("target: " + event.target);
      console.log("target.nodename: " + event.target.nodeName);

      if (event.target && event.target.nodeName == "SPAN") {

        const channelName = event.target.parentElement.id
        console.log(event.target.parentElement.id + " was clicked");

        handler(channelName)
      }

    })
  }

  bindAddTodo(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault()

      if (this._todoText) {
        handler(this._todoText)
        this._resetInput()
      }
    })
  }


}

export class ControllerWall {
  constructor(model, view) {
    this.model = model
    this.view = view

    //Display initial channels
    this.onChannelListChanged(this.model._channels)

    this.model.bindOnChannelListChanged(this.onChannelListChanged)
    this.view.bindClickOnChannel(this.handleClickOnChannel)
    this.view.bindAddTodo(this.handleAddTodo)

  }

  onChannelListChanged = (_channels) => {
    this.view.displayChannels(_channels)
  }


  handleClickOnChannel = (channelName) => {

    console.log("Hai cliccato su : " + channelName);

    this.view.showscreen("#channelScreen")

  }

  handleAddTodo = (todoText) => {
    this.model.addTodo(todoText)
  }


}