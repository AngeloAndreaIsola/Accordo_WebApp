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

  }
}

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