export class ModelChannel {
  constructor() {

    this._posts = []


  }


  savePosts = (response) => {



    var json = JSON.parse(response);
    var post_list = json.posts;

    post_list.forEach(element => {
      var post = {
        uid: element.uid,
        name: element.name,
        pversion: element.pversion,
        pid: element.pid,
        type: element.type,
        content: element.content,
        lat: element.lat,
        lon: element.lon
      }
      this._posts.push(post)
    });
    console.log("All posts save into model");
    console.log(this._posts);
  }

  bindOnPostListChanged(callback) {
    this.onPostListChanged = callback
  }
}

export class ViewChannel {
  constructor() {
    // The root element
    this.app = this.getElement('#channelScreen')

    // The title of the app
    //this.title = this.createElement('h1')
    //this.title.textContent = 'Canale'

    // The form, with a [type="text"] input, and a submit button
    this.form = this.createElement('form')

    this.input = this.createElement('input')
    this.input.type = 'text'
    this.input.placeholder = 'Aggiungi post'
    this.input.name = 'post'

    this.submitButton = this.createElement('button')
    this.submitButton.textContent = 'Submit'

    // The visual representation of the todo list
    this.postList = this.createElement('ul', 'post-list')

    // Append the input and submit button to the form
    this.form.append(this.input, this.submitButton)

    // Append the title, form, and todo list to the app
    this.app.append(this.form, this.postList) //this.title,

  }

  showscreen(idToShow) {
    $(".screen").hide()
    $(idToShow).show()
  }

  displayPosts(_posts, channelName) {

    // The root element
    this.app = this.getElement('#channelScreen')

    // The title of the app
    this.title = this.createElement('h1')
    this.title.textContent = channelName
    this.app.prepend(this.title)

    // Delete all nodes
    while (this.postList.firstChild) {
      this.postList.removeChild(this.postList.firstChild)
    }

    // Show default message

    // Create todo item nodes for each todo in state
    _posts.forEach(post => {
      const li = this.createElement('li')
      li.id = post.pid

      // The todo item text will be in a contenteditable span
      const spanName = this.createElement('span')
      const spanContennt = this.createElement('span')

      // Display the name
      spanName.textContent = post.name
      spanContennt.textContent = post.content

      li.append(spanName, spanContennt);

      // Append nodes to the todo list
      this.postList.append(li)

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

export class ControllerChannel {
  constructor(model, view) {
    this.model = model
    this.view = view

    //Display initial channels
    this.onPostListChanged(this.model._posts)

    this.model.bindOnPostListChanged(this.onPostListChanged)

  }

  onPostListChanged = (_posts) => {
    this.view.displayPosts(_posts)
  }

}