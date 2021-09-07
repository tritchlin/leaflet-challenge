
// Store our API endpoint as queryUrl. 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";

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
    layer.bindPopup(
        `<h3>${feature.properties.title}</h3><hr>
        <p><strong>Date of Occurrence:</strong>${new Date(feature.properties.time)}</p>
        <p><strong>Depth in km:</strong>${(feature.geometry.coordinates[2])}</p>`);
};

d3.json(queryUrl).then(function (data) {
    // Creating a GeoJSON layer with the retrieved data
    // TODO This may need to be a logarithmic scale
    const MaxDepth = Math.max(...data.features.map(x => x.geometry.coordinates[2]));
    const MaxRadius = Math.max(...data.features.map(x => x.properties.mag))

    function getColor(d) {
        return d > 89? '#0000d1' :
               d > 69  ? '#8f2ca7' :
               d > 49  ? '#b75e88' :
               d > 29 ? '#c79171' :
               d > 9 ? '#bec762' :
                          '#89ff62';
    };

    var geolayer = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var geojsonMarkerOptions = {
                color: "black",
                weight: 1,
                fillColor: getColor(feature.geometry.coordinates[2]),
                fillOpacity: 1,
                radius: Math.log(feature.properties.mag)*10
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });

    geolayer.addTo(myMap);


var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Earthquake Depth Indicator<br>(in km)</strong></br>'],
    categories = ['-10','10','30','50','70','90'];    
        for (var i = 0; i < categories.length; i++) {
        
                div.innerHTML += 
                labels.push(
                    '<i style="background:' + getColor(categories[i]) + '"></i> ' +
                    categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] : '+'));
        
            }
            div.innerHTML = labels.join('<br>');
        return div;
        };
    legend.addTo(myMap);


    var overlayMaps = {Locations: geolayer};
    L.control.layers(baseMaps, overlayMaps, legend, {
        collapsed: false
    }).addTo(myMap);

});


// Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
// Your data markers should reflect the magnitude of the earthquake by their size and and depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.
// HINT: The depth of the earth can be found as the third coordinate for each earthquake.
// Include popups that provide additional information about the earthquake when a marker is clicked.
// Create a legend that will provide context for your map data.
// Your visualization should look something like the map above.
