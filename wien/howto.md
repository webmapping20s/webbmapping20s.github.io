# [Wien Beispiel](index.html) HOWTO

Als Vorlage für das HTML Grundgerüst verwenden wir [template.zip](template.zip) -> auspacken als `username.github.io/wien`.

Dieses Template enthält als Hintergrundlayer für die Grundkarte die frei verfügbaren WMTS-Layer von [basemap.at](https://basemap.at/), die über das [leaflet-providers](https://github.com/leaflet-extras/leaflet-providers) Plugin eingebunden werden. Die Kombination von Orthofoto mit Beschriftung wird über [L.layerGroup](https://leafletjs.com/reference.html#layergroup) implementiert

```
let startLayer = L.tileLayer.provider("BasemapAT.grau");
L.control.layers({
    "BasemapAT.grau": startLayer,
    "BasemapAT": L.tileLayer.provider("BasemapAT"),
    "BasemapAT.highdpi": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT.terrain": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT.surface": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT.orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT.overlay": L.tileLayer.provider("BasemapAT.overlay"),
    "BasemapAT.orthofoto+overlay": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ])
}.addTo(map);
```

## A. Daten vorbereiten

1. [https://data.gv.at](https://data.gv.at) -> Suche nach *"Stadtspaziergang"* 

2. [Stadtspaziergang Wien](https://www.data.gv.at/katalog/dataset/f7bd721a-1f72-4bef-a38c-792f59cc8fe3) ansteuern und dort zu [WFS GetFeature (JSON)](https://www.data.gv.at/katalog/dataset/stadt-wien_stadtspaziergangwien/resource/1367011e-e119-49f3-93da-2de02e72a61c) wechseln

3. Der Link ["Zur Ressource"](https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPAZIERPUNKTOGD&srsName=EPSG:4326&outputFormat=json) lässt uns die GeoJSON Daten im Visual Studio Code öffnen.

4. wir schreiben eine Variablendeklaration `const SPAZIERGANG = ` vor die geschwungene Klammer des GeoJSON-Objekts und speichern das, dadurch gültige Javascript als [SPAZIERPUNKTOGD.js](SPAZIERPUNKTOGD.js)

5. STRG+UMSCHALT+P und *Beautify file* in Visual Studio Code zeigt die Struktur von GeoJSON noch besser - das auf einen Eintrag reduzierte GeoJSON File sieht dann so aus:

    ```
    const SPAZIERGANG = {
        "type": "FeatureCollection",
        "totalFeatures": 126,
        "features": [{
            "type": "Feature",
            "id": "SPAZIERPUNKTOGD.8609",
            "geometry": {
                "type": "Point",
                "coordinates": [16.357561781399717, 48.21086163580665]
            },
            "geometry_name": "SHAPE",
            "properties": {
                "OBJECTID": 8609,
                "KATEGORIE": 5,
                "NAME": "Rathaus",
                "BEMERKUNG": "Das von 1872 bis 1883 von Friedrich von Schmidt erbaute Wiener Rathaus ist der bedeutendste nichtkirchliche Bau Wiens im neugotischen Stil.",
                "ADRESSE": "1., Rathausplatz 1",
                "WEITERE_INF": "http://www.wien.gv.at/spaziergang/ringlinien/rathaus.html",
                "SE_ANNO_CAD_DATA": null
            }
        }],
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:EPSG::4326"
            }
        }
    };
    ```

    Im `features`-Array sind die einzelnen Stopps des Spaziergangs mit Koordinaten und Attributen, die wir in Javascript folgendermaßen ansprechen können:

    * das erste Feature des Datensatzes:

        ```
        let point = SPAZIERGANG.features[0]
        ```

    * die Koordinaten dieses Punkts

        ```
        point.geometry.coordinates[0] // lng
        point.geometry.coordinates[1] // lat
        ```
    
    * Attribute dieses Punkts

        ```
        point.properties.NAME           // der Name des Stopps
        point.properties.BEMERKUNG      // die Info zum Stopps
        point.properties.ADRESSE        // die Adresse des Stopps
        point.properties.WEITERE_INF    // der Link zur Webseite des Stopps
        ```

    Details zur GeoJSON-Spezifikation finden sich auf [https://geojson.org/](https://geojson.org/)


## B. GeoJSON Daten des Stadtspaziergangs als Marker mit Popup anzeigen

1. zuerst binden wir das Skript mit unserem GeoJSON-Objekt in *index.html* ein

    ```
    <script src="SPAZIERPUNKTOGD.js"></script>
    ```

2. Zur Anzeige der GeoJSON-Daten als einfache Marker verwenden wir Leaflets [L.geoJson](https://leafletjs.com/reference.html#geojson) Methode der wir als ersten Parameter unser GeoJSON-Objekt in der Variablen `SPAZIERGANG` übergeben

    ```
    let sights = L.geoJson(SPAZIERGANG).addTo(map);
    ```

    damit werden automatisch alle Punkte als Marker angezeigt


3. das Popup können wir im Options-Objekt von *L.geoJson* über die Funktion [pointToLayer](https://leafletjs.com/reference.html#geojson-pointtolayer) implementieren. Als Argumente werden an *pointToLayer* automatisch das GeoJSON Feature selbst mit seinen `geometry` und `properties` Objekten sowie zusätzlich die Position in Lat/Lng übergeben. Sobald wir *pointToLayer* verwenden, erwartet *L.geoJson*, dass wir einen Marker mit `return` zurückliefern. Tun wir das nicht, wird unser Marker auch nicht mehr angezeigt. Das Popup definieren wir aus den `properties` mit Template-Syntax.

    ```
    let sights = L.geoJson(SPAZIERGANG, {
        pointToLayer: function (point, latlng) {
            let marker = L.marker(latlng);
            marker.bindPopup(`
                <h3>${point.properties.NAME}</h3>
                <p>${point.properties.BEMERKUNG || ""}</p>
                <p>Adresse: ${point.properties.ADRESSE}</p>
                <p><a target="links" href="${point.properties.WEITERE_INF}">Weiterführende Informationen</a></p>
            `);
            return marker;
        }
    }).addTo(map); 
    ```

    * das logische oder Zeichen `||` in `point.properties.BEMERKUNG || ""` bewirkt, dass das Attribut `BEMERKUNG` nur angezeigt wird, wenn es auch mit einem Wert belegt ist. Ist es leer wird eine leere Zeichenkette angezeigt

    * `target="links"` beim Link zu den weiterführenden Informationen bewirkt, dass alle externen Seiten im gleichen Browser-Tab, dem wir damit den Name `link` gegeben haben, geöffnet werden.

    
## C. ein eigens Icon verwenden

Möchten wir statt der Standardmarker ein eigenes Icon verwenden, können wir das beim Marker  über [L.icon](https://leafletjs.com/reference.html#icon) implementieren

1. das Icon im Format SVG bekommen wir auf der [Icons-Seite der Stadt Wien](https://digitales.wien.gv.at/site/icons/) unter [Sehenswürdigkeiten – Standorte (svg)](http://www.data.wien.gv.at/icons/sehenswuerdigogd.svg) - wir speichern es in einem Unterverzeichnis `icons/` mit dem Namen `sight.svg`

2. Icon-Link und Größe definieren wir mit `L.icon` in den Attributen [iconUrl](https://leafletjs.com/reference.html#icon-iconurl) und [iconSize](https://leafletjs.com/reference.html#icon-iconsize)

    ```
    let siteIcon = L.icon({
        iconUrl: "icons/sight.svg",
        iconSize: [32, 32]
    });
    ```

3. beim Marker verwenden wir unser neues Icon über das gleichnamige Attribut `icon`

    ```
    let marker = L.marker(latlng, {
        icon: siteIcon
    });
    ```

## D. die Daten direkt vom Server der Stadt Wien laden

Den Zwischenschritt der Umwandlung der GeoJSON-Daten in gültiges Javascript über die `const SPAZIERGANG` Deklaration mit Abspeichern als `.js`-File können wir weglassen, wenn wir die Daten direkt vom Server der Stadt Wien laden

1. das Leaflet Plugin unserer Wahl dazu ist [leaflet.ajax](https://github.com/calvinmetcalf/leaflet-ajax) von `calvinmetcalf`

2. wir binden es über [cdnjs.com](https://cdnjs.com/libraries/leaflet-ajax) in *index.html* ein

    ```
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-ajax/2.1.0/leaflet.ajax.min.js"></script>
    ```

3. definieren die URL des GeoJSON-Files als Variable `sightUrl`

    ```
    let sightUrl = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPAZIERPUNKTOGD&srsName=EPSG:4326&outputFormat=json";
    ```

4. und ersetzen `L.geoJson` mit `L.geoJson.ajax`. Statt der Konstanten `SPAZIERGANG` verwenden wir die `sightUrl` als ersten Parameter, der Rest bleibt gleich

    ```
    let sights = L.geoJson.ajax(sightUrl, {
        // ...
    }).addTo(map)

        ```

## E. die Icons in ein ein-/ausschaltbares Overlay schreiben

Möchten wir die Icons in ein eigenes Overlay schreiben das wir in der Layernavigation ein- und ausschalten können, müssen wir folgende Schritt umsetzen

1. wir definieren direkt oberhalb von [L.control.layers](https://leafletjs.com/reference.html#control-layers) eine neue [L.featureGroup](https://leafletjs.com/reference.html#featuregroup) und hängen sie an die Karte
    
    ```
    let sightGroup = L.featureGroup().addTo(map);
    ```

2. in *L.control.layers* können wir neben den Hintergrundlayern auch Overlays als zweites Objekt einbauen. Der *Key* des Objekts wird der Label des Eintrags und der *Value* ist die Feature Group die wir ein- und ausschalten möchten

    ```
    L.control.layers({
        // baselayers
    },{
        "Stadtspaziergang (Punkte)": sightGroup
    }).addTo(map);
    ```

3. bleibt noch, unsere Icons statt in die Karte `map` in die Feature Group  `sightGroup` zu schreiben
    ```
    let sights = L.geoJson.ajax(sightUrl, {
        // ....
    }).addTo(sightGroup)
    ```

Damit können die Icons in der Layer control rechts oben ein- und ausgeschaltet werden

4. wenn alle Icons gezeichnet sind, setzen wir in der `data:loaded` Callback-Funktion des `sights`-Objekts den Ausschnitt der Karte mit [fitBounds](https://leafletjs.com/reference.html#map-fitbounds) auf die Ausdehnung unserer Icons die wir über [getBounds](https://leafletjs.com/reference.html#map-getbounds) abfragen können
 
    ```
    sights.on("data:loaded", function() {
        map.fitBounds(sightGroup.getBounds());
    });
    ```


## F. Linien für Wanderwege zeichnen

1. der JSON Datensatz dafür heißt [Stadtwanderwege und RundumadumWanderweg Wien](https://www.data.gv.at/katalog/dataset/36886c25-6961-4055-96b2-b3e8b138e588), die GeoJSON-Daten sind unter [WFS GetFeature (JSON) - Wanderwege](https://www.data.gv.at/katalog/dataset/stadt-wien_stadtwanderwegeundrundumadumwanderwegwien/resource/48729125-9b38-49fe-8766-b390a48b3c0a) zu finden - die URL zum Laden lautet:

    ```
    let walkUrl = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WANDERWEGEOGD&srsName=EPSG:4326&outputFormat=json";
    ```

2. die Visualisierung der Linie erfolgt analog zur Funktion *pointToLayer* bei Punkten über die Funktion [style](https://leafletjs.com/reference.html#geojson-style) von *L.geoJson*. Dieser Funktion wird automatisch das jeweilige GeoJSON Feature übergeben. Es liefert ein Objekt zurück in dem das Aussehen der Linie definiert wird. Nachdem wir  auch die `properties` des GeoJSON Features zur Verfügung haben, können wir die Linien auch in Abhängigkeit von diesen Eigenschaften stylen.

    * unsere Linie soll schwarz sein, 2 Pixel breit und je nach dem Wert von `TYP` strichliert (`TYP 1`) oder punktiert (`TYP 2`)
    * das Muster der Linie definieren wir über [dashArray](https://leafletjs.com/reference.html#path-dasharray)
    * eine `if`-Abfrage entscheidet in Abhängigkeit des Typs, welcher Stil zurückgeliefert wird

    ```
    L.geoJson.ajax(walkUrl, {
        style: function (feature) {
            if (feature.properties.TYP == "1") {
                return {
                    color: "black",
                    weight: 2,
                    dashArray: "15 5"
                };
            } else {
                return {
                    color: "black",
                    weight: 2,
                    dashArray: "1 5"
                };
            }
        }
    }).addTo(map);
    ```

    Alle Attribute zum Formatieren einer Linie liefert die Leaflet Hilfe unter [Path](https://leafletjs.com/reference.html#path)

3. Tooltips für die Wanderwege implementieren wir in der [onEachFeature](https://leafletjs.com/reference.html#geojson-oneachfeature) Funktion von *L.geoJson*. Ihr wird automatisch das jeweilige GeoJSON Feature, sowie der dafür erzeugte Leaflet-Layer übergeben. An diesen Layer können wir unser Popup mit der Bezeichnung des Wanderwegs hängen

    ```
    L.geoJson.ajax(walkUrl, {
        style : function (feature) {
            // ...
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<p>${feature.properties.BEZ_TEXT}</p>`);
        }
    }).addTo(map);
    ```

4. wie bei den Sehenswürdigkeiten zuvor, zeichnen wir die Wanderwege wieder in ein Overlay

    * vor *L.control.layers*

        ```
        let walkGroup = L.featureGroup().addTo(map);
        ```

    * bei *L.control.layers*

        ```
        L.control.layers({
            // baselayers
        },{
            "Wanderungen": walkGroup
        }
        ```

    * bei *L.geoJson.ajax*

        ```
        L.geoJson.ajax(walkUrl, {
            // ...
        }).addTo(walkGroup)
        ```

## G. Flächen für Weltkulturerbe-Zonen 

1. der JSON Datensatz dafür heißt [Weltkulturerbe Wien](https://www.data.gv.at/katalog/dataset/12426052-8803-4deb-8c89-9e78785f7dd2), die GeoJSON-Daten sind unter [WFS GetFeature (JSON) - Wanderwege](https://www.data.gv.at/katalog/dataset/stadt-wien_weltkulturerbewien/resource/270f33dd-23dd-4f0d-a200-9f27766aa3fb) zu finden - die URL zum Laden lautet:

    ```
    let heritageUrl = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WELTKULTERBEOGD&srsName=EPSG:4326&outputFormat=json";
    ```

2. die Visualisierung der Flächen erfolgt wie bei den Linien über die Funktion [style](https://leafletjs.com/reference.html#geojson-style) von *L.geoJson*. Diesmal wollen wir zwischen Kernzonen (Rot transparent) und Pufferzonen (Gelb transparent) unterscheiden.

    ```
    L.geoJson.ajax(heritageUrl, {
        style: function (feature) {
            if (feature.properties.TYP === "1") {
                return {
                    color: "salmon",
                    fillOpacity: 0.3
                };
            } else {
                return {
                    color: "yellow",
                    fillOpacity: 0.3
                };
            }
        }
    }).addTo(map);
    ```

3. Tooltips für die Zonen implementieren wir wieder in der [onEachFeature](https://leafletjs.com/reference.html#geojson-oneachfeature) Funktion von *L.geoJson*. 

    ```
    onEachFeature: function (feature, layer) {
        layer.bindPopup(`
            <h3>${feature.properties.NAME}</h3>
            <p>${feature.properties.INFO}</p>
        `);
    }
    ```

4. wie bei den Sehenswürdigkeiten und Wanderwegen zuvor, zeichnen wir die Weltkulturerbe Flächen wieder in Overlay

    * vor *L.control.layers*

        ```
        let heritageGroup = L.featureGroup().addTo(map);
        ```

    * bei *L.control.layers*

        ```
        L.control.layers({
            // baselayers
        },{
            "Weltkulturerbe": heritageGroup
        }
        ```

    * bei *L.geoJson.ajax*

        ```
        L.geoJson.ajax(heritageUrl, {
            // ..
        }).addTo(heritageGroup)
        ```


## H. Markercluster für die Sehenswürdigkeiten 

Die vielen Icons für Sehenswürdigkeiten machen die Karte schwer lesbar. Deshalb werden wir sie mit dem [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) Plugin  zu Clustern zusammenfassen.


1. zuerst binden wir das Plugin mit seinen Javascript und CSS files über [cdnjs.com](https://cdnjs.com/libraries/leaflet.markercluster) in *index.html* ein

    ```
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/leaflet.markercluster.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.Default.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css">
    ```

2. dann definieren wir `sightGroup` als `L.markerClusterGroup`

    ```
    let sightGroup = L.markerClusterGroup().addTo(map);
    ```

3. Mit dem letzte Schritt verschwinden plötzlich alle Icons, denn *Leaflet.markercluster* kann seine Cluster erst dann zeichnen, wenn alle Icons erzeugt sind. Deshalb kommt das `.addTo(sightGroup)` beim GeoJson-Aufruf zu früh und wir löschen es weg

4. sobald dann alle Marker gezeichnet sind, können wir die Markercluster Gruppe an die Karte hängen und den Ausschnitt setzen. Das Callback `data:loaded` unseres GeoJSON Objekts `sights` ermöglicht das - wir fügen dort mit [addLayer](https://leafletjs.com/reference.html#layergroup-addlayer) unsere Icons dem Overlay hinzu

    ```
    sights.on("data:loaded", function() {
        sightGroup.addLayer(sights);
        map.fitBounds(sightGroup.getBounds());
    });
    ```