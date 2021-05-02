// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken =
    'pk.eyJ1IjoiYW5nZWxvYW5kcmVhaXNvbGEiLCJhIjoiY2tqeXBzY2N5MDAwYTJucXF2Y2Y5M2ZucSJ9.nki_4-IoUMr8JzmaHAdF6Q';

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

        console.log('Latitude: ' + position.coords.latitude + '\n' + 'Longitude: ' + position.coords.longitude + '\n');

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
    },

    // onError Callback receives a PositionError object
    //
    onError: function (error) {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    },

    sharedPosition: function (lon, lat) {
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
    }
}