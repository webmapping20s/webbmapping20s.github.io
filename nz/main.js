let mapdiv = document.querySelector("#map");

let map = L.map("map", {
    center: [
        mapdiv.dataset.lat,
        mapdiv.dataset.lng
    ],
    zoom: 17,
    layers: [
        L.tileLayer.provider("OpenTopoMap")
    ]
});

let mrk = L.marker([
    mapdiv.dataset.lat,
    mapdiv.dataset.lng
]).addTo(map);

mrk.bindPopup(mapdiv.dataset.title).openPopup();