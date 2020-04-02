
let startLayer = L.tileLayer.provider("Esri.WorldTopoMap");

let map = L.map("map", {
    center: [0,0],
    zoom: 2,
    layers: [
        startLayer
    ]
});

L.control.layers({
    "OpenTopoMap" : L.tileLayer.provider("OpenTopoMap"),
    "OpenStreetMap.Mapnik" : L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Stamen.TonerLite" : L.tileLayer.provider("Stamen.TonerLite"),
    "Stamen.Watercolor" : L.tileLayer.provider("Stamen.Watercolor"),
    "Stamen.Terrain" : L.tileLayer.provider("Stamen.Terrain"),
    "Stamen.TerrainBackground" : L.tileLayer.provider("Stamen.TerrainBackground"),
    "Esri.WorldStreetMap": L.tileLayer.provider("Esri.WorldStreetMap"),
    "Esri.WorldTopoMap": startLayer,
    "Esri.WorldImagery": L.tileLayer.provider("Esri.WorldImagery"),
    "Esri.WorldPhysical": L.tileLayer.provider("Esri.WorldPhysical"),
    "Esri.WorldGrayCanvas": L.tileLayer.provider("Esri.WorldGrayCanvas"),
    "CartoDB.Positron": L.tileLayer.provider("CartoDB.Positron"),
}).addTo(map)