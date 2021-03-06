/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

var sid = "dDYkswaNkBtycWDS"
//var sid //userData.sid

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    settingsBindEvents()

    if (localStorage.getItem("firstUse") == null) {
        localStorage.setItem("firstUse", false);



        console.log("First run!")

        //Registrazione implicita
        userImplicitRegistration();


    } else {

        //Carica i dati che ha gia del profilo
        userData.loadUserData()
        console.log("sid: " + userData.sid);

        // Test
        var modal = new Modal();
        var consoleView = new View(modal);
        var controller = new Controller(modal, consoleView);
        //consoleView.pressButton();
        //consoleView.pressButton("JS dominates the web world");
        //consoleView.pressButton("JQuery is a useful library of JS");
        controller.getWall()
        controller.updateView()
    }



    //Salva il resto del profilo
    comunicationController.getProfile(userData.sid, (response) => {
        console.log("Call %22getProfile%22 succeded");
        console.log("Saving profile...")

        var json = JSON.parse(response);
        var uid = json.uid;
        var username = json.name;
        var picture = json.picture;
        var pversion = json.pversion;


        userData.saveUserData(uid, username, picture, pversion)

        //Setta profilo nelle impostazioni
        if (pversion == 0 || picture == null) {
            $("#settingsImmagineProfilo").attr("src", "./img/default-user-image.png")
        } else {
            $("#settingsImmagineProfilo").attr("src", "")
            $("#settingsImmagineProfilo").attr("src", "data:image/png;base64," + userData.picture)
        }

        if (username == null) {
            $("#usernameSettings").text("Default username")
        } else {
            $("#usernameSettings").text(userData.username)
        }


        //Collega gli eventi
        //settingsBindEvents()

        console.log("Settings inizialaized");

    })

    //inizializza database
    databaseHandler.createDatabase();

    //Il model fa la chiamata, salva, notifica la view che mostra
    // const app = new ControllerWall(new ModelWall(), new ViewWall())
    // app.model.refreshWallModel()


    showscreen('#root')

}

function userImplicitRegistration() {
    comunicationController.register((response) => {

        console.log("Call %22register%22 succeded");
        console.log("register resposne: " + response);

        //Salva sid
        var json = JSON.parse(response);
        sidJ = json.sid;
        userData.saveSid(sidJ)
        sid = this.sid

        userData.loadUserData()
        console.log("sid: " + userData.sid);
        sid = userData.sid

        // Test
        var modal = new Modal();
        var consoleView = new View(modal);
        var controller = new Controller(modal, consoleView);
        //consoleView.pressButton();
        //consoleView.pressButton("JS dominates the web world");
        //consoleView.pressButton("JQuery is a useful library of JS");

        controller.getWall()
        controller.updateView()
    })
}

function showscreen(idToShow) {
    $(".screen").hide()
    $(idToShow).show()
}