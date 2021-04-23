 const getWall = (sid, callback) => {
    var http = new XMLHttpRequest()
    $.ajax({
        type: "POST",
        url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "getWall.php",
        data: JSON.stringify({
            "sid": sid
        }),
        success: callback,
        error: function (error) {
            console.log(error.responseText);
        }
    })
}

 const getChannel = (sid, nomeCanale, callback) => {
    $.ajax({
        type: "POST",
        url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "getChannel.php",
        data: JSON.stringify({
            "sid": sid,
            "ctitle": nomeCanale
        }),
        success: callback,
        error: function (error) {
            console.log(error.responseText);
        }
    })
}

 function getProfile(sid, callback) {
    $.ajax({
        type: "POST",
        url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "getProfile.php",
        data: JSON.stringify({
            "sid": sid
        }),
        success: callback,
        /*
        success: function (data) {
            json = JSON.parse(data);
            console.log("The ajax request for %22getProfile%22 succeeded!");
            console.log("The result is: ");
            console.dir(data);

            return json
        },
        */
        error: function (error) {
            console.log(error.responseText);
        }
    })
}

 function addChannel(sid, nomeCanale) {
    $.ajax({
        type: "POST",
        url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "addChannel.php",
        data: JSON.stringify({
            "sid": sid,
            "ctitle": nomeCanale
        }),
        /*
        success: function (data) {
            json = JSON.parse(data);
            console.log("The ajax request for %22addChannel%22 succeeded!");
            console.log("The result is: ");
            console.dir(data);

            return json
        },
        */
        error: function (error) {
            console.log(error.responseText);
        }
    })
}