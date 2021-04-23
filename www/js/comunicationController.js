var comunicationController = {

    getWall: function (sid, callback) {
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
    },

    getChannel: function (sid, nomeCanale, callback) {
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
    },

    getProfile: function (sid, callback) {
        $.ajax({
            type: "POST",
            url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "getProfile.php",
            data: JSON.stringify({
                "sid": sid
            }),
            success: callback,
            error: function (error) {
                console.log(error.responseText);
            }
        })
    },

    addChannel: function (sid, nomeCanale, callback) {
        $.ajax({
            type: "POST",
            url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "addChannel.php",
            data: JSON.stringify({
                "sid": sid,
                "ctitle": nomeCanale
            }),
            success: callback,
            error: function (error) {
                console.log(error.responseText);
            }
        })
    },

    register: function(callback) {
        $.ajax({
            type: "POST",
            url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "register.php",
            data: JSON.stringify({

            }),
            success: callback, 
            error: function (error) {
                console.log(error.responseText);
            }
        })
    }

}