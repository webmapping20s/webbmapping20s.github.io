# [Neuseelandreise Beispiel](index.html) HOWTO

Als Vorlage für das HTML Grundgerüst verwenden wir [template.zip](template.zip) -> auspacken als `username.github.io/nz`

Dieses Template enthält das HTML-Grundgerüst der Musterseite ohne Formatierungen. Es besteht aus einem Header-Bereich mit Bannerbild, Überschrift sowie Icon, E-Mail Adresse und Github Adresse des Autors der Etappe. Im Hauptbereich ist eine kurze Intro zur Etappe, ein Bild einer Attraktion mit Kurzbeschreibung, ein leerer Karten-bereich in den wir später die Karte zeichnen werden sowie eine Linkliste mit Links zur Etappe. Der Footer-Bereich enthält zwei Links zur vorhergehenden und nächsten Etappe.

## CSS-Grundgerüst implementieren

1. das Stylesheet [main.css](main.css) fügen wir im `head`-Element gleich unter dem Seitentitel hinzu

    ```
    <link rel="stylesheet" href="main.css">
    ```

    **Tipp**: `STRG+Klick` auf den Dateinamen in Visual Studio Code erlaubt das Erzeugen von `main.css` - speichern nicht vergessen!


2. das `body`-Element formatieren

    ```
    body {
        max-width: 1280px;
        margin: auto;
        font-family: Arial;
    } 
    ```

    Über [max-width](https://developer.mozilla.org/de/docs/Web/CSS/max-width) wird die maximale Breite für die Seite gesetzt, [margin](https://developer.mozilla.org/de/docs/Web/CSS/margin) mit dem Wert `auto` bewirkt das horizontale Zentrieren der Seite. Damit rückt die Seite in die Mitte des Browserfensters. Als Schriftart ([font-family](https://developer.mozilla.org/de/docs/Web/CSS/font-family)) verwenden wir `Arial`

3. den Header-Bereich formatieren

    * Den gesamten Inhalt des Header-Bereichs über [text-align](https://developer.mozilla.org/de/docs/Web/CSS/text-align) zentrieren

        ```
        header {
            text-align: center;
        }
        ```

    * die Quelle für den Bildautor formatieren und rechts unten beim Banner positionieren

        ```
        header p {
            font-size: 0.8em;
            font-weight: bold;
            text-align: right;
            padding-right: 1em;
            margin-top: -2em;
        } 
        ```

        Der Absatz mit dem Link wird in etwas kleinerer ([font-size](https://developer.mozilla.org/de/docs/Web/CSS/font-size)), fetten ([font-weight](https://developer.mozilla.org/de/docs/Web/CSS/font-weight)) Schrift rechtsbündig mit einem kleinen Abstand ([padding](https://developer.mozilla.org/de/docs/Web/CSS/padding)) von der rechten Seite gesetzt. Der negative Wert bei `margin-top` schiebt den Link nach oben in das Bild hinein. Leider ist der Link jetzt schwer sichtbar, deshalb setzen wir im nächsten Schritt die Linkfarbe auf Weiß

        Die CSS-Einheit `em` setzt übrigens Werte in Abhängigkeit der `font-size`. Der Wert `0.8em` bei `font-size` bedeutet damit, dass die Textgröße 80% der normalen `font-size`  sein soll. Interessant zu lesen ist auch, woher dieses Kürzel kommt - siehe [The EM Square](http://designwithfontforge.com/en-US/The_EM_Square.html)


    * den Link in der Farbe Weiß anzeigen

        Dazu müssen wir zuerst ein [class](https://developer.mozilla.org/de/docs/Web/CSS/Klassenselektoren)-Attribut beim entsprechenden Absatz anbringen, das wir dann im CSS über die *Punkt-Notation* ansprechen können.

        * in *index.html*

            ```
            <p class="white">
            ```

        * in *main.css*
            ```
            .white,
            .white a:link,
            .white a:visited  {
                color: white;
            }
            ```

        Mit dieser CSS-Rule formatieren wir Hyperlinks ([a:link](https://developer.mozilla.org/de/docs/Web/CSS/:link)) und besuchte Hyperlinks ([a:visited](https://developer.mozilla.org/de/docs/Web/CSS/:visited)) in der Farbe Weiß ([color](https://developer.mozilla.org/de/docs/Web/CSS/color)).

        **Tipp**: noch mehr über Farben in CSS findet sich unter [MDN \<color\>](https://developer.mozilla.org/de/docs/Web/CSS/Farben)


    * das quadratische Userbild mit [border-radius](https://developer.mozilla.org/de/docs/Web/CSS/border-radius) abrunden

        ```
        header nav img {
            border-radius: 50%;
        }
        ```


    * die Links in der Farbe Schwarz anzeigen

        ```
        a:link,
        a:visited {
            color: black;
        }
        ```

    * die Adresse kleiner und mit [font-style](https://developer.mozilla.org/de/docs/Web/CSS/font-style) kursiv machen

        ```
        header nav address {
            font-size: 0.9em;
            font-style: italic;
        }         
        ```

4. den Hauptbereich formatieren

    * die Breite des `main`-Elements verringern und zentrieren

        ```
        main {
            max-width: 70%;
            margin: auto;
        } 
        ```

    * die Absätze im Hauptbereich im Blocksatz formatieren

        ```
        main p {
            text-align: justify;
        } 
        ```

    * das Bild der Attraktion mit Bildunterschrift formatieren

        ```
        main figure {
            margin-left: 0;
            width: 100%;
        }
        ```

        `figure`-Elemente werden immer eingerückt dargestellt. Mit `margin-left: 0` überschreiben wir dieses Verhalten.


        ```
        main figure img {
            width: 100%;
            border: 1px solid black;
        } 
        ```

        Neu ist hier die `border`-Eigenschaft - sie setzt in diesem Fall sowohl die Breite als auch die Art und Farbe. Alle Komponenten können auch einzeln definiert werden (siehe [MDN border](https://developer.mozilla.org/de/docs/Web/CSS/border))


    * einen Platzhalter für die Karte vorsehen

        * in *index.html* vergeben wir beim div-Element für die Karte ein [id](https://developer.mozilla.org/de/docs/Web/CSS/ID-Selektoren) Attribut mit dem Wert `map`

            ```
            <div id="map"></div>
            ```

        * in *main.css* können wir dieses Element über `#map` dann direkt ansprechen und seine Größe setzen. Der schwarze Rahmen zeigt uns den reservierten Platz an

            ```
            #map {
                width: 100%;
                height: 360px;
                border: 1px solid gray;
            } 
            ```

    * die Linkliste formatieren

        ```
        main ul {
            list-style-type: circle;
        }
        ```

        Über [list-style-type](https://developer.mozilla.org/de/docs/Web/CSS/list-style-type) können wir das Aufzählungszeichen von ungeordneten und geordneten Listen beeinflussen. In unserem Fall ersetzen wir den Standard Punkt durch Kreise.


5. den Footer-Bereich formatieren

    * Breite und Abstände setzen

        ```
        footer {
            width: 100%;
            padding: 1em 0 3em 0;
        }
        ```

        Die `padding`-Eigenschaft setzt, wenn man vier Werte angibt, die Abstände oben, rechts, unten und links. Verwendet man zwei Werte werden im ersten die Abstände oben und unten, im zweiten die Abstände rechts und links definiert. Wie bei `border` können natürlich alle Werte auch einzeln gesetzt werden (siehe [MDN padding](https://developer.mozilla.org/de/docs/Web/CSS/padding))

    * die Links der Etappennavigation nach rechts (vor) und links (zurück) verteilen

        * in *index.html* fügen wir bei den Links zwei neue Klassen-Attribute `back` und `next` ein
            ```
            <a class="back">...</a>
            <a class="next">...</a>
            ```

        * in *main.css* verteilen wir die beiden Links mit [float](https://developer.mozilla.org/de/docs/Web/CSS/float) nach Rechts und Links
        ```
        footer .back {
            float: left;
        }

        footer .next {
            float: right;
        }
        ```

        Die Doppelpfeile und das Trennzeichen der beiden Links hängen jetzt "in der Luft" - darum kümmern wir uns später


## B. Font Awesome Icons verfügbar machen

[Font Awesome](https://fontawesome.com/) ist eine umfangreiche Icon collection mit Tausenden Icons. In der [Icon Suche](https://fontawesome.com/icons?d=gallery) können wir nach Stichworten oder Themen suchen und alle frei verfügbaren Icons (Farbe schwarz) direkt für unsere Webseite verwenden. Ein Klick auf das gewünschte Icon erlaubt uns den nötigen HTML-Markup zu kopieren. Zuerst müssen wir natürlich das Font Awesome Skript einbinden und verwenden dazu [cdnjs.com](https://cdnjs.com/) - *The best FOSS CDN for web related libraries to speed up your websites!*

1. das Font Awesome Skript einbinden

    Über [cdnjs.com](https://cdnjs.com/libraries/font-awesome) finden wir den Link zur Bibliothek und kopieren dort über *Copy* den Eintrag *Copy Script Tag without SRI*. *SRI* steht für *Subresource Integrity* und wer es genau wissen will, der kann unter [MDN Subresource Integrity - web security](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) zu diesem komplexen Thema nachlesen. Für uns reicht der "einfach Link" des `all.min.js` Skripts
    
    ```
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/js/all.min.js"></script>
    ```

    Wir bauen es in *index.html*  im `head`-Element gleich nach dem Titel ein

2. die Icons verwenden:

    * bei den Autorenlinks im Header-Bereich vor dem `mailto`-Link und Github-Link

        ```
        <i class="fas fa-envelope-square"></i>
        <i class="fab fa-github"></i>
        ```

    * bei der Bildunterschrift der Attraktion in `figcaption`

        ```
        <i class="fas fa-camera-retro"></i>
        ```

    * bei der Etappennavigation innerhalb des jeweiligen Linktextes

        ```
        <i class="fas fa-arrow-left"></i>
        <i class="fas fa-arrow-right"></i>
        ```

        **Achtung** die Icons müssen innerhalb der Links, also zwischen `<a href>` und `</a>` eingebaut werden

        Die Doppelpfeile und das Pipe-Zeichen können wir jetzt löschen


## C. Google Fonts verwenden

Google Fonts ist eine freie Fontsammlung mit knapp 1000 Webfonts die wir so verwenden können:

1. [Google Fonts](https://fonts.google.com/) ansteuern
2. den gewünschten Font suchen -> wir verwenden [Open Sans](https://fonts.google.com/specimen/Open+Sans) von `Steve Matteson`
3. den gewünschten Style selektieren -> wir nehmen die beiden *Regular 400* Stile 
4. am rechten Rand erscheinen unter *Selected family* die gewählten Stile
5. auf *Embed* klicken und bei `<link>` die nötigen Anweisung kopieren

    * im `head`-Element von *index.html* kopieren wir das `link`-Element

        ```
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital@0;1&display=swap" rel="stylesheet">
        ```
    * beim `body`-Selektor von *main.css* setzen wir die `font-family`

        ```
        body {
            font-family: 'Open Sans', sans-serif;
        }
        ```

Für die Absätze im `main`-Element suchen wir uns einen zweiten Font. Wir gehen über `Browse fonts` in der Titelleiste wieder zur Font Suche, suchen [Roboto Condensed](https://fonts.google.com/specimen/Roboto+Condensed) von `Christian Robertson` und selektieren wieder die beiden *Regular 400* Stile. Damit haben wir unter *Selected families* jetzt 4 Stile im `link`-Element und zwei Selektoren für unser CSS File.

* wir ersetzen im `head`-Element von *index.html*

    ```
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital@0;1&family=Roboto+Condensed:ital@0;1&display=swap" rel="stylesheet">
    ```
* wir ergänzen beim `main p`-Selektor

    ```
    main p {
        font-family: 'Roboto Condensed', sans-serif;
    }
    ```

## D. @media-Regeln für minimales responsive Design

In Abhängigkeit des beim Betrachten der Seite verwendeten Devices kann man über [@media-Regeln](https://developer.mozilla.org/de/docs/Web/CSS/@media) noch Anpassungen im CSS-Stylesheet vornehmen. Die Möglichkeiten dabei sind vielfältig, wir begnügen uns jetzt damit, bei Browsern mit einer Bildschirmbreite unter 900 Pixeln, den `main`-Bereich von 70% auf 90% zu vergrößern.

```
@media screen and (max-width: 900px) {
    main {
        max-width: 90%;
    }
} 
```
**Tipp**: im Firefox können wir mit `STRG+Umschalt+M` oder im Menü unter *Extras / Web-Entwickler / Bildschirmgrößen testen* eine Vorschau unserer Seite für beliebige Bildschirmgrößen testen. Beim Vergrößern und Verkleinern der Seite können wir beim Übergang von 900px die Auswirkung unserer `@media`-Regel erkennen.

Mit einer zweiten `@media`-Regel stellen wir sicher, dass unser Bannerbild bei Browsern unter 1280px Breite (so groß ist das Banner im Original) automatisch auf die verfügbare Breite verkleinert wird.

```
@media screen and (max-width: 1280px) {
    header img {
        width: 100vw;
    }
} 
```

Leider wird dadurch auch unser Userbild auf 100% der verfügbaren Breite aufgeblasen, weshalb wir dem Bannerbild eine Klasse `banner` geben und im CSS sicherstellen, dass wir nur das Bannerbild verändern

* in *index.html* beim Bannerbild

    ```
    <img class="banner" ...>
    ```

* in *main.css*

    ```
    @media screen and (max-width: 1280px) {
        header img.banner {
            width: 100vw;
        }
    } 
    ```

## E. Übersichtskarte mit Icon und Popup für die Attraktion

Diese erste, einfache Übersichtskarte für unsere Etappenattraktion werden wir, wie alle weiteren Karten im Kurs, mit [Leaflet](https://leafletjs.com/) einer Opensource Javascript Kartenbibliothek erstellen.

1. zuerst binden wir die Leaflet-Bibliothek in *index.html* ein

    Die [Download Leaflet](https://leafletjs.com/download.html) Seite zeigt uns unter *Using a Hosted Version of Leaflet* die Syntax zum Einbau des Leaflet Stylesheets und Skripts

    ```
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script>
    ```

2. als Nächstes bereiten wir den `div` für die Karte vor

    * das ID-Attribut mit dem Wert `map` wird uns Zugriff auf das `div`-Element ermöglichen in das wir die Karte zeichnen
    * die geographische Länge, Breite und den Titel der Attraktion speichern wir in zwei HTML [data-Attributen](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) die wir beim Setzen des Ausschnitts sowie Erzeugen des Markers und Popups dann von dort auslesen werden

    ```
    <div id="map" data-lat="-39.134038" data-lng="175.654811" data-title="Emerald Seen"></div>
    ```

3. der Javascript Code für die Karte kommt in ein Skript mit dem Namen *[main.js](main.js)*

    * wir fügen dieses `script`-Element am Ende des `head`-Elements ein und stellen über das `defer`-Attribut sicher, dass es erst ausgeführt wird, wenn die ganze Seite geladen ist.

        ```
        <script defer src="main.js"></script>
        ```

    * **Tipp*: durch `STRG+Klick` auf main.js in Visual Studio Code erzeugen wir das Skript am richtigen Ort. Speichern nicht vergessen ...


4. die Karte initialisieren und auf den Ausschnitt blicken (ab jetzt arbeiten wir in *main.js*)
    
    * wir erzeugen als Erstes mit [document.querySelector](https://developer.mozilla.org/de/docs/Web/API/Document/querySelector) eine Referenz auf unseren Karten-DIV.

        ```
        let mapdiv = document.querySelector("#map");
        ```

    * Als nächstes initialisieren wir die Karte über [L.map](https://leafletjs.com/reference.html#map-l-map) und übergeben als ersten Parameter beim Aufruf die ID des Karten-DIVs. Damit wird festgelegt, wo die Karte gezeichnet werden soll. Im zweiten Parameter, dem *Options-Objekt*, setzen wir noch den Kartenmittelpunkt ([center](https://leafletjs.com/reference.html#map-center)) auf die `data-lat` und `data-lng` Werte im Karten DIV und den Zoomlevel ([zoom](https://leafletjs.com/reference.html#map-zoom)).

        ```
        let map = L.map("map", {
            center: [
                mapdiv.dataset.lat,
                mapdiv.dataset.lng
            ],
            zoom: 13
        }); 
        ```

        **Hinweis**: auf `data`-Attribute von HTML-Elementen kann über das `.dataset` Attribut in Javascript zugegriffen werden. Die Regel dabei: aus `data-name` beim Attribut wird `dataset.name` in Javascript. Verwenden wir Bindestriche im Attributwert werden diese in *[camelCase](https://en.wikipedia.org/wiki/Camel_case)* Schreibweise aufgelöst: aus `data-mein-name` wird damit `dataset.meinName`. Aus diesem Grund dürfen Großbuchstaben in `data-`Attributen **nicht** verwendet werden.

5. die [OpenTopoMap](https://opentopomap.org/) als Hintergrundlayer einbauen

    Unsere Karte ist damit schon auf die Koordinate zentriert, allerdings benötigen wir noch einen Hintergrundlayer um zu sehen, wo wir uns befinden. Das [OpenstreetMap](OpenstreetMap)-Projekt stellt uns diesen als [WMTS-Service](https://de.wikipedia.org/wiki/Web_Map_Tile_Service) zur Verfügung. Über [L.tileLayer](https://leafletjs.com/reference.html#tilelayer) können wir ihn direkt in `L.map` definieren. Ohne auf die Details der einzelnen Attribute und Werte bei der Layerdefinition einzugehen, sieht der endgültige Code zum Positionieren des Ausschnitts auf der weltweit verfügbaren OpenTopoMap so aus:

    ```
    let map = L.map("map", {
        center: [
            mapdiv.dataset.lat,
            mapdiv.dataset.lng
        ],
        zoom: 13,
        layers: [
            L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                maxZoom: 17,
                attribution: `Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>tributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https:/ntopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)`
            })
        ]
    });
    ```

6. den Marker setzen

    Über [L.marker](https://leafletjs.com/reference.html#marker) können wir die Position der Attraktion anzeigen. `L.marker` benötigt dabei als ersten Parameter ein [LatLng](https://leafletjs.com/reference.html#latlng)-Objekt, das wir auf verschiedenste Weisen angeben können. Wir entscheiden uns für die einfachste Variante und verwenden einen Array mit den beiden Werten. Über [addTo](https://leafletjs.com/reference.html#marker-addto) hängen wir den Marker an unsere Karte und machen ihn dadurch sichtbar.

    ```
    let mrk = L.marker([
        mapdiv.dataset.lat,
        mapdiv.dataset.lng
    ]).addTo(map)
    ```

7. das Popup an den Marker hängen und automatisch öffnen

    Über [bindPopup](https://leafletjs.com/reference.html#marker-bindpopup) hängen wir dann den Titel der Attraktion als Popup an den Marker und öffnen es automatisch mit [openPopup](https://leafletjs.com/reference.html#marker-openpopup)

    ```
    mrk.bindPopup(mapdiv.dataset.title).openPopup(); 
    ```

## F. das leaflet-providers Plugin für den Kartenhintergrund verwenden

Die Syntax für den Einbau des Hintergrundlayers mit `L.tileLayer` ist sehr aufwendig und deshalb werden wir für diese und alle weiteren Karten ein Plugin verwenden, das uns die Arbeit erleichtert. [leaflet-providers](https://github.com/leaflet-extras/leaflet-providers) heißt es und die [Demoseite](http://leaflet-extras.github.io/leaflet-providers/preview/index.html) zeigt uns alle verfügbaren Layer, darunter auch unsere *OpenTopoMap*.


Zuerst binden wir das Plugin Skript über [cdnjs.com](https://cdnjs.com/libraries/leaflet-providers) in *index.html* ein

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-providers/1.9.1/leaflet-providers.js"></script>
```

Dann ersetzen wir den komplizierten `L.tileLayer` Code in *main.js* mit einem Aufruf von `L.tileLayer.provider` dem wir das Keyword der gewünschten Karte, auf der Demoseite als *Provider name* ablesbar, übergeben.

```
layers: [
    L.tileLayer.provider("OpenTopoMap")
]
```


**Damit ist die Musteretappe der Neuseelandreise fertig. Die 18 Routen der Kursteilnehmer*innen finden sich [hier](route.html)**