
// Store our API endpoint as queryUrl. 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 3,
    layers: [street, topo]
});



// Create a baseMaps object.
var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
};


d3.json(queryUrl).then(function (data) {
    var feature = data.features
    // Creating a GeoJSON layer with the retrieved data
    // console.log(feature.feature);
    var geolayer = L.geoJson(data, {
    // console.log(data.features) });

                onEachFeature: onEachFeature,
        // Styling each feature
        style: function (feature) {
            return {
                color: "white",
                fillColor: "blue",
                fillOpacity: feature.geometry.coordinates[2],
                radius: feature.properties.mag
            };
        },
    });
    geolayer.addTo(myMap);
    var overlayMaps = {Locations: geolayer};
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
});


// Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
// Your data markers should reflect the magnitude of the earthquake by their size and and depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.
// HINT: The depth of the earth can be found as the third coordinate for each earthquake.
// Include popups that provide additional information about the earthquake when a marker is clicked.
// Create a legend that will provide context for your map data.
// Your visualization should look something like the map above.
