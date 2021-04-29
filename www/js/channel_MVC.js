var sid = "dDYkswaNkBtycWDS"

  class ModelChannel {
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

      this.onPostListChanged(this._posts)

      console.log("All posts save into model");
      console.log(this._posts);
    }

    getPosts = (channelName) => {
      comunicationController.getChannel(sid, channelName, (response)=> {
         console.log("Call %22getChannel%22 succeded");

         this.savePosts(response)
      })
    }

    bindOnPostListChanged(callback) {
      this.onPostListChanged = callback
    }
  }

  class ViewChannel {
    constructor() {
      // The root element
      this.app = this.getElement('#channelScreen')

      // The title of the app
      //this.title = this.createElement('h1')
      //this.title.textContent = 'Canale'


      // The form, with a [type="text"] input, and a submit button
      //this.form = this.createElement('form')
      this.form = this.getElement('#channelForm')

      //this.input = this.createElement('input')
      //this.input.type = 'text'
      //this.input.placeholder = 'Aggiungi post'
      //this.input.name = 'post'

      //this.submitButton = this.createElement('button')
      //this.submitButton.textContent = 'Submit'

      // The visual representation of the todo list
      //this.postList = this.createElement('ul', 'post-list')
      this.postList = this.getElement('#post-list')

      // Append the input and submit button to the form
      //this.form.append(this.input, this.submitButton)

      // Append the title, form, and todo list to the app
      //this.app.append(this.postList) //this.title, this.form,
      //this.postList.insertAfter('#topChannel')
      //$('#post-list').insertAfter('#topChannel')

      this.sharePosition = this.getElement('#mapButton')

    }

    showscreen(idToShow) {
      $(".screen").hide()
      $(idToShow).show()
    }

    displayPosts(_posts, channelName) {

      // The root element
      this.app = this.getElement('#channelScreen')

      // The title of the app
      //this.title = this.createElement('h1')
      this.title = this.getElement('#titoloCanale')
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


        // Display the name
        spanName.textContent = post.name


        //Display content
        const spanContennt = this.createElement('span')
        if (post.type == 't') {
          spanContennt.textContent = post.content
        } else if (post.type == 'l') {
          const posButton = this.createElement('button', "posizioneCondivisa")
          posButton.textContent = "Posizione condivisa"
          spanContennt.append(posButton)
        } else if (post.type == 'i') {
          spanContennt.textContent = "IMMAGINE"
        }

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

    bindOnSharePositionClicked (handler){
      this.sharePosition.addEventListener('click', event => {
        event.preventDefault()
  
        if (event.target && event.target.nodeName == "svg") {
          handler()
        }
  
      })
    }

  }

  class ControllerChannel {
    constructor(model, view) {
      this.model = model
      this.view = view

      //Display initial channels
      this.onPostListChanged(this.model._posts)

      this.model.bindOnPostListChanged(this.onPostListChanged)
      
      this.view.bindOnSharePositionClicked(this.sharePositionClicked)

    }

    onPostListChanged = (_posts) => {
      this.view.displayPosts(_posts)
    }

    sharePositionClicked = () =>{
      showscreen('#mapScreen')
    }

    //handleClickOnPosizioneCondivisa

    //handleClickOnCreaPost

    //handleClickOnCondividiImmgagine

    //hanndleClickOnCondividiPosizione

    //handleClickOnImmagine

    //handleClickOnBackToWall

  }