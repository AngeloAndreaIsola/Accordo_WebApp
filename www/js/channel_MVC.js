//var sid = "dDYkswaNkBtycWDS"
var sid = userData.sid

class ModelChannel {
  constructor() {

    this._posts = []
    this._channelName = ''

  }

  savePosts = async (response, channelName) => {
    this._channelName = channelName

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

        profileImageBis: await this.getProfileBIS(sid, element.uid, element),

        postImage: null
      }

      if (post.type == 'i') {
        post.postImage = await this.getPostImageBIS(sid, element.pid, element)
      }

      this._posts.push(post)
    } //);

    this.onPostListChanged(this._posts, this._channelName)

    console.log("All posts save into model");
    console.log(this._posts);

  }

  getPosts = (channelName) => {
    comunicationController.getChannel(sid, channelName, (response) => {
      console.log("Call %22getChannel%22 succeded");

      //salva nome canale
      this.savePosts(response, channelName)
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


        console.log("PostImage content: " + postImageDB.content);
        return postImageDB.content
      } else {
        comunicationController.getPostImage(sid, pid, (response) => {
          var json = JSON.parse(response);
          var content = json.content;

          databaseHandler.savePostImage(response)

          console.log("PostImage content: " + content);
          return content
        })
      }
    })
  }

  getPostImageBIS = async (sid, pid, post) => {
    console.log("GetPostImageBIS");
    try {
      const dbResult = await databaseHandler.getPostImage(pid).then(result => {

        var json = JSON.parse(result)
        //console.log("JSON in db: " + json.picture)
        //return json.picture
        return json

      })

      if (dbResult != undefined) {
        console.log("POST DBResult recived");
        console.log("POST DBResult: " + dbResult);
        return dbResult.content
      } else {
        console.Error("POST DBResult undefined: " + dbResult);
      }


    } catch (error) {
      console.log("ERROR: " + error);
      console.log("POST DBResult not recived, calling API");
      var pic = await this.getPostImageFromAPI(sid, pid)
      return pic
    }
  }

  getPostImageFromAPI = (sid, pid) => {
    return promise = new Promise((resolve, reject) => {
      console.log("Calling API to get profile...");
      comunicationController.getPostImage(sid, pid, (response) => {
        console.log("Call %getPostImage%22 succeded");
        var json = JSON.parse(response);
        var content = json.content;

        console.log("Saving post image in DB");
        databaseHandler.savePostImage(response)

        //return picture
        resolve(content)
      })
    })
  }

  getProfileBIS = async (sid, uid, post) => { // se aspetta qua non fa vedre i canali dove c'è una immagine profilo, prova a cambiare aggiungetdo try e cart e reject di db
    console.log("GetProfileBis");

    try {
      const dbResult = await databaseHandler.getProfile(uid).then(result => {

        var json = JSON.parse(result)
        //console.log("JSON in db: " + json.picture)
        //return json.picture
        return json

      })

      if (dbResult != undefined) {
        console.log("PROFILE DBResult recived");
      } else {
        console.Error("PROFILE DBResult undefined: " + dbResult);
      }

      console.log("pversion: " + post.pversion + " db pversion: " + dbResult.pversion);
      if (dbResult.pversion >= post.pversion) {
        return dbResult.picture
      } else {
        throw 'pversion saved is outdated'
      }
    } catch (error) {
      console.log("PROFILE ERROR: " + error);
      console.log("PROFILE DBResult not recived, calling API");
      var pic = await this.getProfileFromAPI(sid, uid)
      return pic
    }
  }

  getProfileFromAPI = (sid, uid) => {
    return promise = new Promise((resolve, reject) => {
      console.log("Calling API to get profile...");
      comunicationController.getUserPicture(sid, uid, (response) => {
        console.log("Call %22getProfile%22 succeded");
        var json = JSON.parse(response);
        var picture = json.picture;

        console.log("Saving profile in DB");
        databaseHandler.saveProfileImage(response)

        //return picture
        resolve(picture)
      })
    })
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

  addPostText(textContent) {
    console.log("PostText content: " + textContent);
    if (textContent.length < 100) {
      console.log("Sending text post");
      comunicationController.addPostText(sid, this._channelName, textContent, () => {
        this.getPosts(this._channelName)
      })
    } else {
      console.log("Error: post text content can't be longer than 100 charaters");
    }
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
    this.form = this.getElement('#postForm')

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

    this.postInput = this.getElement('#postInput')
    this.sendPost = this.getElement('#sendPost')

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
    //this.app.prepend(this.title)

    // Delete all nodes
    while (this.postList.firstChild) {
      this.postList.removeChild(this.postList.firstChild)
    }

    // Show default message

    // Create todo item nodes for each todo in state
    _posts.forEach(post => {
      const li = this.createElement('li', "post")
      li.id = "post_" + post.pid

      // The todo item text will be in a contenteditable span
      const spanName = this.createElement('span')


      // Display the username
      if (post.name == null){
        spanName.textContent = "Default username"
      }else{
        spanName.textContent = post.name
      }


      // The profile image  will be in a img 
      const profileImage = this.createElement('img', 'ProfileImage')
      if (post.pversion == 0) {
        //Show default picture
        profileImage.src = "./img/default-user-image.png"
        profileImage.style = "max-width: 50px; max-height: 50px"
      } else {
        try {
          profileImage.src = "data:image/png;base64," + post.profileImageBis
          profileImage.style = "max-width: 50px; max-height: 50px"
        } catch (error) {
          postImage.src = "./img/brokeImage.png"
          profileImage.style = "max-width: 50px; max-height: 50px"
        }
      }


      //Display content
      const spanContennt = this.createElement('span', 'postContent')
      if (post.type == 't') {
        spanContennt.textContent = post.content
      } else if (post.type == 'l') {
        const posButton = this.createElement('button', "posizioneCondivisa")
        posButton.textContent = "Posizione condivisa"
        posButton.id = post.pid
        spanContennt.append(posButton)

        //Controlla che la pos sia valida
        if (!(post.lon >= -90 && post.lon <= 90 && post.lat >= -180 && post.lat <= 180)) {
          
          $(posButton).disabled = true
        } else {
          // Bind del bottone creato dinamicamente
          $(posButton).on("click", function () {
            //$(this).parent().remove();
            console.log("Clicked on ShowSharedPosition");
            mapHandler.sharedPosition(post.lon, post.lat)
            showscreen('#mapScreen')
          });
        }

      } else if (post.type == 'i') {
        const postImage = this.createElement('img', "PostImage")

        try {
          postImage.src = "data:image/png;base64," + post.postImage //"./img/default-user-image.png"
          postImage.style = "max-width:300px max-height:100%;"
        } catch (error) {
          postImage.src = "./img/brokeImage.png"
          postImage.style = "max-width:200px max-height:200px;"
        }

        spanContennt.append(postImage)
      }

      li.append(profileImage, spanName, spanContennt);

      // Append nodes to the todo list
      this.postList.append(li)

    })
  }

  get _postText() {
    return this.postInput.value
  }

  _resetInput() {
    this.postInput.value = ''
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
      console.log("Click on back to wall");
      //if (event.target && event.target.nodeName == 'i') {
        handler()
      //}

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

  bindAddPostText(handler) {
    this.form.addEventListener('click', event => {
      console.log("Clicked on add post text");

      event.preventDefault()

      console.log("this._postText: " + this._postText);

      if (this._postText) {
        handler(this._postText)
        this._resetInput
      }
    })
  }

  bindOnImageClicked(handler) {
    getElement('#post-list').addEventListener("click", function (e) {
      // e.target is the clicked element!
      // If it was a list item
      if (e.target && e.target.className == "PostImage") {
        // List item found!  Output the ID!
        console.log("Post image clicked");

        //Prendo il contenuto del post immagine
        var imageContent = e.target.getAttribute('src')

        handler(imageContent)
      }
    });
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
    this.view.bindAddPostText(this.handleAddPostText)
    this.view.bindOnImageClicked(this.handleClickOnImmagine)

  }

  onPostListChanged = (_posts, channelName) => {
    this.view.displayPosts(_posts, channelName)
  }

  sharePositionClicked = () => {
    //navigator.geolocation.getCurrentPosition(mapHandler.onSuccess, mapHandler.onError)
    mapHandler.sharePosition()
    showscreen('#mapScreen')
  }

  shareImageClicked = () => {
    console.log("Clicked on share image! That's to handle");
    openFilePickerChannel(this.model)
  }

  backToWallClicked = () => {
    console.log("Clicked on back to wall");
    showscreen('#root')
  }

  handleAddPostText = (text) => {
    this.model.addPostText(text)
  }

  //handleClickOnCreaPost

  //handleClickOnCondividiImmgagine

  //hanndleClickOnCondividiPosizione

  handleClickOnImmagine = (imageContent) => {
    var bigImage = getElement('#bigImage')
    bigImage.src = imageContent

   var back = getElement('#fromImageToChannel')
    back.addEventListener('click', event =>{
      showscreen('#channelScreen')
    })

    showscreen('#imageScreen')
  }
}

function openFilePickerChannel(model) { //selection,

  var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
  var options = setOptions(srcType);
  var func = createNewFileEntry;

  navigator.camera.getPicture(function cameraSuccess(imageUri) {

    // Do something
    console.log("Getting image from gallery from channel");
    console.log("Image URI: " + imageUri);

    sendPostImage(imageUri, model._channelName, model)

  }, function cameraError(error) {
    console.debug("Unable to obtain picture: " + error, "app");

  }, options);
}

function setOptions(srcType) {
  var options = {
    // Some common settings are 20, 50, and 100
    quality: 50,
    destinationType: Camera.DestinationType.DATA_URL,
    // In this app, dynamically set the picture source, Camera or photo gallery
    sourceType: srcType,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    allowEdit: true,
    correctOrientation: true
  }
  return options;
}

function createNewFileEntry(imgUri) {
  window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {

    // JPEG file
    dirEntry.getFile("tempFile.jpeg", {
      create: true,
      exclusive: false
    }, function (fileEntry) {

      // Do something with it, like write to it, upload it, etc.
      // writeFile(fileEntry, imgUri);
      console.log("got file: " + fileEntry.fullPath);
      // displayFileData(fileEntry.fullPath, "File copied to");

    }, onErrorCreateFile);

  }, onErrorResolveUrl);
}

function sendPostImage(stringImage, channelName, model) {
  //TODO: mettere condizioni di dimensione e formato qui
  comunicationController.addPostImage(sid, channelName, stringImage, (response) => {

    console.log("Call %22addPostImage%22 succeded");

    model.getPosts(channelName)
  })
}