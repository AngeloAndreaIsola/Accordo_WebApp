//window.onload = function () {

    //document.addEventListener("deviceready", onDeviceReady, false);


    //function onDeviceReady() {
        
         export const getWall = (sid, callback) => {
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
        export const getChannel = (nomeCanale) => {
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

        



    //}

//}

//export const getWall;

//export {getWall};

//module.getWall = this.getWall;