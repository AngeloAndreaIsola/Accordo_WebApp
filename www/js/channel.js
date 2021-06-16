var sid = localStorage.getItem('sid')

function ModelChannel(channelName) {
    this.channelName = channelName
    var listeners = [];
    var posts = []
    // To retrieve the data
    this.getData = function () {
        return posts;
    };

    this.savePosts = async function (response) {
        console.log("Saving posts");
        var json = JSON.parse(response);
        var posts_list = json.posts;

        for (let element of posts_list) {
            var post = {
                uid: element.uid,
                name: element.name,
                pversion: element.pversion,
                pid: element.pid,
                type: element.type,
                content: element.content,
                lat: element.lat,
                lon: element.lon,

                profileImageBis: await getProfileBIS(sid, element.uid, element),

                //postImage: null
            }

            if (post.type == 'i') {
                post.postImage = await getPostImageBIS(sid, element.pid, element)
            }

            posts.push(post)

        };
        console.log("All posts save into model");
        console.log(posts);
        notifyAllObservers()


    }


    // Notifies all observers
    function notifyAllObservers() {
        var i;
        for (i = 0; i < listeners.length; i++) {
            listeners[i].notify();
        }
    }
    // Requires to register all observers
    this.addObserver = function (listener) {
        listeners.push(listener);
    };
}

