const base_url = "https://ewserver.di.unimi.it/mobicomp/accordo/"

// import {
//   getWall,
//   getChannel,
//   getProfile,
//   addChannel
// } from './comunicationController.js'


// import {
//   ModelWall,
//   ViewWall,
//   ControllerWall
// } from './wall_MVC.js'

// import {
//   ModelChannel,
//   ViewChannel,
//   ControllerChannel
// } from './channel_MVC.js'


var sid = "dDYkswaNkBtycWDS"
var firstUse = true






//window.onload = function () {

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    // Now safe to use device APIs

    // if (firstUse == true) {
    //TODO: Registrazione implicitàs

    //TODO: Inizializza db
    //databaseHandler.createDatabase();


    //   firstUse = false
    // }


    $(document).on("ready", function () {
      console.log("READY");
      createDatabase();

      const app = new ControllerWall(new ModelWall(), new ViewWall())
      const appc = new ControllerChannel(new ModelChannel(), new ViewChannel())


      //Setta profilo nelle impostazioni
      getProfile(sid, (response) => {
        console.log("Call %22getWall%22 succeded");

        var json = JSON.parse(response);
        var username = json.name;
        var picture = json.picture;

        $("#usernameSettings").text("")
        $("#usernameSettings").text(username)

        $("#settingsImmagineProfilo").attr("src", "")
        $("#settingsImmagineProfilo").attr("src", "data:image/png;base64," + picture)
        //$("settingsImmagineProfilo").attr('<img src="data:image/png;base64,' + picture + '">')

        console.log("Settings inizialaized");
      })

      //Prende e mostra wall
      getWall(sid, (response) => {
        console.log("Call %22getWall%22 succeded");

        //SALVA LISTA CANALI NEL MODEL
        app.model.saveChannels(response)
        app.view.displayChannels(app.model._channels)


        $('.channel_title').click(function (event) {
          console.log("CLICK DA MAIN");

          if (event.target && event.target.nodeName == "SPAN") {

            const channelName = event.target.parentElement.id
            console.log(event.target.parentElement.id + " MAIN: was clicked");

            getChannel(sid, channelName, (response) => {
              console.log("Call %22getChannel%22 succeded");
              console.log(response);

              appc.model.savePosts(response)
              appc.view.displayPosts(appc.model._posts, channelName)
            })

          }

        })
      });




      $('#settingsButton').click(function (event) {
        console.log("Click su settings");
        console.log(event.target);
        console.log(event.target.nodeName);

        if (event.target && event.target.nodeName == "svg") {


          console.log(event.target.parentElement.id + " MAIN: was clicked");

          showscreen('#settings')

        }

      })

      $('#fromSettingsToWall').click(function (event) {
        if (event.target && event.target.nodeName == "svg") {

          showscreen('#root')

        }
      })

      $('#fromChannelToWall').click(function (event) {
        if (event.target && event.target.nodeName == "svg") {

          showscreen('#root')

        }
      })

      $('#mapButton').click(function (event) {
        if (event.target && event.target.nodeName == "svg") {

          //TODO: Crea il bottone invia

          showscreen('#mapScreen')

        }
      })

      $('#fromMapToChannel').click(function (event) {
        if (event.target && event.target.nodeName == "svg") {

          showscreen('#channelScreen')

        }
      })


      function showscreen(idToShow) {
        $(".screen").hide()
        $(idToShow).show()
      }

      function createDatabase() {
        console.log("Creating database...");

        database = window.sqlitePlugin.openDatabase({
          name: 'my.db',
          location: 'default'
        });

        database.transaction(function (tx) {
            tx.executeSql("create table if not exists product(_id integer primary key, name text, quantity integer)",
              function (tx, results) {},
              function (tx, error) {
                console.log("Error while creating the table: " + error.message);
              }
            );

            tx.executeSql('CREATE TABLE IF NOT EXISTS Post (uid INTEGER PRIMARY KEY, pid INTEGER PRIMARY KEY, username Text, pversion INTEGER NOT NULL, type TEXT NOT NULL)',
              function (tx, results) {},
              function (tx, error) {
                console.log("Error while creating the table: " + error.message);
              }
            );

            tx.executeSql('CREATE TABLE IF NOT EXISTS Profile_img (uid INTEGER PRIMARY KEY, pversion INTEGER NOT NULL, profile_image_content TEXT)',
              function (tx, results) {},
              function (tx, error) {
                console.log("Error while creating the table: " + error.message);
              }
            );

            tx.executeSql('CREATE TABLE IF NOT EXISTS Post_img (pid INTEGER PRIMARY KEY, post_image_content TEXT)',
              function (tx, results) {},
              function (tx, error) {
                console.log("Error while creating the table: " + error.message);
              }
            );

          },
          function (error) {
            console.log("Transaction error: " + error.message);
          },
          function () {
            console.log("Create DB transaction completed successfully");
          }
        );
      }

    })

    document.getElementById('deviceready').classList.add('ready');
  }
//}




// var databaseHandler = {
//   db: null,
//   createDatabase: function () {
//     console.log("Creating database");
//     this.db = window.openDatabase(
//       "accordo.db",
//       "1.0",
//       "database immagini accordo",
//       1000000);
//     this.db.transaction(
//       function (tx) {
//         //Run sql here using tx
//         tx.executeSql("create table if not exists product(_id integer primary key, name text, quantity integer)",
//           function (tx, results) {},
//           function (tx, error) {
//             console.log("Error while creating the table: " + error.message);
//           }
//         );

//         tx.executeSql('CREATE TABLE IF NOT EXISTS Post (uid INTEGER PRIMARY KEY, pid INTEGER PRIMARY KEY, username Text, pversion INTEGER NOT NULL, type TEXT NOT NULL)',
//         function (tx, results) {},
//           function (tx, error) {
//             console.log("Error while creating the table: " + error.message);
//           }
//         );

//         tx.executeSql('CREATE TABLE IF NOT EXISTS Profile_img (uid INTEGER PRIMARY KEY, pversion INTEGER NOT NULL, profile_image_content TEXT)',
//         function (tx, results) {},
//           function (tx, error) {
//             console.log("Error while creating the table: " + error.message);
//           }
//         );

//         tx.executeSql('CREATE TABLE IF NOT EXISTS Post_img (pid INTEGER PRIMARY KEY, post_image_content TEXT)',
//           function (tx, results) {},
//           function (tx, error) {
//             console.log("Error while creating the table: " + error.message);
//           }
//         );

//       },
//       function (error) {
//         console.log("Transaction error: " + error.message);
//       },
//       function () {
//         console.log("Create DB transaction completed successfully");
//       }
//     );

//   }
// }