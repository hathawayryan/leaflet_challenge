var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
// Perform a GET request to the query URL
d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });


// function createFeatures(earthquakeData) {

//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) {
//     layer.bindPopup("<h3>" + feature.properties.place +
//       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//   }

//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
//   });

//   // Sending our earthquakes layer to the createMap function
//   createMap(earthquakes);
// }



function createFeatures(earthquakeData) {

  var earthquakeMarkers = [];

  for (var index = 0; index < earthquakeData.length; index++){
    var earthquake = earthquakeData[index]

    var color = "";
    if (earthquake.geometry.coordinates[2] >= 90) {
      color = "tomato";
    }
    else if (earthquake.geometry.coordinates[2] >= 70) {
      color = "sandybrown";
    }
    else if (earthquake.geometry.coordinates[2] >= 50) {
      color = "goldenrod";
    }
    else if (earthquake.geometry.coordinates[2] >= 30) {
      color = "gold";
    }
    else if (earthquake.geometry.coordinates[2] >= 10) {
      color = "#dbf403";
    }
    else {
      color = "#a2f600";
    }

    var earthquake_circle = L.circle([earthquake.geometry.coordinates[1], 
      earthquake.geometry.coordinates[0]], {
      fillOpacity: 1,
      weight: 2,
      color: "black",
      fillColor: color,
      // Adjust radius
      radius: earthquake.properties.mag * 20000
    }).bindPopup("<h3>" + earthquake.properties.place +
    "</h3><hr><p>" + new Date(earthquake.properties.time) + "</p>");


    earthquakeMarkers.push(earthquake_circle);
  }


  // // Define a function we want to run once for each feature in the features array
  // // Give each feature a popup describing the place and time of the earthquake
  // function onEachFeatre(feature, layer) {
  //   layer.bindPopup("<h3>" + feature.properties.place +
  //     "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  // }

  // // Create a GeoJSON layer containing the features array on the earthquakeData object
  // // Run the onEachFeature function once for each piece of data in the array
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeatre
  // });

  // Sending our earthquakes layer to the createMap function
  createMap(new L.LayerGroup(earthquakeMarkers));
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  
  var legend = new L.control({ position: "bottomright"  });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    div.innerHTML += '<i style="background: #a2f600"></i><span>-10-10</span><br>';
    div.innerHTML += '<i style="background: #dbf403"></i><span>10-30</span><br>';
    div.innerHTML += '<i style="background: gold"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: goldenrod"></i><span>50-70</span><br>';
    div.innerHTML += '<i style="background: sandybrown"></i><span>70-90</span><br>';
    div.innerHTML += '<i style="background: tomato"></i><span>90+</span><br>';
  

    return div;
  };

  legend.addTo(myMap);
}

