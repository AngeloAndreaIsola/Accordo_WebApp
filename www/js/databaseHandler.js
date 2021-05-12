var databaseHandler = {
  db: null,

  createDatabase: function () {
    console.log("Creating database...");
    this.db = window.openDatabase(
      "accordo.db",
      "1.0",
      "database immagini accordo",
      1000000);
    this.db.transaction(
      function (tx) {
        //Run sql here using tx

        // tx.executeSql("create table if not exists product(_id integer primary key, name text, quantity integer)", [],
        //   function (tx, results) {},
        //   function (tx, error) {
        //     console.log("Error while creating the table 1: " + error.message);
        //   }
        // );

        tx.executeSql('CREATE TABLE IF NOT EXISTS Post (uid INTEGER, pid INTEGER PRIMARY KEY, username Text, pversion INTEGER NOT NULL, type TEXT NOT NULL)', [],
          function (tx, results) {},
          function (tx, error) {
            console.log("Error while creating the table 2: " + error.message);
          }
        );

        tx.executeSql('CREATE TABLE IF NOT EXISTS Profile_img (uid INTEGER PRIMARY KEY, pversion INTEGER NOT NULL, profile_image_content TEXT)', [],
          function (tx, results) {},
          function (tx, error) {
            console.log("Error while creating the table 3: " + error.message);
          }
        );

        tx.executeSql('CREATE TABLE IF NOT EXISTS Post_img (pid INTEGER PRIMARY KEY, post_image_content TEXT)', [],
          function (tx, results) {},
          function (tx, error) {
            console.log("Error while creating the table 4: " + error.message);
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

  },

  getProfile: function (uid, callback) {

    return promise = new Promise((resolve, reject) => {
      this.db.transaction(function (transaction) {

        transaction.executeSql('SELECT * FROM Profile_img WHERE EXISTS(SELECT 1 FROM Profile_img WHERE uid=?)', [uid], function (tx, results) {

          console.log("DB: Checking if uid "+uid+ " exists in db...");

          for (var k = 0; k < results.rows.length; k++) {

            var row = results.rows.item(k);
          }

          console.log(row);
          if (row == undefined) {
            console.log("DB: Rejeting");
            reject()
          } else {

            transaction.executeSql('SELECT * FROM Profile_img WHERE uid=?', [uid], function (tx, results) { //

              console.log("DB: Retriving profile of: " + uid);
    
              if (results != null && results.rows != null) {
    
                for (var k = 0; k < results.rows.length; k++) {
    
                  var row = results.rows.item(k);
    
                  //newJson += '{ "Field0":"' + row.uid + '", "Field1":"' + row.profile_image_content + '", "Field2":"' + row.Field2 + '", "Field3":"' + row.Field3 + '", "Field4":"' + row.Field4 + '", "Field5":"' + row.Field5 + '"},'
    
                  profileJSON = JSON.stringify({
                    "uid": row.uid,
                    "pversion": row.pversion,
                    "picture": row.profile_image_content
                  })
    
                  //console.log("DB: ProfileJSON " + profileJSON);
                  if (profileJSON == undefined) {
                    console.error("DB: error while fetching profile picture, results: " + results + ", results.rows: " + results.rows);
                    reject()
                  } else {
                    console.log("DB: resolving for: " + profileJSON);
                    resolve(profileJSON)
                  }
                }
              } 
        
              //callback(profileJSON);
              // return new Promise((resolve, reject) => {
              //   resolve(profileJSON)
              // })
            }, function (tx, error) {
              console.error("DB: Error while retrieving profile picture: " + error.message);
            });

          }

        })
      });
    })


  },

  getPostImage: function (pid, callback) {
    this.db.transaction(function (transaction) {
      transaction.executeSql('SELECT post_image_content FROM Post WHERE pid=?', [pid], function (tx, results) {
        console.log("DB: getpostimage result: " + results);

        results.forEach(result => {
          console.log("GETPOSTIMAGERESULT" + result.post_image_content);
        });

        callback(results);
      }, null);
    });

  },

  savePostImage: function (response) {
    //console.log("DB: savePost response: " + response);
    var json = JSON.parse(response);
    pid = json.pid
    content = json.content

    this.db.transaction(function (transaction) {
      transaction.executeSql('INSERT INTO Post_img (pid, post_image_content) VALUES (?, ?)', [pid, content], function (tx, results) {
          console.log("DB: Post " + pid + " content inserted");
        },
        function (error) {
          console.log("DB: ERROR! while inserting post " + pid + " error: " + error);
        });
    });
  },

  saveProfileImage: function (response) {

    //console.log("DB: saveProfileImage response: " + response);
    var json = JSON.parse(response);
    uid = json.uid
    picture = json.picture
    pversion = json.pversion

    this.db.transaction(function (transaction) {
      transaction.executeSql('INSERT INTO Profile_img (uid, profile_image_content, pversion) VALUES (?, ?, ?)', [uid, picture, pversion], function (tx, results) {
          console.log("DB: Post " + uid + " content inserted");
        },
        function (error) {
          console.log("DB: ERROR! while inserting profile image " + uid + " error: " + error.message);
        });
    });
  },

  callbackGetProfile: function (response) {
    return response
  },

  callbackGetPostImage: function (response) {
    return response
  }

}

/*
    @Query("SELECT image_content FROM content_images WHERE image_pid=:pid")
    String getContentImage(int pid);

    @Query("SELECT version FROM profile_images WHERE profile_uid=:uid")
    int getProfileVersion(int uid);

    @Query("SELECT `Profile Image` FROM profile_images WHERE profile_uid=:uid")
    String getProfileContent(int uid);

    @Update
    void updatePosts(Post... posts);

    @Insert (onConflict = OnConflictStrategy.REPLACE)
    void addContentImage(PostContentImage postContentImage);

    @Insert (onConflict = OnConflictStrategy.REPLACE)
    void addPostProfileImage(PostProfileImage profileImage);
*/

// myDB = window.sqlitePlugin.openDatabase({
//   name: 'my.db',
//   location: 'default'
// })
// myDB.transaction(function (transaction) {
//   transaction.executeSql('CREATE TABLE IF NOT EXISTS codesundar (id integer primary key, title text, desc text)', [],
//     function (tx, result) {
//       alert("Table created successfully");
//     },
//     function (error) {
//       alert("Error occurred while creating the table.");
//     });
// });

// let quries =
//   myDB.sqlBatch([
//     'CREATE TABLE Post (uid INTEGER PRIMARY KEY, pid INTEGER PRIMARY KEY, username Text, pversion INTEGER NOT NULL, type TEXT NOT NULL)',
//     'CREATE TABLE Profile_img (uid INTEGER PRIMARY KEY, pversion INTEGER NOT NULL, profile_image_content TEXT)',
//     'CREATE TABLE Post_img (pid INTEGER PRIMARY KEY, post_image_content TEXT)'
//   ], function () {
//     console.log('Populated database OK');
//   }, function (error) {
//     console.log('SQL batch ERROR: ' + error.message);
//   })