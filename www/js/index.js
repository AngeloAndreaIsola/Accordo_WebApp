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

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');


    if (localStorage.getItem("firstUse") == null) {
        localStorage.setItem("firstUse", false);



        console.log("First run!")

        //Registrazione implicita
        userImplicitRegistration();



    }

    //Salva il resto del profilo
    comunicationController.getProfile(sid, (response) => {
        console.log("Call %22getProfile%22 succeded");
        console.log("Saving profile...")

        var json = JSON.parse(response);
        var uid = json.uid;
        var name = json.name;
        var picture = json.picture;
        var pversion = json.pversion;

        userData.saveUserData(uid, name, picture, pversion)
    })

    //Setta profilo nelle impostazioni

    //inizializza database
    databaseHandler.createDatabase();


    //Chiamata alla wall
    const app = new ControllerWall(new ModelWall(), new ViewWall())
    const appc = new ControllerChannel(new ModelChannel(), new ViewChannel())
    comunicationController.getWall(sid, (response) => {
        console.log("Call %22getWall%22 succeded");
        console.log("getWall resposne: " + response);

        //Salva canali nel model
        app.model.saveChannels(response)

        //Mostra canali salvati
        app.view.displayChannels(app.model._channels)

        //Al click reindirizza al canale
        $('.channel_title').click(function (event) {
            console.log("CLICK DA MAIN");

            if (event.target && event.target.nodeName == "SPAN") {

                const channelName = event.target.parentElement.id
                console.log(event.target.parentElement.id + " MAIN: was clicked");

                comunicationController.getChannel(sid, channelName, (response) => {
                    console.log("Call %22getChannel%22 succeded");
                    console.log(response);

                    appc.model.savePosts(response)
                    appc.view.displayPosts(appc.model._posts, channelName)
                })

            }

        })

    });
}

function userImplicitRegistration() {
    comunicationController.register((response) => {

        console.log("Call %22register%22 succeded");
        console.log("register resposne: " + response);

        //Salva sid
        var json = JSON.parse(response);
        var sid = json.sid;
        userData.saveSid(sid) //TODO: SID NON SI SALVA IN MODO PESISTENTE
    })
}

function showscreen(idToShow) {
    $(".screen").hide()
    $(idToShow).show()
}