//window.onload = function () {

    //document.addEventListener("deviceready", onDeviceReady, false);


    //function onDeviceReady() {
        
        function register() {
            $.ajax({
                type: "POST",
                url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "register.php",
                data: JSON.stringify({

                }),
                success: function (data) {
                    json = JSON.parse(data);
                    console.log("The ajax request for %22register%22 succeeded!");
                    console.log("The result is: ");
                    console.dir(data);

                    return json
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })
        }

        function getProfile(sid) {
            $.ajax({
                type: "POST",
                url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "getProfile.php",
                data: JSON.stringify({
                    "sid": sid
                }),
                success: function (data) {
                    json = JSON.parse(data);
                    console.log("The ajax request for %22getProfile%22 succeeded!");
                    console.log("The result is: ");
                    console.dir(data);

                    return json
                },
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
                success: function (data) {
                    json = JSON.parse(data);
                    console.log("The ajax request for %22addChannel%22 succeeded!");
                    console.log("The result is: ");
                    console.dir(data);

                    return json
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })
        }

         export const getWall = (sid) => {
            var http = new XMLHttpRequest()

            $.ajax({
                type: "POST",
                url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "getWall.php",
                data: JSON.stringify({
                    "sid": sid
                }),
                success: function (data) {
                    var json = JSON.parse(data);
                    var all_channels = json.channels;
                    console.log("The ajax request for %22getWall%22 succeeded!");

                    return json
                    //console.log(all_channels);

                    //TODO: SALVALA NEL MODEL

                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })
        }

        function addPost(sid, nomeCanale, type, content, lat, lon) {
            var http = new XMLHttpRequest()
            $.ajax({
                type: "POST",
                url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "addPost.php",
                data: JSON.stringify({
                    "sid": sid,
                    "ctitle": nomeCanale,
                    "type": type,
                    "content": content,
                    "lat": lat,
                    "lon": lon
                }),
                success: function (data) {
                    console.log("The ajax request for %22addPost%22 succeeded!");
                    return json
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })
        }

        function getChannel(nomeCanale) {
            $.ajax({
                type: "POST",
                url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "getChannel.php",
                data: JSON.stringify({
                    "sid": sid,
                    "ctitle": nomeCanale
                }),
                success: function (data) {
                    json = JSON.parse(data);
                    elenco_posts = json.posts;
                    console.log("The ajax request for %22getChannel%22 succeeded!");
                    //console.log("The result is: ");
                    //console.dir(data);
                    return json
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })
        }

        function getPostImage(sid, pid) {
            var http = new XMLHttpRequest()
            $.ajax({
                type: "POST",
                url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "getPostImage.php",
                data: JSON.stringify({
                    "sid": sid,
                    "pid": pid
                }),
                success: function (data) {
                    json = JSON.parse(data);
                    console.log("The ajax request for %22getPostImagel%22 succeeded!");

                    return json
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })
        }

        function getUserPicture(sid, uid) {
            var http = new XMLHttpRequest()
            $.ajax({
                type: "POST",
                url: 'https://ewserver.di.unimi.it/mobicomp/accordo/' + "getUserPicture.php",
                data: JSON.stringify({
                    "sid": sid,
                    "uid": uid
                }),
                success: function (data) {
                    json = JSON.parse(data);
                    console.log("The ajax request for %22getUserPicture%22 succeeded!");

                    return json
                },
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