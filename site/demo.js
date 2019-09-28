/**
 * Takes a snapshot of the map.
 *
 * @param {Element} resultContainer Reference to DOM Element to show the captured map area
 * @param {H.Map} map Reference to initialized map object
 * @param {H.ui.UI} ui Reference to UI component
 */

//import {addDomMarker} from './marker.js';


function drawMarkersJSON(map, data) {
  for(let i = 0; i < data.features.length; i++){
    let lat = data.features[i].geometry.coordinates[0];
    let lng = data.features[i].geometry.coordinates[1];
    var imageMarker = new H.map.Marker(new H.geo.Point(lat,lng),
    {
      //icon: new H.map.Icon('map-marker.png')
    });
    map.addObject(imageMarker);
  }
}

function capture(resultContainer, map, ui) {
  // Capturing area of the map is asynchronous, callback function receives HTML5 canvas
  // element with desired map area rendered on it.
  // We also pass an H.ui.UI reference in order to see the ScaleBar in the output.
  // If dimensions are omitted, whole veiw port will be captured
  map.capture(function(canvas) {
    if (canvas) {
      resultContainer.innerHTML = '';
      resultContainer.appendChild(canvas);
    } else {
      // For example when map is in Panorama mode
      resultContainer.innerHTML = 'Capturing is not supported';
    }
  }, [ui], 50, 50, 500, 200);
}

/**
 * Boilerplate map initialization code starts below:
 */
// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

var mapContainer = document.getElementById('map');

// Step 2: initialize a map
var map = new H.Map(mapContainer, defaultLayers.vector.normal.map, {
  // initial center and zoom level of the map
  zoom: 16,
  // Champs-Elysees
  center: {lat: 48, lng: 2},
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: Create the default UI
var ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');


// Step 6: Create "Capture" button and place for showing the captured area
var resultContainer = document.getElementById('panel');


// устанавливаем центр карты на текущее положение пользователя
var reqLoc = fetch("https://freegeoip.app/json/").then(res => {
  res.json().then(data=>{
    var geoPoint = new H.geo.Point(data.latitude, data.longitude);
    map.setCenter(geoPoint);
  })
})
// построение 
var reqLoc = fetch("https://api.myjson.com/bins/c267l").then(res => {
  res.json().then(data=>{
    console.log(data.features[0]);
    drawMarkersJSON(map, data);
  })
})