function ViewChannel(m) {
    this.modal = m;

    // The root element
    this.app = getElement('#channelScreen')

    // The title of the app
    //this.title = this.createElement('h1')
    //this.title.textContent = 'Canale'


    // The form, with a [type="text"] input, and a submit button
    //this.form = this.createElement('form')
    this.form = getElement('#postForm')

    //this.input = this.createElement('input')
    //this.input.type = 'text'
    //this.input.placeholder = 'Aggiungi post'
    //this.input.name = 'post'

    //this.submitButton = this.createElement('button')
    //this.submitButton.textContent = 'Submit'

    // The visual representation of the todo list
    //this.postList = this.createElement('ul', 'post-list')
    this.postList = getElement('#post-list')

    // Append the input and submit button to the form
    //this.form.append(this.input, this.submitButton)

    // Append the title, form, and todo list to the app
    //this.app.append(this.postList) //this.title, this.form,
    //this.postList.insertAfter('#topChannel')
    //$('#post-list').insertAfter('#topChannel')

    this.title = getElement('#titoloCanale')
    this.title.textContent = m.channelName
    //this.app.prepend(this.title)

    this.sharePosition = getElement('#mapButton')
    this.backToWall = getElement('#fromChannelToWall')
    this.shareImage = getElement('#imageButton')

    this.postInput = getElement('#postInput')
    this.sendPost = getElement('#sendPost')

    this.display = function () {
        var posts = this.modal.getData();

        // Delete all nodes
        while (this.postList.firstChild) {
            this.postList.removeChild(this.postList.firstChild)
        }

        //for (post = 0; post < posts.length; i++)
        posts.forEach(post => {

            const li = createElement('li', "post")
            li.id = "post_" + post.pid

            // The todo item text will be in a contenteditable span
            const spanName = createElement('span')


            // Display the username
            if (post.name == null) {
                spanName.textContent = "Default username"
            } else {
                spanName.textContent = post.name
            }


            // The profile image  will be in a img 
            const profileImage = createElement('img', 'ProfileImage')
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
            const spanContennt = createElement('span', 'postContent')
            if (post.type == 't') {
                spanContennt.textContent = post.content
            } else if (post.type == 'l') {
                const posButton = createElement('button', "posizioneCondivisa")
                posButton.textContent = "Posizione condivisa"
                posButton.id = post.pid
                spanContennt.append(posButton)

                //Controlla che la pos sia valida
                if (!(post.lat >= -90 && post.lat <= 90 && post.lon >= -180 && post.lon <= 180)) {
                    console.log("NOT VALID => lon: " + post.lon + " lat: " + post.lat);
                    $(posButton).disabled = true
                } else {
                    // Bind del bottone creato dinamicamente
                    posButton.addEventListener("click", event => {
                        event.preventDefault()
                        //$(this).parent().remove();
                        console.log("Clicked on ShowSharedPosition, lon: " + post.lon +  " lat: " + post.lat);
                        console.log("Maphandler: " + mapHandler);
                        mapHandler.sharedPosition(post.lon, post.lat)
                        showscreen('#mapScreen')
                    });
                }

            } else if (post.type == 'i') {
                const postImage = createElement('img', "PostImage")

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

        $('.post').on("click", function () {
            console.log("Click on post: " + $(this).text());

        });

        $(this.shareImage).unbind('click').click(function(event){    //addEventListener('click', event => {
            console.log("ShareImage()");

            openFilePickerChannel(m.channelName)

            event.preventDefault()
            event.stopPropagation()
        })

        this.backToWall.addEventListener('click', event => {
            event.preventDefault()


            //if (event.target && event.target.nodeName == 'i') {
            console.log("Clicked on back to wall");
            showscreen('#root')
            //}
            event.stopPropagation()

        })

        this.form.addEventListener('click', event => {
            console.log("Clicked on add post text");

            console.log("this._postText: " + this.postInput.value);
            var titolo = getElement('#titoloCanale').textContent

            if (this.postInput.value) {

                //handler(this._postText, this.title.textContent)
                console.log("m.channelName = "+ m.channelName+"; this.modal.channelName="+ this.modal.channelName+"; channelName=" + channelName);

                if (this.postInput.value.length < 100) {
                    console.log("Sending text post: " + this.postInput.value + " on: " + titolo);
                    comunicationController.addPostText(sid,  titolo, this.postInput.value, () => {
                        //this.modal.getPosts(channelName)
                    })
                } else {
                    console.log("Error: post text content can't be longer than 100 charaters");
                }



                console.log("Post = " + this.postInput.value);
                this.postInput.value = ''
            }

            event.preventDefault()
            event.stopPropagation()
        })

        this.sharePosition.addEventListener('click', event => {

            event.preventDefault()
            event.stopPropagation()

            console.log('click on map button');
            mapHandler.sharePosition((channelName) => {
                console.log("Callback channel for position, channelName: " + channelName);
                //this.model.getPosts(channelName)
            })
            showscreen('#mapScreen')
        })


        getElement('#post-list').addEventListener("click", function (e) {
            // e.target is the clicked element!
            // If it was a list item
            if (e.target && e.target.className == "PostImage") {
                // List item found!  Output the ID!
                console.log("Post image clicked");

                //Prendo il contenuto del post immagine
                var imageContent = e.target.getAttribute('src')

                var bigImage = getElement('#bigImage')
                bigImage.src = imageContent

                var back = getElement('#fromImageToChannel')
                back.addEventListener('click', event => {
                    showscreen('#channelScreen')
                })

                showscreen('#imageScreen')
            }
        });



    };

}

function ControllerChannel(m, v) {

    this.view = v;
    this.modal = m;
    this.modal.addObserver(this);

    // Updates the view
    this.updateView = function () {
        console.log("Updating view");
        this.view.display();
    };
    // When notifies by the modal send the request of update 
    this.notify = function () {
        // state has changed
        this.updateView();
    };

    this.getPosts = function () {
        comunicationController.getChannel(sid, m.channelName, (response) => {
            console.log("Call %22getChannel%22 succeded for channel: " + m.channelName);

            //SALVA LISTA posts NEL MODEL
            m.savePosts(response)

        })
    }

    // function getPosts() {
    //     comunicationController.getChannel(sid, m.channelName, (response) => {
    //         console.log("Call %22getChannel%22 succeded for channel: " + channelName);

    //         //SALVA LISTA posts NEL MODEL
    //         m.savePosts(response)

    //     })
    // }



}

// Create an element with an optional CSS class
function createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)

    return element
}

// Retrieve an element from the DOM
function getElement(selector) {
    const element = document.querySelector(selector)

    return element
}

function showscreen(idToShow) {
    $(".screen").hide()
    $(idToShow).show()
}

function getProfileFromAPI(sid, uid) {
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

async function getProfileBIS(sid, uid, post) { // se aspetta qua non fa vedre i canali dove c'è una immagine profilo, prova a cambiare aggiungetdo try e cart e reject di db
    //console.log("GetProfileBis");

    try {
        const dbResult = await databaseHandler.getProfile(uid).then(result => {

            var json = JSON.parse(result)
            //console.log("JSON in db: " + json.picture)
            //return json.picture
            return json

        })

        if (dbResult != undefined) {
            // console.log("PROFILE DBResult recived");
        } else {
            //console.Error("PROFILE DBResult undefined: " + dbResult);
        }

        //console.log("pversion: " + post.pversion + " db pversion: " + dbResult.pversion);
        if (dbResult.pversion >= post.pversion) {
            return dbResult.picture
        } else {
            throw 'pversion saved is outdated'
        }
    } catch (error) {
        //console.log("PROFILE ERROR: " + error);
        //console.log("PROFILE DBResult not recived, calling API");
        var pic = await this.getProfileFromAPI(sid, uid)
        return pic
    }
}

async function getPostImageBIS(sid, pid, post) {
    //console.log("GetPostImageBIS");
    try {
        const dbResult = await databaseHandler.getPostImage(pid).then(result => {

            var json = JSON.parse(result)
            //console.log("JSON in db: " + json.picture)
            //return json.picture
            return json

        })

        if (dbResult != undefined) {
            //console.log("POST DBResult recived");
            //console.log("POST DBResult: " + dbResult);
            console.log("Post fetched from DB");
            return dbResult.content
        } else {
            //console.Error("POST DBResult undefined: " + dbResult);
        }


    } catch (error) {
        //console.log("ERROR: " + error);
        //console.log("POST DBResult not recived, calling API");
        var pic = await this.getPostImageFromAPI(sid, pid)
        return pic
    }
}

function getPostImageFromAPI(sid, pid) {
    return promise = new Promise((resolve, reject) => {
        //console.log("Calling API to get profile...");
        comunicationController.getPostImage(sid, pid, (response) => {
            //console.log("Call %getPostImage%22 succeded");
            var json = JSON.parse(response);
            var content = json.content;

            //console.log("Saving post image in DB");
            databaseHandler.savePostImage(response)

            //return picture
            resolve(content)
        })
    })
}

function openFilePickerChannel(channelName) { //selection,

    console.log("openFilePickerChannel");
    var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
    var options = setOptions(srcType);
    var func = createNewFileEntryChannel;

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        // Do something
        console.log("Getting image from gallery for channel");
        console.log("Image URI: " + imageUri);

        if (imageUri.length < 137000){
            sendPostImage(imageUri, channelName)
        }else{
            console.error("Image too large");
        }


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

function createNewFileEntryChannel(imgUri) {
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

function sendPostImage(stringImage, channelName) {
    //TODO: mettere condizioni di dimensione e formato qui
    comunicationController.addPostImage(sid, channelName, stringImage, () => {

        console.log("Call %22addPostImage%22 succeded for channel: " + channelName);

        //model.getPosts(channelName)
    })
}