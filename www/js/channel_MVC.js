var sid = "dDYkswaNkBtycWDS"

class ModelChannel {
  constructor() {

    this._posts = []

  }

  savePosts = async (response) => {
    var json = JSON.parse(response);
    var post_list = json.posts;

    for (let element of post_list) {
      var post = {
        uid: element.uid,
        name: element.name,
        pversion: element.pversion,
        pid: element.pid,
        type: element.type,
        content: element.content,
        lat: element.lat,
        lon: element.lon,

        profileImageBis: await this.getProfileBIS(sid, element.uid, element)
      }

      //this.profileImage = this.getProfileImage(sid, element.uid, element)

      //await Promise.all(post.profileImageBis)

      console.log("porfileImage: " + post.profileImageBis);
      this._posts.push(post)
    } //);

    this.onPostListChanged(this._posts)

    console.log("All posts save into model");
    console.log(this._posts);

  }

  getPosts = (channelName) => {
    comunicationController.getChannel(sid, channelName, (response) => {
      console.log("Call %22getChannel%22 succeded");

      //salva nome canale
      this.savePosts(response)
    })
  }

  getPostImage = (sid, pid) => {
    var postImageDB
    databaseHandler.getPostImage(pid, (response) => {
      console.log("††: " + response);
      postImageDB = JSON.parse(response);

      console.log("postImageDB: " + postImageDB);
      if (postImageDB != null) {
        //load from db
        console.log("Post " + pid + " content loaded from database");

        return postImageDB.content
      } else {
        comunicationController.getPostImage(sid, pid, (response) => {
          var json = JSON.parse(response);
          var content = json.content;

          databaseHandler.savePostImage(response)

          return content
        })
      }
    })
  }

  getProfileBIS = async (sid, uid, post) => {
    console.log("GetProfileBis");
    const dbResult = await databaseHandler.getProfile(uid).then(result => {

      var json = JSON.parse(result)
      console.log("JSON in db: " + json.picture)
      //return json.picture
      return json

    })
    console.log("DBResult recived: " + dbResult);
    if (dbResult.pversion >= post.pversion){
      return dbResult.picture
    }else{
      comunicationController.getUserPicture(sid, uid, (response) => {
        var json = JSON.parse(response);
        var picture = json.picture;

        databaseHandler.saveProfileImage(response)

        //return picture
        return(picture)
      })
    }
  }



  getProfileImage = (sid, uid, post, callback) => {
    var profileDB
    databaseHandler.getProfile(uid, (response) => {
      profileDB = JSON.parse(response);

      // if ( profileDB.pversion >= post.pversion){
      if (profileDB != null && profileDB.pversion >= post.pversion) {
        console.log("Profile of " + post.name + " loaded from database");

        //return profileDB.picture
        callback(profileDB.picture)

      } else {
        comunicationController.getUserPicture(sid, uid, (response) => {
          var json = JSON.parse(response);
          var picture = json.picture;

          databaseHandler.saveProfileImage(response)

          //return picture
          callback(picture)
        })
      }
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
    this.backToWall = this.getElement('#fromChannelToWall')
    this.shareImage = this.getElement('#imageButton')

  }

  showscreen(idToShow) {
    $(".screen").hide()
    $(idToShow).show()
  }

  displayPosts(_posts, channelName) {
    console.log("Displaying posts!");

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

      // The profile image  will be in a img 
      const profileImage = this.createElement('img', 'ProfileImage')
      if (post.pversion == 0) {
        //Show default picture
        profileImage.src = "./img/default-user-image.png"
      } else {
        profileImage.src = "data:image/png;base64," + post.profileImageBis
      }


      //Display content
      const spanContennt = this.createElement('span')
      if (post.type == 't') {
        spanContennt.textContent = post.content
      } else if (post.type == 'l') {
        const posButton = this.createElement('button', "posizioneCondivisa")
        posButton.textContent = "Posizione condivisa"
        posButton.id = post.pid
        spanContennt.append(posButton)

        // Bind del bottone creato dinamicamente
        $(posButton).on("click", function () {
          //$(this).parent().remove();
          console.log("Clicked on ShowSharedPosition");
          mapHandler.sharedPosition(post.lon, post.lat)
          showscreen('#mapScreen')
        });

      } else if (post.type == 'i') {
        const postImage = this.createElement('img', "PostImage")
        postImage.src = "data:image/png;base64," + post.postImage
        spanContennt.append(postImage)
      }

      li.append(profileImage, spanName, spanContennt);

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

  bindOnSharePositionClicked(handler) {
    this.sharePosition.addEventListener('click', event => {
      event.preventDefault()

      if (event.target && event.target.nodeName == "svg") {
        handler()
      }

    })
  }

  bindOnBackToWallClicked(handler) {
    this.backToWall.addEventListener('click', event => {
      event.preventDefault()

      if (event.target && event.target.nodeName == "svg") {
        handler()
      }

    })
  }

  bindOnShareImageClicked(handler) {
    this.shareImage.addEventListener('click', event => {
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
    this.view.bindOnShareImageClicked(this.shareImageClicked)
    this.view.bindOnBackToWallClicked(this.backToWallClicked)

  }

  onPostListChanged = (_posts) => {
    this.view.displayPosts(_posts)
  }

  sharePositionClicked = () => {
    navigator.geolocation.getCurrentPosition(mapHandler.onSuccess, mapHandler.onError)
    showscreen('#mapScreen')
  }

  shareImageClicked = () => {
    console.log("Clicked on share image! That's to handle");
  }

  backToWallClicked = () => {
    console.log("Clicked on back to wall");
    showscreen('#root')
  }

  //handleClickOnCreaPost

  //handleClickOnCondividiImmgagine

  //hanndleClickOnCondividiPosizione

  //handleClickOnImmagine

  //handleClickOnBackToWall

}