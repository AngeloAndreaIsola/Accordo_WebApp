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

var sid = "dDYkswaNkBtycWDS"
//   }

function settingsBindEvents() {
    bindOnChangePictureClicked()
    bindOnBackToWallClicked()

    bindonChangeUsernameClicked()
}

function bindOnBackToWallClicked() {
    bactToWall.addEventListener('click', event => {
        event.preventDefault()

        if (event.target && event.target.nodeName == "svg") {
            console.log("DA settings.js");
            showscreen('#root')
        }

    })
}


function bindOnChangePictureClicked() {
    console.log(changePicture);
    changePicture.addEventListener('click', event => {
        event.preventDefault()

        console.log("changepicture")

    })
}



function bindonChangeUsernameClicked() {
    console.log(changePicture);
    changeUsername.addEventListener('click', event => {
        event.preventDefault()

        console.log("changename")

        favDialog.showModal();

    })

    // "Favorite animal" input sets the value of the submit button
    inputEL.addEventListener('change', function onSelect(e) {
        confirmBtn.value = inputEL.value;
    });

    // "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
    favDialog.addEventListener('close', function onClose() {
        //outputBox.value = favDialog.returnValue + " button clicked - " + (new Date()).toString();
        console.log("ReturnVAlue: " + favDialog.returnValue);

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
                $("#settingsImmagineProfilo").attr("src", "data:image/png;base64," + userData.picture)
                $("#usernameSettings").text(userData.username)

                console.log("Settings updated");
            })
        })
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