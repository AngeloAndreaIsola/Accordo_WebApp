//var sid = "dDYkswaNkBtycWDS"
var sid = localStorage.getItem('sid')

class ModelWall {
  constructor() {

    this._channels = []

  }

  saveChannels = (response) => {
    var json = JSON.parse(response);
    var channels_list = json.channels;
    var tempChannelList = []

    channels_list.forEach(element => {
      var channel = {
        ctitle: element.ctitle,
        mine: element.mine
      }

      tempChannelList.push(channel)

    });
    this._channels = tempChannelList
    this.onChannelListChanged(this._channels)

    console.log("All channles save into model");
    console.log(this._channels);
  }

  refreshWallModel = () => {
    console.log("wall sid: " + sid + " this.sid= " + this.sid);
    comunicationController.getWall(sid, (response) => {
      console.log("Call %22getWall%22 succeded");

      //SALVA LISTA CANALI NEL MODEL
      this.saveChannels(response)

    })
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
     console.log("TodoText: " + todoText + " Length: " + todoText.length);
    if (todoText.length < 20) {
      comunicationController.addChannel(sid, todoText, () => {
        console.log("Adding channel: " + todoText);
        console.log("Call %22addChannel%22 succeded");

        this.refreshWallModel()
      })
    } else {
      console.log("Error: channel name can't be => 20");
    }

  }

  bindOnChannelListChanged(callback) {
    this.onChannelListChanged = callback
  }

}


class ViewWall {
  constructor() {
    // The root element
    this.app = this.getElement('#root')
    console.log("this.app= " + this.app);

    // The title of the app
    this.title = this.createElement('h1')
    this.title.textContent = 'Bacheca'

    // The form, with a [type="text"] input, and a submit button
    //this.form = this.createElement('form')
    this.form = this.getElement('#form')

    //The settings button
    this.settings = this.getElement('#settingsButton')

    //refresh button
    this.refresh = this.getElement('#refreshButton')

    //this.input = this.createElement('input')
    //this.input.type = 'text'
    //this.input.placeholder = 'Add todo'
    //this.input.name = 'todo'
    this.input = this.getElement('#inputChannel')

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
    console.log("entrato nella showscreen wall mvc");
    $(".screen").hide()
    $(idToShow).show()
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

  displayChannels(_channels) {
    console.log("entrato nella diplaychannel della wall mvc");

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
    this.form.addEventListener('click', event => {
      console.log("Clicked on add channel");

      event.preventDefault()

      if (this._todoText) {
        handler(this._todoText)
        this._resetInput()
      }
    })
  }

  bindClickOnSettings(handler) {
    this.settings.addEventListener('click', event => {
      event.preventDefault()

      if (event.target && event.target.nodeName == "svg") {
        handler()
      }

    })
  }

  bindClickOnRefresh(handler) {
    this.refresh.addEventListener('click', event => {
      event.preventDefault()

      if (event.target && event.target.nodeName == "svg") {
        handler()
      }

    })
  }


}

class ControllerWall {
  constructor(model, view) {
    this.model = model
    this.view = view

    //Display initial channels
    //this.onChannelListChanged(this.model._channels)

  
    this.model.bindOnChannelListChanged(this.onChannelListChanged)

    this.view.bindClickOnChannel(this.handleClickOnChannel)
    this.view.bindAddTodo(this.handleAddTodo)
    this.view.bindClickOnSettings(this.handleClickOnSettings)
    this.view.bindClickOnRefresh(this.handleCLickOnRefresh)

  }

  onChannelListChanged = (_channels) => {
    console.log("Channel list changed");
    this.view.displayChannels(_channels)
  }


  handleClickOnChannel = (channelName) => {

    console.log("WALL_MVC: Hai cliccato su : " + channelName);

    var appc = new ControllerChannel(new ModelChannel(), new ViewChannel())

    appc.model.getPosts(channelName)

    this.view.showscreen("#channelScreen")

  }

  handleAddTodo = (todoText) => {
    this.model.addTodo(todoText)
  }

  handleClickOnSettings = () => {
    this.view.showscreen('#settingsScreen')
  }

  handleCLickOnRefresh = () => {
    this.model.refreshWallModel()
  }

}