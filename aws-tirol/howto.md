# [AWS-Tirol](index.html) HOWTO

Als Vorlage für das HTML Grundgerüst verwenden wir [template.zip](template.zip) -> auspacken als `username.github.io/aws-tirol`

## A. Wetterstationsdaten mit Marker und Popup anzeigen

1. ein neues Overlay für die Stationen hinzufügen

    * vor `L.control.layers`

        ```
        let awsLayer = L.featureGroup().addTo(map);
        ```

    * in `L.control.layers`

        ```
        L.control.layers({
            // baselayers
        }, {
            "Wetterstationen Tirol": awsLayer
        }
        ```

2. Daten besorgen

    * [https://data.gv.at](https://data.gv.at) -> Suche nach *"Wetterstation Tirol"* 

    * [Wetterstationsdaten Tirol](https://www.data.gv.at/katalog/dataset/bb43170b-30fb-48aa-893f-51c60d27056f) ansteuern

    * Herunterladen GeoJSON -> [https://lawine.tirol.gv.at/data/produkte/ogd.geojson](https://lawine.tirol.gv.at/data/produkte/ogd.geojson)

3. die Stationen als Marker mit [leaflet-ajax](https://github.com/calvinmetcalf/leaflet-ajax) und der GeoJSON-URL visualisieren

    ```
    let awsUrl = "https://lawine.tirol.gv.at/data/produkte/ogd.geojson"
    let aws = L.geoJson.ajax(awsUrl, {
        pointToLayer: function(point, latlng) {
            console.log("point: ", point);
            return L.marker(latlng);
        }
    }).addTo(awsLayer);
    ```

    **leider bekommen wir einen Fehler in der console**: 

    *Quellübergreifende (Cross-Origin) Anfrage blockiert: Die Gleiche-Quelle-Regel verbietet das Lesen der externen Ressource auf https://lawine.tirol.gv.at/data/produkte/ogd.geojson. (Grund: CORS-Kopfzeile 'Access-Control-Allow-Origin' fehlt).*

    * diese Daten können wir also leider nicht direkt in unsere Applikation einbinden, denn der Server der Tiroler Landesregierung erlaubt es nicht.

    * eine Applikation für den Kurs auf unserem eigenen Webserver schafft Abhilfe und erlaubt das direkt Einbinden der Daten über dies neue Adresse:

    **[https://aws.openweb.cc/stations](https://aws.openweb.cc/stations)**

    * bei `let awsUrl` müssen wir nur die neue Adresse angeben und die Stationen werden angezeigt

4. ein Popup für die Stationsdaten hinzufügen

    * in der `pointToLayer` Funktion des `aws` GeoJSON-Objekts können wir die Werte der `.properties` als Popup anzeigen

        ```
        pointToLayer: function(point, latlng) {
            let marker = L.marker(latlng).bindPopup(`
                <h3>${point.properties.name}</h3>
                <ul>
                <li>Datum: ${point.properties.date}</li>
                <li>Lufttemperatur: ${point.properties.LT} °C</li>
                </ul>
            `);
            return marker;
        }
        ```

    * zum Filtern der Stationsdaten verwenden wir die Funktion `filter` des `aws` GeoJSON-Objekts. In ihre können wir Eigenschaften unserer Stationsdaten abfragen und je nachdem ob wir bei unserer Abfrage `true` oder `false` zurückgeben wird der Marker angezeigt oder nicht.
    
    * zeigen wir zum Testen nur Stationen an, deren Temperatur über 5°C liegt

        ```
        filter: function(feature) {
            return feature.properties.LT >= 5;
        },
        ```

        *Was passiert hier?*: wenn die Temperatur größer oder gleich 5 ist wird `true` zurückgegeben und der Marker angezeigt. Ist sie kleiner als 5 liefer `filter` den Wert `false` zurück und der Marker der Station wird nicht angezeigt

    * wir können auch Stationen über 3000 Meter Seehöhe filtern und müssen dazu nur wissen, wo wir die Höhe der Station finden - sie steht nicht in den `feature.properties` sondern in der Geometrie als dritte Komponente nach lat, lng des `feature.geometry.coordinates` Arrays

        ```
        filter: function(feature) {
            return feature.geometry.coordinates[2] > 3000;
        }
        ```

    * letzendlich entscheiden wir uns dazu, dass wir nur Stationen mit Temperaturwerten anzeigen

        ```
        filter: function(feature) {
            return feature.properties.LT;
        }
        ```

## B. Temperatur-Layer implementieren

1. wir wollen mehrere thematische Layer hinzufügen, also:

    * statt `awsLayer` verwenden wir ab jetzt ein neues *overlay-Objekt*

    ```
    let overlay = {
        stations: L.featureGroup()
    };
    ```

    * und ersetzen alle `awsLayer` Stellen mit `overlay.stations`
    * damit sind die Stationen jetzt nicht automatisch sichtbar, aber das wird sich im nächsten Schritt ändern

2. wir fügen ein Callback `data:loaded` des `aws`-Objekts hinzu und holen uns dort die GeoJSON Daten über `.toGeoJSON()` (*Methods inherited from LayerGroup bei GeoJSON in der Hilfe*) noch einmal, denn wir wollen nicht nur Stationsmarker setzen, sondern auch thematische Layer hinzufügen. Die Daten sind schon vorhanden, wir müssen also keine neuen Ajax requests machen. Den Ausschnitt auf die Stationen setzen wir auch gleich mit und die automatische Anzeige der Marker wird auch gefixed.

    ```
    aws.on("data:loaded", function() {
        console.log(aws.toGeoJSON());

        map.fitBounds(overlay.stations.getBounds());

        // Startlayer anzeigen
        overlay.stations.addTo(map);
    });
    ```

    * `center` und `zoom` bei `L.map` können wir damit löschen

3. das Zeichnen der Temperaturdaten erledigen wir in einer eigenen Funktion `drawTemperature`, die wir aus `data:loaded` aufrufen und ihr beim Aufruf die GeoJSON Daten gleich mitübergeben

    ```
    let drawTemperature = function(jsonData) {
        L.geoJson(jsonData).addTo(map);
    };
    aws.on("data:loaded", function() {
        drawTemperature(aws.toGeoJSON());
    });
    ```

4. die Temperatur-Marker überlagern jetzt die Stationen, deshalb schreiben wir sie in ein neues Overlay und zeigen dieses als erstes an.

    * bei `let overlay`

        ```
        temperature: L.featureGroup()
        ```

    * bei den Overlays von `L.control.layers`

        ```
        "Temperatur (°C)": overlay.temperature
        ```

    * in `let drawTemperature`

        ```
        L.geoJson(jsonData).addTo(overlay.temperature);
        ```

    * in data:loaded

        ```
        overlay.temperature.addTo(map);
        ```

5. über `pointToLayer` definieren wir explizit einen Marker mit dem Stationsnamen als Tooltip. Der Tooltip wird über das `title`-Attribut definiert

    ```
    L.geoJson(jsonData, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                title: `${feature.properties.name}`
            })
        }
    }).addTo(overlay.temperature);

6. statt als Marker zeigen wir den Temperaturwert mit einer Kommastelle direkt als `L.divIcon` und damit als Text in der Karte an. Der angezeigte Text wird über das `html`-Attribut definiert

    ```
    title: `...`,
    icon: L.divIcon({
        html: `<div>${feature.properties.LT.toFixed(1)}</div>`
    }),
    ```

7. zum besseren Styling entfernen wir das kleine Quadrat, das default mäßig bei `L.divIcon` angezeigt wird und stylen den Text über CSS in einer eigenen Klasse `.label-temperature`. Der `text-shadow` hilft uns beim Freistellen der Schrift

    * bei `L.divIcon`

        ```
        html: `<div class="label-temperature">${feature.properties.LT.toFixed(1)}</div>`,
        className: "ignore-me" // dirty hack
        ```

    * in [main.css](main.css):
        ```
        .label-temperature {
            display: inline;
            font-size: 1.25em;
            font-weight: bold;
            padding: 0.3em;
            border: 1px solid gray;
            background-color: silver;
            text-shadow:
                -1px -1px 0 white,
                 1px -1px 0 white,
                -1px  1px 0 white,
                 1px  1px 0 white;
        }
        ```

7. schließlich stellen wir sicher, dass nur dann Icons gezeichnet werden, wenn auch Temperaturdaten vorhanden sind

    ```
    filter: function(feature) {
        return feature.properties.LT;
    },
    ```

    **Hmmm**: dieser Filter ist wohl nicht ganz korrekt, denn was passiert bei einer Temperatur von `0` °C? Besser wäre wohl eine Abfrage auf den möglichen Wertebereich wie z.B.:

    ```
    return feature.properties.LT >= 0 || feature.properties.LT < 0
    ```

## C. Wind-Layer mit Windgeschwindigkeit in km/h implementieren

Nach dem gleichen Muster wie beim Temperaturlayer können wir die Windgeschwindigkeit visualisiern in dem wir:

1. ein neues Overlay `wind` definieren, zu `L.control.layers` hinzufügen und als Default anzeigen

2. die Funktion `drawWind` als 1:1 Kopie von `drawTemperature` definieren und danach anpasssen - statt der Temperatur zeigen wir die Windgeschwindigkeit in km/h an

    ```
    let kmh = Math.round(feature.properties.WG / 1000 * 3600);
    ```

3. einen neuen Stil `.label-wind` für die Label in `main.css` hinzufügen (für jetzt einfach als Kopie von `.label_temperature`)

4. die Funktion `drawWind` in `data:loaded` aufrufen


**ein Schönheitsfehler**: die Positionierung der Label ist leider nicht optimal und wäre sehr aufwendig in CSS zu lösen, deshalb begnügen wir uns damit, dass sie rechts unterhalb des Markers positioniert sind


## D. Farben müssen her: wir erstellen eine zentrale Farbpalette für Temperatur und Wind

1. die Farben für die Farbpaletten bekommen wir hier: [https://lawinen.report/](https://lawinen.report/),  sie verstecken sich bei den Legenden ...

2. rechte Maus über der Legende, Element untersuchen, inneres HTML von `class="legend-wrapper"` kopieren und in eine neue Datei kopieren und als `colors.js` speichern
- *beautify* mit der HTML-option zeigt die Einträge  der SVG *rect-Elemente* besser
- bereinigen und ein Farbobjekt nach diesem Muster anlegen

    ```
    const COLORS = {
        temperature : [
            [9999, "rgb(250,55,150)"], // lila, Werte >= 30
            [30, "rgb(255,5,5)"], // rot, Werte >= 25 und < 30
            ...
            [-25, "rgb(159,128,255)"] // lila, Werte < -25
        ],
        wind : [
            [...]
        ]
    }
    ```

- das Farb-Objekt besteht damit aus zwei Objekten (`COLORS.temperature, COLORS.wind`) die wiederum aus Arrays von Arrays gebildet werden in denen jeweils ein Schwellenwert und die dazugehörige Farbe definiert sind. Die Schwellen sind absteigend sortiert und nachdem die Werte nach oben hin offen sind, definieren wir die oberste Schwelle mit einem utopisch hohen Wert, sagen wir 9999

3. zum Schluss noch [colors.js](colors.js) in `index.html` einbinden und mit `console.log(COLORS)` überprüfen ob's funktioniert hat


## E. eine zentrale Funktion zum Ermitteln der Farbe nach den Schwellen

1. dazu erstellen wir eine Funktion `getColor` der wir den Wert und die jeweilige Palette mit Schwellen und Farben übergeben. Sie wird uns dann die passende Farbe zurückgeben.

    ```
    let getColor = function(val, ramp) {
        let col = "red";

        return col;
    };
    console.log(getColor(40,COLORS.temperature));    
    ```

2. in einer `for-Schleife` gehen wir dann die Farbpalettte durch und vergleichen jeweils Schwelle mit Wert:
    * ist der Wert kleiner als die Schwelle merken wir uns die Farbe zu dieser Schwelle und gehen zur nächsten Schwelle weiter
    * ist der Wert größer oder gleich der Schwelle brechen wir ab, denn wir haben in der letzten Farbe schon die richtige Farbe ermittelt

    ```
    for (let i=0; i < ramp.length; i++) {
        if (val >= ramp[i][0]) {
            console.log(
                `${val} >= ${ramp[i][0]} ->
                wir verwenden die letzte Farbe in col, ${col}`
            )
            break;
        } else {
            console.log(
                `${val} <  ${ramp[i][0]} -> 
                wir merken uns die Farbe ${i}, also col="${ramp[i][1]}"`
            )
            col = ramp[i][1];
        }
    }
    ```

3. zum Schluß geben wir die ermittelte Farbe zurück

    ```
    return col;
    ```

4. diese Funktion verwenden wir jetzt in `pointToLayer` und setzen die Hintergrundfarbe des Temperaturelabels über ein CSS *style-Attribut*

    ```
    let col = getColor(feature.properties.LT, COLORS.temperature);
    // und dann
    html: `<div class="label-temp" style="background-color:${col}">...</div>`
    ```

5. das Selbe machen wir mir dem Wind-Layer


## F. Visualisieren der Windrichtung über Font Awesome

1. wir zeigen zuerst Stationsname und Windgeschwindigkeit in km/h als Tooltip an

    ```
    title: `${feature.properties.name}: ${kmh} km/h`
    
    ```

2. dann ersetzen wir den Wert für die Windgeschwindigkeit beim `L.divIcon` durch einen nach oben gerichteten Pfeil in der ermittelten Farbe und nehmen die Farbe vom DIV-Element weg

    ```
    <div class="label-wind"><i style="color:${col}" class="fa fa-arrow-circle-up"></i></div>
    ```

2. schließlich rotieren wir den Pfeil über das CSS-Attribut `transform` nach der Gradangabe in der Windrichtung

    ```
    let rot = feature.properties.WR;

    <i style="color:${col};transform: rotate(${rot}deg)" class="fa fa-arrow-circle-up"></i>
    ```

3. damit der Label besser lesbar ist setzen wir einen passenden Stil in `main.css` - die Freistellung des Pfeils ist jetzt invers

    ```
    .label-wind {
        display: inline;
        font-size: 2.5em;
        text-shadow:
            -1px -1px 1px black,
             1px -1px 1px black,
            -1px  1px 1px black,
             1px  1px 1px black;
        }
    ```

4. die Höhe der Station können wir noch bei den Tooltips dazuschreiben

    ```
    title: `${feature.properties.name} (${feature.geometry.coordinates[2]}m) - ${kmh} km/h`
    ```


**nach dem gleichen Schema können wir auch die Schneehöhe und relative Luftfeuchtigkeit implementieren**

die Farben bekommen wir wieder aus den Legenden von [https://lawinen.report/](https://lawinen.report/)


## G. und zum Schluss: das Leaflet.Rainviewer Plugin einbauen

1. [https://github.com/mwasil/Leaflet.Rainviewer](https://github.com/mwasil/Leaflet.Rainviewer) von `mwasil` ansteuern

2. Clone or Download / Downloaden ZIP wählen und als Verzeichnis `leaflet.rainviewer/` speichern

3. unnötige Dateien löschen (demo, README, .gitignore)

4. in `index.html` .css und .js einbinden

    ```
    <link rel="stylesheet" href="leaflet-rainviewer/leaflet.rainviewer.css">
    <script src="leaflet-rainviewer/leaflet.rainviewer.js"></script>
    ```

- in `main.js` unter `data:loaded` das Plugin initialisieren

    ```
    L.control.rainviewer().addTo(map);
    ```
