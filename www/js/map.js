// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken =
    'pk.eyJ1IjoiYW5nZWxvYW5kcmVhaXNvbGEiLCJhIjoiY2tqeXBzY2N5MDAwYTJucXF2Y2Y5M2ZucSJ9.nki_4-IoUMr8JzmaHAdF6Q';

backToChannel = this.getElement('#fromMapToChannel')
sharePositionBtn = this.getElement('#sharePosition')
headerPositon = this.getElement('#headerPositon')

//Target emulator: cordova run android --target="Pixel_3_API_28_x86_64_g"

var channelName
var lat, lon
var mapHandler = {
    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    onSuccess: function (position) {
        // alert('Latitude: ' + position.coords.latitude + '\n' +
        //     'Longitude: ' + position.coords.longitude + '\n' +
        //     'Altitude: ' + position.coords.altitude + '\n' +
        //     'Accuracy: ' + position.coords.accuracy + '\n' +
        //     'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
        //     'Heading: ' + position.coords.heading + '\n' +
        //     'Speed: ' + position.coords.speed + '\n' +
        //     'Timestamp: ' + position.timestamp + '\n');
        console.log("function onSuccess()");
        try {

            //mostra bottone invia
            sharePositionBtn.style.display = ""



            console.log('Latitude: ' + position.coords.latitude + '\n' + 'Longitude: ' + position.coords.longitude + '\n');

            lat = position.coords.latitude
            lon = position.coords.longitude

            //Crea mappa centrata su pos
            var map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: [position.coords.longitude, position.coords.latitude], // starting position [lng, lat]
                zoom: 5 // starting zoom
            });

            // Create a default Marker and add it to the map.
            var marker1 = new mapboxgl.Marker()
                .setLngLat([position.coords.longitude, position.coords.latitude])
                .addTo(map);
        } catch (error) {
            console.log("Map error: " + error);
        }
    },

    // onError Callback receives a PositionError object
    //
    onError: function (error) {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');

        console.error("MAP ERROR: " + error.message);
    },

    sharedPosition: function (lon, lat) {
        console.log("Function sharedPosition(lon, lat)");

        headerPositon.textContent = "Posizione condivisa"

        //Nascondi bottone invia
        sharePositionBtn.style.display = "none"

        bindEvents()

        //Crea mappa centrata su pos
        var map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [lon, lat], // starting position [lng, lat]
            zoom: 5 // starting zoom
        });

        // Create a default Marker and add it to the map.
        var marker1 = new mapboxgl.Marker()
            .setLngLat([lon, lat])
            .addTo(map);
    },

    sharePosition: function (callback) {
        console.log("sharePosition()");

        headerPositon.textContent = "La tua posizione"

        bindEvents(callback)
        channelName = getElement('#titoloCanale').textContent

       //checkIfLocationIsOn()

        //Chiama onSuccess
        var options = { enableHighAccuracy: true };
        navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, options)
        
        
        //console.log("ChannelName: " + channelName);
    }
}

function bindEvents(callback) {
    bindBackToChannelClicked()
    bindSharePosition(callback)
}

function bindBackToChannelClicked() {
    backToChannel.addEventListener('click', event => {
        event.preventDefault()

        //console.log("Target: " + event.target);
        //if (event.target && event.target.nodeName == "svg") {
        console.log("Back to channel from map");
        showscreen('#channelScreen')
        //}

    })
}

function bindSharePosition(callback) {
    sharePosition.addEventListener('click', event => {
        event.preventDefault()
        event.stopImmediatePropagation();

        console.log("Sid: " + userData.sid + "ChannelName: " + channelName + "lat: " + lat + "lon: " + lon);

        //invia posizione
        comunicationController.addPostPosition(userData.sid, channelName, lat, lon, () => {
            console.log("Call %22send position post succeded");

            callback(channelName)
        })

        showscreen('#channelScreen')

    })
}

// Retrieve an element from the DOM
function getElement(selector) {
    const element = document.querySelector(selector)

    return element
}



// function checkIfLocationIsOn(){
//     cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
//             console.log("Location is " + (enabled ? "enabled" : "disabled"));
//             if(!enabled){
//                 navigator.notification.confirm("Your GPS is switched OFF - would you like to open the Settings page to turn it ON?", 
//                     function(result){
//                         if(result == 1){ // Yes
//                             cordova.plugins.diagnostic.switchToLocationSettings();
//                         }
//                     }, "Open Location Settings?");
//             }else{
//                 if(positionWatchId){
//                     clearWatch();
//                 }
//                 addWatch();
//             }
//         }, function(error){
//             console.error("The following error occurred: "+error);
//         }
//     );
// }