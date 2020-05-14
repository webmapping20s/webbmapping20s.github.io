# [Adlerweg Beispiel](index.html) HOWTO

Als Vorlage für das HTML Grundgerüst verwenden wir [template.zip](template.zip) -> auspacken als `username.github.io/adlerweg`

## A. Daten vorbereiten

1. [https://data.gv.at](https://data.gv.at) -> Suche nach *"Adlerweg"* 

2. [CSV-Datei zum Tiroler Adlerweg](https://www.data.gv.at/katalog/dataset/land-tirol_adlerwegtirol/resource/a192cb91-0fe9-4cff-9b28-d3091f5701d7) ansteuern

    * Öffnen mit `LibreOffice`
    * Zeichensatz: *Westeuropäisch (Windows-1252/WinLatin 1)*
    * Sprache: Deutsch (Österreich)
    * Trennoptionen: Semikolon
    * Speichern als [etappen.ods](etappen.ods)

3. in JSON-Objekt umwandeln
    * [CSV To JSON converter](https://www.convertcsv.com/csv-to-json.htm)
    * Tabelle kopieren und mit Option der Option *CSV To JSON* in einen Array von Objekten konvertieren
    * die Keys der Etappenobjekte sind noch nicht brauchbar, deshalb in `LibreOffice`:
        - Tabelle / Zeilen einfügen / Zeilen oberhalb und eine neuen, einfacheren Header einfügen
        - *nr, titel, text, info, start, ziel, auf, ab, hp, grad, km, stunden, einkehr, track*
        - den alten Header der Spalten in Zeile 2 behalten wir, vielleicht können wir ihn noch brauchen ...
    * noch einmal *CSV To JSON* und wieder in einen Array von Objekten konvertieren
    * viel besser jetzt, `const ETAPPEN=` dazu und als [etappen.js](etappen.js) speichern
    * `STRG+UMSCHALT+P` *beautify*, in *index.html* einbauen und in *main.js* mit `console.log` testen

4. wenn ihr ein Beispiel für einen **schlechten Datensatz** bei `data.gv.at` sucht - mit den **Adlerblicken** habt ihr ihn gefunden

    * im .zip-File ein PDF das zu einem anderen Datensatz (GPS-Tracks der Etappen) gehört
    * völlig irrelevante GIS-Layer mit Wald/Wildschutz Shapefiles
    * ein XLSX-File mit dem Versuch, Koordinaten der Standorte der Adlerblicke Fernrohre zu dokumentieren
    * wer zu viel Zeit hat, kann gerne die verschiedenen Arten der Lat/Lng Angaben analysieren
    * letztes Jahr im Kurs haben wir uns auch schon geärgert und deshalb
    * [https://webmapping19s.github.io/ex/adler/blicke.js](https://webmapping19s.github.io/ex/adler/blicke.js)
    * speichern als [blicke.js](blicke.js)
    * `STRG+UMSCHALT+P` *beautify*, in *index.html* einbauen und in *main.js* mit `console.log` testen


## B. Adlerblicke als Icons mit Popup einbauen

1. `for of`-Schleife für die einzelnen Blicke mit Marker und Popup

    * `for of`-Schleifen kann man bei Arrays verwenden um ohne Zählervariable die einzelnen Elemente abarbeiten zu können. Für uns passt das gut, denn wir haben einen Array aus Objekten und können damit auf die Metadaten von jedem Adlerblick direkt zugreifen.

    ```
    for (const blick of ADLERBLICKE) {
        console.log(blick)
        let mrk = L.marker([blick.lat, blick.lng]).addTo(map);
        mrk.bindPopup(`Adlerblick ${blick.standort} (${blick.seehoehe}m)`);
    }
    ```

2. [L.icon](https://leafletjs.com/reference.html#icon) mit einem passenden Piktogramm statt dem Standardmarker

    * Google Suche "*Map Icons Collection*" -> [https://mapicons.mapsmarker.com/](https://mapicons.mapsmarker.com/)

        - als Icon verwenden wir: *Tourism / Dark / Panoramic View*
        - Rechte Maus und *Save image as* in einem Unterverzeichnis `icons/`
        - beim Einbauen als `L.icon` müssen wir die Adresse des Icons als [iconUrl](https://leafletjs.com/reference.html#icon-iconurl) angeben:

            ```
            icon: L.icon({
                iconUrl: "icons/panoramicview.png"
            })
            ```

    * Anfasspunkt testen wir mit einem zusätzlichen Standardmarker
    
        ```
        L.marker([blick.lat, blick.lng]).addTo(map);
        ```
        
        - Standardanfasspunkt bei Icons ist *links oben* - das entspricht `[0, 0]`
        - Mitte des Bilds wenn die Größe über [iconSize](https://leafletjs.com/reference.html#icon-iconsize) angegeben wird: z.B. `iconSize: [32,37]`
        - beliebig mit [iconAnchor](https://leafletjs.com/reference.html#icon-iconanchor): z.B. `iconAnchor: [16, 37]`
        - die Popup-Position definiert [popupAnchor](https://leafletjs.com/reference.html#icon-popupanchor): z.B. `popupAnchor: [0, -37]` 

3. zum Schluss die Adlerblicke in eine ein/ausschaltbare Overlay-Gruppe bringen

    ```
    let overlay = {
        adlerblicke: L.featureGroup()
    };
    ```

    * bei `L.control.layers`

        ```
        L.control.layers = {
            // Baselayers
        }, {
            // Overlay
            "Adlerblicke": overlay.adlerblicke
        }
        ```
    
    * bei `L.marker`
        ```
        .addTo(overlay.adlerblicke)
        ```
    
    * nach der `for of` Schleife

        ```
        overlay.adlerblicke.addTo(map);
        ```

## C. Die erste Adlerwegetappe anzeigen

1. zuerst das .zip File aller [Einzeletappen](https://gis.tirol.gv.at/ogd/sport_freizeit/TW_Adlerweg_-_gpx-Daten1.zip) herunterladen und in einem Unterverzeichnis `gpx/` auspacken


2. das [GPX plugin for Leaflet](https://github.com/mpetazzoni/leaflet-gpx) von `mpettazoni` über [cdnjs.com](https://cdnjs.com/libraries/leaflet-gpx) in *index.html* einbauen

    ```
    https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.5.0/gpx.min.js
    ```

3. Etappe 1 visualisieren und den Ausschnitt darauf setzen

    ```
    let gpx = new L.GPX("gpx/AdlerwegEtappe01.gpx", {
        async: true
    });
    gpx.on("loaded", function(evt) {
        map.fitBounds(evt.target.getBounds());
    }).addTo(map);
    ```

    * Start und Ziel Icons funktionieren noch nicht - wieder Icons von [Map Icons Collection](https://mapicons.mapsmarker.com/) besorgen

        - als Farbe die Farbe von *Events* (`c03639`)
        - *Sports / Dark / finish Race* + / Farbe ändern `c03639` / als `finish.png` speichern 
        - *Numbers / Dark* / Farbe ändern `c03639` / als `number_1.png` speichern
        - Einbauen über `marker_options` des Plugins, den Schatten des Icons entfernen wir

            ```
            marker_options: {
                startIconUrl: "icons/start-race-2.png",
                endIconUrl: "icons/finish.png",
                shadowUrl: null
            }
            ```

    * die Linie ist noch nicht schön genug - über die `polyline_options` des Plugins ändern wir sie in *schwarz / strichliert*

        ```
        polyline_options: {
            color: "black",
            dashArray: [2, 5]
        }
        ```

4. die Etappe in eine ein/ausschaltbare Overlay-Gruppe bringen

    * bei `let overlay = {}`

        ```
        etappe: L.featureGroup()
        ```

    * bei `L.control.layers`

        ```
        L.control.layers = {
            // Baselayers
        }, {
            // Overlay
            "Adlerweg Etappe": overlay.etappe
        }
        ```
    
    * bei `gpx.on("loaded", function(evt){})`

        ```
        .addTo(overlay.etappe)
        ```
    
    * nach `gpx.on("loaded", function(evt){})`

        ```
        overlay.etappe.addTo(map);
        ```


## D. Alle Etappen verfügbar machen

1. den Code zum Zeichnen der Etappe in eine Funktion umwandeln
    * die Funktion bekommt die Etappennummer (1 - 33) übergeben
    * zuerst ermitteln wir den Namen des Tracks aus dem Etappen-Objekt in `etappen.js`
        - glücklicherweise haben wir auch den Header mitgenommen
        - damit ist der index der ersten Etappe `1` und  nicht `0`
        - was soviel heißt, dass wir über `ETAPPEN[nr]` direkt auf die Etappendaten zugreifen können
    - der GPX-Track ist damit in `ETAPPEN[nr].track` zu finden
    - beginnt aber leider in Nordtirol mit `A` - die GPX-Files aber nicht, deshalb
        ```
        let track = ETAPPEN[nr].track.replace("A", "");
        ```
    - mit Template-Syntax können wir den link zum GPX-Track einarbeiten und das Starticon mit der Etappennummer ersetzen

    ```
    let gpx = new L.GPX(`gpx/AdlerwegEtappe${track}.gpx`, {
        marker_options: {
            startIconUrl: `icons/number_${nr}.png`
        }
    });
    ```

2. ein Pulldown Menü erlaubt das wechseln zwischen den Etappen

    * in *index.html* vor dem map-DIV ein HTMLSelect-Element mit der ID `pulldwon` hinzufügen
        ```
        <select id="pulldown"></select>
        ```

    * in *main.js* das Pulldownmenü mit den Etappen Titeln und Nummern befüllen

        ```
        let pulldown = document.querySelector("#pulldown");
        for (let i = 1; i < ETAPPEN.length; i++) {
            const etappe = ETAPPEN[i];
            pulldown.innerHTML += `<option value="${i}">${etappe.titel}</option>`;
        }
        ```

        * **Anmerkung**: wir beginnen bei `i=1` weil bei `i=0` der alte Header zu finden ist

    * auf Änderungen im Pulldownmenü reagieren

        ```
        pulldown.onchange = function(evt) {
            let nr = evt.target.options[evt.target.options.selectedIndex].value;
            drawEtappe(nr);
        };
        ```

    * die bestehende Etappe am Anfang der `drawEtappe` Funktion löschen

        ```
        overlay.etappen.clearLayers();
        ```

# E. Etappendaten im HTML anzeigen

1. das `.innerHTML` beliebiger HTML-Elemente mit Werten aus dem Etappenobjekt ersetzen

    * HTML-Elemente bekommen `id`-Attribute die gleich lauten wie die *Keys* im Etappenobjekt
    * damit wir den Überblick über die IDs nicht verlieren, verwenden wir ein Prefix `et-`
    * z.B. `<h2 id="et-titel"></h2>` oder `<p id="et-text"></p>`
    * die Umsetzung erledigt eine einfache `for in`-Schleife
    
        ```
        for (const key in ETAPPEN[nr]) {
            if (ETAPPEN[nr].hasOwnProperty(key)) {
                const val = ETAPPEN[nr][key];
                let elem = document.querySelector(`#et-${key}`);
                if (elem) {
                    elem.innerHTML = val;
                }
            }
        }
        ```

2. in Kombination mit *Font Awesome* und CSS können wir *Badges* realisieren

    * in *index.html*
        ```
        <div class="badge">
            <i class="fas fa-walking"></i> <span id="et-km"></span>km
        </div>
        ```
    
    * in *main.css*
        ```
        .summary {
            margin-bottom: 2em;
        }

        .badge {
            display: inline;
            padding: 0.4em;
            border: 1px solid silver;
            border-radius: 10px;
            margin-right: 0.5em;
        }
        ```

3. Anpassungen innerhalb der `for in` Schleife
    
    * **Achtung**: natürlich müssen wir zuerst `const val` in `let val` umwandeln sonst dürfen wir die Werte nicht ändern

    * Task 1: bei den Einkehrmöglichkeiten "#" durch ", " ersetzen
        
        Damit wir alle #-Zeichen ersetzen können, müssen wir die Syntax für *reguläre Ausdrücke* mit Schrägstrichen verwenden. Normales `.replace("#", ", ")` würde uns nur das erste Vorkommen ersetzen. Deshalb verwenden wir die Schrägstriche und geben die `g`-Flag (global) an. Mehr dazu bei [MDN String.prototype.replace()](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/replace)

        ```
        if (key == "einkehr") {
            val = val.replace(/#/g, ", ");
        }
        ```

    * Task 2: den Downloadlink für die GPX-TRacks basteln

        ```
        if (key == "track") {
            val = val.replace("A", "");
            val = `<a href="gpx/AdlerwegEtappe${val}.gpx">GPX</a>`
        }
        ```

## F. Einkehrmöglichkeiten als Icons einbauen

* die Koordinaten der Einkehrmöglichkeiten habt ihr in [einkehr.js](einkehr.js) als Array von Arrays erstellt

    ```
    const EINKEHR = [
        [1, "Rummlerhof", 47.53805633464253, 12.397819072029963],
        [1, "Obere Regalm", 47.546580213664484, 12.344464614998289],
        [1, "Gaudeamushütte", 47.54922123957281, 12.324573308251276]
    ];
    ```

* nach dem Einbinden in *index.html* können wir sie visualisieren

* zuerst definieren wir ein neues Overlay

    * bei `let overlay = {}`: `overlay.einkehr: L.featureGroup()`
    * bei `L.control.layers`: `"Einkehrmöglichkeiten": overlay.einkehr`
    
* dann zeichnen wir in einer eigenen Funktion die Icons
    * mit einer `for of` Schleife loopen wir durch den `EINKEHR`-Array
    * das Icon `restaurant.png` (*Restaurants & Hotels / Dark / Restaurant*) kommt wieder von der [Map Icons Collection](https://mapicons.mapsmarker.com/)
    * als Tooltipp zeigen wir den Namen und die Etappennummer
    * die Icons hängen wir an das `einkehr`-Overlay
    * zum Schluss rufen wir unsere Funktion auf und hängen das Overlay an die Karte

    ```
    let drawEinkehr = function () {
        for (let einkehr of EINKEHR) {
            let mrk = L.marker([einkehr[2], einkehr[3]], {
                icon: L.icon({
                    iconSize: [32, 37],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                    iconUrl: "icons/restaurant.png"
                })
            }).addTo(overlay.einkehr);
            mrk.bindPopup(`${einkehr[1]} (Etappe ${einkehr[0]})`)
        }
    };
    drawEinkehr();
    overlay.einkehr.addTo(map);
    ```

## G. Höhenprofile für die einzelnen Etappen

Das Plugin unsere Wahl dafür ist [leaflet-elevation](https://github.com/Raruto/leaflet-elevation) von `Raruto`. Es kann Profile aus GPX- und GeoJSON-Daten auch außerhalb der Karte in einem eigenen DIV erzeugen.

1. zuerst müssen wir `leaflet-elevation` einbinden - die Links zu den Plugindateien können wir direkt der *How to use* Anleitung  von Raruto entnehmen

    ```
    https://unpkg.com/@raruto/leaflet-elevation/dist/leaflet-elevation.css
    https://unpkg.com/@raruto/leaflet-elevation/dist/leaflet-elevation.js
    ```

2. dann erstellen wir direkt unterhalb der Karte ein DIV-Element mit der id `profile` in das wir das Profil zeichnen werden

    ```
    <div id="profile"></div>
    ```

3. Initialisierung und Konfiguration des Profils geschieht dann in *main.js* unterhalb des Codes für die Einkehrmöglichkeiten. Von den unzähligen Konfigurationsmöglichkeiten des Plugins benötigen wir jetzt nur vier:

    * `theme: "steelblue-theme"`: das Aussehen des Profils wird über CSS *themes* definiert die wir in `leaflet-elevation.css` finden. Das `theme` Attribut kennt standardmäßig folgende Varianten:
        * *lime-theme*, *steelblue-theme*, *purple-theme*, *yellow-theme*, *red-theme*, *magenta-theme*, *lightblue-theme*
    
    * `elevationDiv: "#profile"`: der CSS-Selektor für den DIV in dem unser Profil erscheinen soll

    * `detached: true`: damit landet das Profil außerhalb der Karte im `elevationDiv`
    
    * `followMarker: false`: parallel zu Mausbewegungen über dem Profil kann man den Kartenausschnitt gleich mit verschieben - ein Feature das mitunter auch lästig werden kann ...

    ```
    let controlElevation = L.control.elevation({
        detached: true,
        elevationDiv: "#profile",
        followMarker: false,
    }).addTo(map);
    ```

4. damit bleibt noch das Laden der GPX-Datei im `loaded` Callback des `gpx`-Objekts (nach `map.fitBounds`)

    **Anmerkung**: nachdem das `loaded` Callback innerhalb der `drawEtappe`-Funktion liegt, können wir über die `track`-Variable direkt auf das Etappenkürzel zugreifen das wir aus dem Etappenobjekt der jeweiligen Etappennummer ermittelt haben.

    * vor dem Laden müssen wir auch noch ein möglicherweise bereits gezeichnetes Profil löschen

    ```
    gpx.on("loaded", function() {
        controlElevation.clear();
        controlElevation.load(`gpx/AdlerwegEtappe${track}.gpx`);
    })
    ```

    Bei `mouseover` über dem Profil werden Seehöhe und Entfernung angezeigt und ein Marker in der Karte zeigt die Position auf der Profillinie. Durch Selektieren eines Profilbereichs wird auf diesen gezoomt und die Standardattribute Streckenlänge, höchster, tiefster Punkt sowie ein Downloadlink zum GPX sind automatisch unterhalb des Profils sichtbar.    

5. Einziger **Schönheitsfehler**: unser formatierter Profilpfad wir durch eine blaue Linie überdeckt die das Plugin automatisch mit zeichnet. Im Gegensatz zum *leaflet-gpx* Modul bei dem der Stil der Linie über Optionen beim Aufruf definiert wird (siehe `polyline_options`) werden Stile bei *leaflet-elevation* ja über CSS in *Themes* definiert. Deshalb müssen wir etwas umständlich den Stil der Linie in *main.css* direkt überschreiben indem wir:

    * als `theme`-Attribut ein eigenes Theme angeben -> `theme: "adler-theme"`
    * in *main.css* die Profillinie unseres eigenen Themes auf unsichtbar setzen

        ```
        .adler-theme.elevation-polyline {
            stroke-opacity: 0.0;
        }
        ```

    Damit ist wieder unsere strichlierte schwarze Line des GPX-Moduls sichtbar


## H. Wikipedia-Artikel im Kartenausschnitt anzeigen

1. wir starten bei [https://www.geonames.org](https://www.geonames.org)

    * gehen dort auf Web Services -> Overview -> wikipediaBoundingBox -> JSON

    * und Testen das Beispiel mit unserem eigenen User-Account

    * die URL beginnt mit `http://` -> wir wollen aber `https://` also noch einmal zurück und
        * Web services -> Documentation -> Secure endpoint available at `secure.geonames.org`

    * unser neuer Demo-Request: `https://secure.geonames.org/wikipediaBoundingBoxJSON?` mit diesen URL-Parametern
        * `formatted=true`
        * `north=44.1`
        * `south=-9.9`
        * `east=-22.4`
        * `west=55.2`
        * `style=full`
        * `username=webmapping`

    * welche Zusatzsettings wollen wir noch:

        * `lang=de`
        * `maxRows=30`

    * Verbunden werden die Parameter mit einem Ampersand (`&`)

2. bevor wir die Marker mit einem Popup zeichnen definieren wir ein neues Overlay `overlay.wikipedia` (siehe `overlay.einkehr`)

3. alles was wir jetzt noch machen müssen, ist nach dem Zoomen/Pannen eine passende URL an `secure.geonames.org` zu senden und das JSON-Ergebnis in Marker mit Tooltipps umzuwandeln

    * das Callback für Zoom/Pan Ende sieht so aus

        ```
        map.on("zoomend moveend", function (evt) {

        });
        ```

        * bei Event-Listenern in Leaflet können wir auch mehrere Events gleichbehandeln indem wir sie durch ein Leerzeichen trennen
        
        * beim Hineinzoomen wird [zoomend](https://leafletjs.com/reference.html#map-zoomend) und beim Ausschnitt Verschieben [moveend](https://leafletjs.com/reference.html#map-moveend) angesprochen

    * den Ausschnitt ermitteln wir aus [getBounds](https://leafletjs.com/reference.html#map-getbounds) des `map`-Objekts. In diesem [LatLngBounds](https://leafletjs.com/reference.html#latlngbounds) Objekt bekommen wir die Eckkoordinaten über [getNorth](https://leafletjs.com/reference.html#latlngbounds-getnorth), [getSouth](https://leafletjs.com/reference.html#latlngbounds-getsouth), [getEast](https://leafletjs.com/reference.html#latlngbounds-geteast) und [getWest](https://leafletjs.com/reference.html#latlngbounds-getwest)

        ```
        let ext = {
            north : map.getBounds().getNorth(),
            south : map.getBounds().getSouth(),
            east : map.getBounds().getEast(),
            west : map.getBounds().getWest()
        }
        ```

    * dann setzen wir mit Template-Syntax die URL zusammen

        ```
        let url = `http://secure.geonames.org/wikipediaBoundingBoxJSON?lang=de&maxRows=30&north=${ext.north}&south=${ext.south}&east=${ext.east}&west=${ext.west}&username=webmapping`;
        ```

    * den Request schicken über die neue Methode `L.Util.jsonp` des `leaflet-ajax` Plugins ([https://github.com/calvinmetcalf/leaflet-ajax](https://github.com/calvinmetcalf/leaflet-ajax)) an die GeoNames Webseite

        * zuvor müssen wir natürlich `leafet.ajax` im *index.html* über den [cdnjs.com](https://cdnjs.com/libraries/leaflet-ajax)-Link einbinden

        ```
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-ajax/2.1.0/leaflet.ajax.min.js"></script>
        ```

        * dann senden wir den Request an diese Adresse
        
        ```
        L.Util.jsonp(url).then(function (data) {

        }
        ```

4. sobald die Antwort eingetroffen ist (i.e. `.then`) erstellen wir in einer Funktion unsere Marker samt Popup
        
    * in `data` werden dabei die JSON-Daten übergeben die wir uns mit `console.log(data)` r ansehen können

        wir sehen in  `data.geonames` einen Array aus Objekten mit den Attributen und Werten

        ```
        data.geonames = [
            {
                "summary": "St. Johann in Tirol, bei den Einheimischen (Dialekt) Sainihåns, ist eine Marktgemeinde mit Einwohnern (Stand) im österreichischen Bundesland Tirol im Bezirk Kitzbühel. Die Gemeinde liegt im Gerichtsbezirk Kitzbühel (...)",
                "elevation": 659,
                "geoNameId": 2766636,
                "feature": "city",
                "lng": 12.42326,
                "countryCode": "AT",
                "rank": 98,
                "thumbnailImg": "http://www.geonames.org/img/wikipedia/42000/thumb-41197-100.jpg",
                "lang": "de",
                "title": "St. Johann in Tirol",
                "lat": 47.52332,
                "wikipediaUrl": "de.wikipedia.org/wiki/St._Johann_in_Tirol"
            },
            // u.s.w
        ] 
        ```

    * in einer `for of` Schleife können wir die Marker mit Popup zeichnen

        ```
        for (let article of data.geonames) {
            let mrk = L.marker([article.lat, article.lng]).addTo(overlay.wikipedia);
            mrk.bindPopup(`
                <small>${article.feature}</small>
                <h3>${article.title} (${article.elevation}m)</h3>
                <p>${article.summary}</p>
                <a target="wikipedia" href="https://${article.wikipediaUrl}">Wikipedia Artikel</a>
            `)
        }
        ```

    * wenn es ein Bild gibt, zeigen wir es auch im Popup an - wir verwenden wieder `https://` bei den URLs

        ```
        let img = "";
        if (article.thumbnailImg) {
            article.thumbnailImg = article.thumbnailImg.replace("http", "https");
            img = `<img src="${article.thumbnailImg}" alt="thumbnail">`
        }
        ```

        den Inhalt der Variablen `img` (*nichts* oder ein Bild) müssen wir dann noch als `${img}` in das Popup schreiben

5. verschiedene Icons je nach Art des Attributs `feature`

    * die möglichen Features bekommen wir von [geonames.org](http://www.geonames.org/wikipedia/wikipedia_features.html)

    * die Icons kommen wieder von der [Map Icons Collection](https://mapicons.mapsmarker.com/)

        * Standardicon: Tourism -> `information.png`
        * `city`: Tourism -> `smallcity.png`
        * `landmark`:  Tourism -> `landmark.png`
        * `railwaystation`: Transportation -> `train.png`
        * `airport`: Transportation -> `helicopter.png`
        * `waterbody`: Nature -> `lake.png`
        * `mountain`: Nature -> `mountains.png`
        * `river`: Nature -> `river-2.png`
        * `glacier`: Nature -> `glacier-2.png`
        * `adm1st`, `adm2nd`,`adm3rd`: Offices -> `administration.png`

    * die Art des Icons wird über ein `switch`-Statement ermittelt (siehe [MDN switch-Statement](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Statements/switch))

            
         ```
         let png = "";
         switch (article.feature) {
             case "city":
                 png = "smallcity.png";
                 break;
             case "landmark":
                 png = "landmark.png";
                 break;
             case "railwaystation":
                 png = "train.png";
                 break;
             case "waterbody":
                 png = "lake.png";
                 break;
             case "mountain":
                 png = "mountains.png";
                 break;
             case "airport":
                 png = "helicopter.png";
                 break;
             case "river":
                 png = "river-2.png";
                 break;
             case "glacier":
                 png = "glacier-2.png";
                 break;
             default:
                    png = "information.png"
            }
        ```

        Bei `switch` können auch mehrere `case` Klauseln kombiniert werden - z.B. bei den administrativen Einheiten

        ```
        case "adm1st":
        case "adm2nd":
        case "adm3rd":
            png = "administration.png";
            break;
        ```

    * beim Marker wird wieder ein `L.icon` definiert und das ermittelte `png` verwendet

        ```
        let mrk = L.marker([article.lat, article.lng], {
            icon: L.icon({
                iconSize: [32, 37],
                iconAnchor: [16, 37],
                popupAnchor: [0, -37],
                iconUrl: `icons/${png}`
            })

        }).addTo(overlay.wikipedia);
        ```

6. **einen Schönheitsfehler gibt es noch ...**

Beim Öffnen der Popups am oberen Rand der Karte wird oft automatisch der Ausschnitt verschoben und damit eine neue Wikipedia-Abfrage gemacht. Bei dieser Abfrage werden über `overlay.wikipedia.clearLayers()` alle bestehenden Marker gelöscht und damit verschwindet auch unser Tooltipp :-(

**Lösung**: wir löschen nicht automatisch alle bestehenden Marker sondern merken uns, welche Marker wir schon gezeichnet haben und ergänzen nur die, die wir noch nicht gezeichnet haben. Dabei hilft uns die Position -> wir merken uns einfach lat/lng!

1. zuerst definieren wir ein Objekt in dem wir uns die gezeichneten Marker merken werden

    * direkt vor `map.on("zoomend moveend", function (evt){}`

    ```
    let drawnMarkers = {};
    ```

2. dann überprüfen wir in der `for of` Schliefe, ob wir einen Marker schon gezeichnet haben

    * wenn *Ja*, gehen wir mit `continue` ohne Zeichnen zum nächsten Eintrag
    * wenn *Nein* zeichnen wir den Marker und merken uns in `drawnMarkers` dass wir ihn gezeichnet haben

    * direkt nach `for (let article of data.geonames) { ...`

    ```
    let ll = `${article.lat}${article.lng}`;
    if (drawnMarkers[ll]) {
        continue
    } else {
        drawnMarkers[ll] = true;
    }

3. `overlay.wikipedia.clearLayers()` können wir dann noch auskommentieren / löschen


## I. document.location.search implementieren

Wenn wir beim Laden der Seite eine andere als die erste Etappe zeichnen wollen können wir:

1. beim Aufruf der Seite einen URL-Parameter `track` mit einer Etappennummer definieren

    * [index.html?track=5](index.html?track=5)

2. über `document.location.search` den gewünschten Track auslesen und als erstes zeichnen

* statt `drawEtappe(1);` schreiben wir jetzt

    ```
    let nr = 1;
    if (document.location.search) {
        nr = document.location.search.replace("?track=", "");
    }
    drawEtappe(nr);
    ```
