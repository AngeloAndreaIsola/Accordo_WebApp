//class settings {
//   constructor() {
changeUsername = this.getElement('#settingsChangeUsername')
changePicture = this.getElement('#settingsChangePicture')
bactToWall = this.getElement('#fromSettingsToWall')

updateButton = this.getElement('#updateDetails');
favDialog = this.getElement('#favDialog');
outputBox = this.getElement('#output');
inputEL = this.getElement('#inputEL');
confirmBtn = this.getElement('#confirmBtn')

cancelBtn = this.getElement('#cancelBtn')
//cancelBtn.value = "Default username"

var sid = "dDYkswaNkBtycWDS"
var name = ""
//   }

function settingsBindEvents() {
    bindOnChangePictureClicked()
    bindOnBackToWallClicked()

    bindonChangeUsernameClicked()
}

function bindOnBackToWallClicked() {
    bactToWall.addEventListener('click', event => {
        event.preventDefault()

        //if (event.target && event.target.nodeName == "svg") {
        console.log("DA settings.js");
        showscreen('#root')
        //}

    })
}


function bindOnChangePictureClicked() {
    //console.log(changePicture);
    changePicture.addEventListener('click', event => {
        event.preventDefault()

        console.log("Click on change picture")

        openFilePicker()

    })
}



function bindonChangeUsernameClicked() {
    //console.log(changePicture);
    changeUsername.addEventListener('click', event => {
        event.preventDefault()

        console.log("changename")

        favDialog.showModal();

    })

    // "Favorite animal" input sets the value of the submit button
    inputEL.addEventListener('change', function onSelect(e) {
        confirmBtn.value = inputEL.value;
        cancelBtn.value = this.name
    });

    // "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
    favDialog.addEventListener('close', function onClose() {
        //outputBox.value = favDialog.returnValue + " button clicked - " + (new Date()).toString();


        console.log("ReturnVAlue: " + favDialog.returnValue);

        if (favDialog.returnValue == "cancel") {
            if (userData.username != null) {
                $("#usernameSettings").text(userData.username)
            } else {
                $("#usernameSettings").text("Default username")
            }
        } else {

            comunicationController.setUsername(sid, favDialog.returnValue, () => {
                comunicationController.getProfile(sid, (response) => {
                    console.log("Call %22getProfile%22 succeded");
                    console.log("Saving NEW profile...")

                    var json = JSON.parse(response);
                    var uid = json.uid;
                    var username = json.name;
                    var picture = json.picture;
                    var pversion = json.pversion;


                    userData.saveUserData(uid, username, picture, pversion)

                    //Setta profilo nelle impostazioni
                    $("#settingsImmagineProfilo").attr("src", "")

                    if (userData.pversion != 0) {
                        $("#settingsImmagineProfilo").attr("src", "data:image/png;base64," + userData.picture)
                    } else {

                        $("#settingsImmagineProfilo").attr("src", "./img/default-user-image.png")
                    }

                    $("#usernameSettings").text(userData.username)
                    this.name = userData.username

                    console.log("Settings updated");
                })
            })
        }


    });
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
    console.log("entrato nella showscreen wall mvc");
    $(".screen").hide()
    $(idToShow).show()
}
//}

function openFilePicker(selection) {

    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);
    var func = createNewFileEntry;

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        // Do something
        console.log("Getting image from gallery");
        console.log("Image URI: " + imageUri);
        var image = new Image();
        image.src = "data:image/png;base64, " + imageUri
        console.log("image = " + image);
        console.log("image.height = " + image.height);
        console.log("image.length = " + image.length);


        if (imageUri.length < 137000) {
            changeProfileImage(imageUri)
        } else {
            console.error("Profile image too large")
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

function changeProfileImage(stringImage) {
    //TODO: mettere condizioni di dimensione e formato qui
    comunicationController.setPicture(userData.sid, stringImage, () => {

        if (typeof response === 'error') {
            console.log("Error while changing profile image: " + response);

            return
        } else {
            console.log("Call %22setPicture%22 succeded");
        }


        comunicationController.getProfile(userData.sid, (response) => {
            console.log("Saving NEW profile...")

            var json = JSON.parse(response);
            var uid = json.uid;
            var username = json.name;
            var picture = json.picture;
            var pversion = json.pversion;


            userData.saveUserData(uid, username, picture, pversion)

            //Setta profilo nelle impostazioni
            $("#settingsImmagineProfilo").attr("src", "")
            $("#settingsImmagineProfilo").attr("src", "data:image/png;base64," + userData.picture)
            $("#usernameSettings").text(userData.username)
            this.name = userData.username

            console.log("Settings updated");

        })
    })
}