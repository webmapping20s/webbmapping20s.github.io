let startLayer = L.tileLayer.provider("Esri.WorldTopoMap");

let map = L.map("map", {
    center: [30, 0],
    zoom: 2,
    layers: [
        startLayer
    ]
});

let circleGroup = L.featureGroup().addTo(map);

L.control.layers({
    "OpenTopoMap": L.tileLayer.provider("OpenTopoMap"),
    "OpenStreetMap.Mapnik": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Stamen.TonerLite": L.tileLayer.provider("Stamen.TonerLite"),
    "Stamen.Watercolor": L.tileLayer.provider("Stamen.Watercolor"),
    "Stamen.Terrain": L.tileLayer.provider("Stamen.Terrain"),
    "Stamen.TerrainBackground": L.tileLayer.provider("Stamen.TerrainBackground"),
    "Esri.WorldStreetMap": L.tileLayer.provider("Esri.WorldStreetMap"),
    "Esri.WorldTopoMap": startLayer,
    "Esri.WorldImagery": L.tileLayer.provider("Esri.WorldImagery"),
    "Esri.WorldPhysical": L.tileLayer.provider("Esri.WorldPhysical"),
    "Esri.WorldGrayCanvas": L.tileLayer.provider("Esri.WorldGrayCanvas"),
    "CartoDB.Positron": L.tileLayer.provider("CartoDB.Positron")
}, {
    "Thematische Darstellung": circleGroup
}).addTo(map);

let drawCircles = function () {
    let data = CONFIRMED;
    let header = CONFIRMED[0];
    let index = document.querySelector("#slider").value;
    let options = document.querySelector("#pulldown").options;
    let value = options[options.selectedIndex].value;
    let label = options[options.selectedIndex].text;
    let color;
    //console.log(value,label,options);

    if (value === "confirmed") {
        data = CONFIRMED;
        color = "#0074D9";
    } else if (value === "deaths") {
        data = DEATHS;
        color = "#B10DC9";
    } else {
        data = RECOVERED;
        color = "#2ECC40";
    }

    // Datum & Thema anzeigen anzeigen
    document.querySelector("#datum").innerHTML = `am ${header[index]} - ${label}`;

    circleGroup.clearLayers();

    data.sort(function compareNumbers(row1,row2) {
        return row2[index] - row1[index];
    });

    //console.log(data);
    for (let i = 1; i < data.length; i++) {
        let row = data[i];
        //console.log(row[2],row[3]);
        let reg = `${row[0]} ${row[1]}`;
        let lat = row[2];
        let lng = row[3];
        let val = row[index];

        if (val === "0") {
            continue;
            //console.log(val)
        }

        //let mrk = L.marker([lat,lng]).addTo(map);
        //mrk.bindPopup(`${reg}: ${val}`);

        //A = r²*PI
        //r² = A/PI
        //r = WURZEL(A/PI)
        let s = 0.5;
        let r = Math.sqrt(val * s / Math.PI);
        let circle = L.circleMarker([lat, lng], {
            radius: r,
            color: color
        }).addTo(circleGroup);
        circle.bindPopup(`${reg}: ${val}`);
    }
};

document.querySelector("#pulldown").onchange = function() {
    drawCircles();
};

let slider = document.querySelector("#slider");
slider.min = 4;
slider.max = CONFIRMED[0].length - 1;
slider.step = 1;
slider.value = slider.max;

slider.onchange = function () {
    drawCircles();
};

drawCircles();

let playButton = document.querySelector("#play");
let runningAnimation = null;

playButton.onclick = function () {
    let value;
    if (slider.value == slider.max) {
        value = slider.min;
    } else {
        value = slider.value;
    }

    playButton.value = "⏸";

    if (runningAnimation) {
        window.clearInterval(runningAnimation);
        playButton.value = "▶";
        runningAnimation = null;
    } else {
        runningAnimation = window.setInterval(function () {
            slider.value = value;
            drawCircles();
            value++;

            if (value > slider.max) {
                window.clearInterval(runningAnimation);
                playButton.value = "▶";
                runningAnimation = null;
            }
        }, 250)
    }
};
