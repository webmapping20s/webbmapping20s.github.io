# [COVID-19 Beispiel](index.html) HOWTO

Als Vorlage für das HTML Grundgerüst verwenden wir [template.zip](template.zip) -> auspacken als `username.github.io/world`

## A. Daten vorbereiten

1. [COVID-19 Data Repository](https://github.com/CSSEGISandData/COVID-19) vom *Center for Systems Science and Engineering (CSSE) at Johns Hopkins University* ist die Datenquelle

    * [csse_covid_19_data/csse_covid_19_time_series](https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series) ansteuern - hier sind die Rohdaten im CSV-Format verlinkt
        * [time_series_covid19_confirmed_global.csv](https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv)
        * [time_series_covid19_deaths_global.csv](https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv)
        * [time_series_covid19_recovered_global.csv](https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv)

    * bei jedem CSV-Link noch auf `Raw` klicken um zu den CSV Rohdaten zu gelangen

2. CSV in JSON und dann JS konvertieren

    * das Online Tool unserer Wahl ist [Convert CSV to JSON](https://www.convertcsv.com/csv-to-json.htm)
    * dort kopieren wir den Inhalt eines CSV-Files in den Bereich *Step 1: Select your input*
    * damit wir den Header mit den Zeitstempeln nicht verlieren wählen wir bei *Step 2: Choose input options* die Checkbox *First row is column name* **ab**. Damit wird der Header auch Teil unseres späteren Datensatzes.
    * bei *Step 5: Generate output* wählen wir `CSV To JSON Array` als *Choose Conversion Type*
    * und erhalten einen JSON Array von Arrays mit den gewünschten Daten
    * diese Daten kopieren wir in einen neuen [data.js](data.js)-File
    * und fügen eine Variablendeklaration mit `const` dazu - `data.js` sieht nach Konvertierung der drei CSV-Files dann so aus:

        ```
        const CONFIRMED=,// konvertierter Inhalt von confirmed
        const DEATHS=,// konvertierter Inhalt von deaths
        const RECOVERED=// konvertierter Inhalt von recovered
        ```

    diese drei Konstanten sind die Grundlage für unsere Visualisierung
    
    * wir binden [data.js](data.js) als Skript in `index.html` ein. In welcher Reihenfolge wird `data.js` einbinden ist egal, denn über das `defer`-Attribut beim  `main.js` ist sichergestellt, dass alle Daten geladen sind bevor wir die Karte zeichnen

        ```
        <script src="data.js"></script>
        ```

    * und testen sie mit `console.log` in `main.js`
        ```
        console.log(CONFIRMED);
        console.log(DEATHS);
        console.log(RECOVERED);
        ```

## B. Marker für den jüngsten Datensatz der bestätigten Fälle erzeugen

1. wir implementieren das Zeichnen in einer eigenen Funktion `drawMarker`

2. in einer `for`-Schleife arbeiten wir die einzelnen Datensätze der Konstanten `CONFIRMED` ab
    * wir beginnen bei `i=1` weil bei `i=0` der Datenheader steht, den wir erst später brauchen
    * jeden Datensatz merken wir uns in einer Variablen `row`
    * als Popup verwenden wir die administrativen Einheiten (`let reg`) im ersten und zweiten Eintrag von `row` mit den Indizes `0` und `1`
    * die Koordinaten für den Marker finden wir als dritten und vierten Eintrag von `row` mit den Indizes `2` (`let lat`) und `3`  (`let lng`)
    * der Wert des *jüngste Datensatzs* steht an der letzten Stelle des `row`-Arrays und kann über `row.length - 1` angesprochen werden (`let val`)

3. der komplette Code unsere `drawMarker`-Funktion,  die wir ganz zum Schluß natürlich aufrufen müssen um die Marker auch wirklich zu zeichnen, sieht damit so aus:

    ```
    let drawMarker = function () {
        for (let i = 1; i < CONFIRMED.length; i++) {
            let row = CONFIRMED[i];
            let reg = `${row[0]} ${row[1]}`;
            let lat = row[2];
            let lng = row[3];
            let val = row[row.length - 1];
            let mrk = L.marker([lat, lng]).addTo(map);
            mrk.bindPopup(`${reg} ${val}`);
        }
    }
    drawMarker();
    ```

## C. Größenkreise nach Fläche implementieren und in ein eigenes Overlay zeichnen

1. aus den Markern machen wir jetzt Flächen-proportionale Größenkreise mit zusätzlicher Skalierung - deshalb benennen wir die Funktion `drawMarker` in `drawCircles` um

    * nach der Formel `Fläche = Radius² * PI` berechnen wir den Radius (`let r`)
    * die Kreise werden sehr groß, deshalb multiplizieren wir die Fläche **vor** der Radiusberechnung mit einem Skalierungsfaktor (`let s=0.5`)
    * statt [L.marker](https://leafletjs.com/reference.html#marker) verwenden wir [L.circleMarker](https://leafletjs.com/reference.html#circlemarker) und setzen dessen [radius](https://leafletjs.com/reference.html#circlemarker-radius) Attribut auf den berechneten Wert

    ```
    let drawCircles = function () {
        for (let i = 1; i < CONFIRMED.length; i++) {
            // reg, lat, lng, val definieren ...

            let s = 0.5;
            let r = Math.sqrt(val * s / Math.PI);
            let circle = L.circleMarker([lat, lng], {
                radius: r
            }).addTo(map);
            circle.bindPopup(`${reg}: ${val}`);
        }
    }
    ```    

2. die Kreise zeichnen wir in ein eigenes ein-/ausschaltbares Overlay 
    
    * oberhalb von [L.control.layers](https://leafletjs.com/reference.html#control-layers) eine neue [L.featureGroup](https://leafletjs.com/reference.html#featuregroup) hinzufügen und an die Karte hängen

        ```
        let circleGroup = L.featureGroup().addTo(map);
        ```

    * in `L.control.layers` das neue Overlay einbauen

        ```
        L.control.layers({
            // baselayers
        }, {
            "Thematische Darstellung" : circleGroup
        }).addTo(map);
        ```

    * bei `L.circleMarker` die Kreise ans Overlay hängen

        ```
        let circle = L.circleMarker([lat, lng], {
            radius: r
        }).addTo(circleGroup);
        ```

## C. Anpassungen in drawCircles vornehmen um besser weiterbauen zu können

1. in `drawCircles` ist sowohl der zu visualisierende Datensatz als auch der anzuzeigende Datenwert fix eingestellt

    * der Datensatz ist jener mit den bestätigten Fällen -> `CONFIRMED`
    * der Datenwert ist das letzte Element des jeweiligen Datenarrays -> `row[row.length - 1]`

    * um später alle drei Themen und die Daten zu allen Zeitpunkten visualisieren zu können ist es besser, diese Informationen in Variablen festzuhalten, die wir dann leicht an einer einzigen Stelle ändern können. Deshalb führen wir am Beginn der `drawCircles` Funktion zwei neue Variablen ein - eine bestimmt das Thema (`let data`), die zweite den Index des Datenwerts (`let index`) den wir anzeigen wollen - wir nehmen dazu den Index des letzte Elements des ersten Datensatzes

        ```
        let data = CONFIRMED;
        let index = CONFIRMED[0].length - 1;
        ```

    * zusätzlich merken wir uns den Header mit den Zeitstempelen im ersten Datensatz von `CONFIRMED` gleich mit - der Header ist bei allen Themen gleich, also nehmen wir einfach einen davon

        ```
        let header = CONFIRMED[0];
        ```

    * dann müssen wir in `drawCircles` nur alle Vorkommen von `CONFIRMED` mit `data` ersetzen und statt `row.length - 1` die Variable `index` verwenden


## D. Thema und Datum des visualisierten Datensatzes anzeigen

Wir sehen zwar schon Kreise, wissen aber nicht, welchen Datenwert sie repräsentieren. Deshalb zeigen wir das Thema und Datum des Datenwerts beim Header der Karte an. Der Vorgang dabei:

1. in *index.html* ein `span-Element` mit `id="datum"` zum H2-Element im header-Bereich hinzufügen

2. in *main.js* mit `document.querySelector` eine Referenz auf diesen Span erzeugen und dessen Inhalt setzen

    * das Datum finden wir im Header beim Index des aktuellen datensatzes -> `header[index]`
    * das Thema setzen wir unterhalb von `let header` vorerst fix auf "*bestätigte Fälle*"

        ```
        let topic = "bestätigte Fälle";
        ```

    * mit Template-Syntax setzen wir unterhalb der `for`-Schleife das `.innerHTML` unsers Spans

        ```
        document.querySelector("#datum").innerHTML = `am ${header[index]} - ${topic}`;
        ```

## E. ein Auswahlmenü für die verschiedenen Themen implementieren

1. im *index.html* unterhalb der Karte ein `select`-Element mit der ID `pulldown` einfügen - siehe auch [MDN \<select\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)

    ```
    <select id="pulldown">
        <option value="confirmed" selected>bestätigte Fälle</option>
        <option value="deaths">Verstorbene</option>
        <option value="recovered">Genesene</option>
    </select>
    ```

    `selected` bestimmt, welcher Wert voreingestellt werden soll

2. in *main.js* auf Änderungen im Auswahlmenu reagieren - dazu verwenden wir einen `onchange` Eventhandler auf unser Pulldown mit der ID `pulldown`

    * oberhalb von `drawCircles();` fügen wir diesen Codeblock ein

        ```
        document.querySelector("#pulldown").onchange = function() {
            drawCircles();
        }
        ```

    * damit können wir schon mehrmals zeichnen (die Kreise werden immer dunkler weil sie sich überlagern), haben aber noch keinen Wechsel der Daten

3. den Datensatz aus dem Auswahlmenü bestimmen und neu zeichnen

    * in `drawCircles` speichern wir zuerst eine Referenz auf die Optionen des Pulldowns
    
        ```
        let options = document.querySelector("#pulldown").options;
        ```

    * in der Variablen `options` finden wir jetzt eine `HTMLOptionsCollection` die die drei Einträge des Pulldowns enthält und in `options.selectedIndex` den Index des ausgewählten Eintrags speichert
    
    
    * über `.value` und `.text` des selektierten Eintrags (i.e. `options[options.selectedIndex]`) können wir auf den Wert (*confirmed*, *deaths* oder *recovered*) und den Label des Eintrags (*bestätigte Fälle*, *Verstorbene* oder *Genesene*) zugreifen

        ```
        let value = options[options.selectedIndex].value;
        let label = options[options.selectedIndex].text;
        ```

    * `label` ersetzt unseren hard-gecodeten `topic`

    * `value` erlaubt uns vor der `for`-Schleife den Datensatz in einer `if`-Abfrage ensprechend zu setzen

        ```
        if (value === "confirmed") {
            data = CONFIRMED;
        } else if (value === "deaths") {
            data = DEATHS;
        } else {
            data = RECOVERED;
        }
        ```

    * dann müssen wir nur noch die bestehenden Kreise vor dem Neuzeichnen mit [clearLayers](https://leafletjs.com/reference.html#layergroup-clearlayers) löschen. Nachdem unsere Kreise immer in die `circleGroup` gezeichnet werden ist das nach der `if`-Abfrage einfach zu lösen

        ```
        circleGroup.clearLayers();
        ```

## F. die Daten zu verschiedenen Zeitpunkten visualisieren

1. im *index.html* vor dem Auswahlmenü fügen wir einen Slider mit der ID `slider` hinzu - siehe auch [MDN \<input type="range"\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range)
    ```
    <input id="slider" type="range">
    ```

2. in *main.css* machen wir den Slider länger
    ```
    #slider {
        width: 80%;
    }
    ```

3. in *main.js* (ab jetzt) initialisieren wir die Konfiguration des Sliders direkt vor dem letzten `drawCircles()` Aufruf. Bei Slidern kann man Minimum, Maximum, Schrittweite und den aktuellen Wert definieren.

    * das Minimum (`min`) entspricht dem Index des ersten Datenwerts eines Datensatzes - bei uns ist das `4`, denn davor stehen noch zwei Spalten mit administrativen Einheiten sowie Lat/Lng

    * das Maximum (`max`) entspricht dem Index des letzten Datenwerts - nachdem alle Datensätze gleich lang sind können wir ihn vom ersten Datensatz direkt ableiten

    * als Schrittweite `step` verwenden wir `1` - damit können wir von einem Index zum nächsten wechseln

    * als voreingestellten Wert (`value`) verwenden schließlich den letzten, sprich neuesten Datensatz - das ist also `slider.max`

    ```
    let slider = document.querySelector("#slider");
    slider.min = 4;
    slider.max = CONFIRMED[0].length - 1;
    slider.step = 1;
    slider.value = slider.max;
    ```

4. auf Änderungen im Auswahlmenu reagieren wir wieder in einem `onchange`-Event-Listener den wir direkt unter den Code der Initialisierung schreiben

    ```
    slider.onchange = function() {
        drawCircles();
    };
    ```

5. in `drawCircles` müssen wir dann nur mehr den aktuellen Wert des Sliders berücksichtigen indem wir `index` entsprechend setzen
    ```
    let index = document.querySelector("#slider").value;
    ```

**Tipp**: Wenn wir den Slider anklicken, können wir auch über die Pfeiltasten *links*, *rechts* zu den einzelnen Zeitpunkten wie bei einer Animation wechseln


## G. verschiedene Kreisfarben für die verschiedenen Themen

Unterschiedliche Farben bei den Kreisen nach Thema lassen sich in der `if`-Abfrage bei `L.circleMarker` definieren. Wir verwenden dabei Farben von [https://clrs.cc/](https://clrs.cc/)

    ```
    let color;
    if (value === "confirmed") {
        data = CONFIRMED;
        color = "#0074D9"; // Blue
    } else if (value === "deaths") {
        data = DEATHS;
        color = "#B10DC9"; // PURPLE
    } else {
        data = RECOVERED;
        color = "#2ECC40"; // GREEN
    }
    ```

Bei `L.circleMarker` müssen wir dann noch die Farbe mit `color : color` unterhalb von `radius : r` setzen


**Schönheitsfehler**: leider überdecken die großen Kreise die kleinen Kreise (z.B. US) was dazu führt, dass wir Popups der darunter liegenden Länder nicht öffnen können. Deshalb müssen wir die Daten absteigend innerhalb der aktuellen Datenspalte sortieren womit große Kreise zuerst gezeichnet und kleine Kreise später darüber gelegt werden.

* direkt vor der `for`-Schleife sortieren wir `data` mit Hilfe einer Sortierfunktion - siehe [MDN Array.prototype.sort()](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

    ```
    data.sort(function compareNumbers(row1, row2) {
        //console.log(index, row1[index], row2[index])
        return row2[index] - row1[index];
    });
    ```

* Was passiert dabei?

    * `index` ist der Index der aktuellen Datenspalte der weiter oben in der `drawCircles` Funktion aus dem Slider abgeleitet wurde
    * `row1` und `row2` beinhalten die zwei aufeinanderfolgenden Datenarrays die ich vergleichen will
    * `row2[index] - row1[index]` ist entweder kleiner `0`, `0` oder größer als `0`
        * ist dieses Ergebnis kleiner als 0, wird `row1` auf einen niedrigeren Index als `row2` sortiert, d. h. `row1` kommt zuerst
        * ist es gleich `0` bleibt es unverändert
        * ist es größer als `0`, wird `row2` auf einen niedrigeren Index als `row1` sortiert, d. h. `row2` kommt zuerst

    * das Resultat ist ein, nach der aktuellen Datenspalte absteigend sortierter Array von Arrays

## H. ... und dann noch eine Animation!

1. Wir starten und pausieren die Animation mit einem HTML `input`-Element vom Typ `button` den wir in *index.html* nach dem Pulldownmenü einfügen. Als Label für den Button verwenden wir ein passendes Symbol von [https://en.wikipedia.org/wiki/Media_control_symbols](https://en.wikipedia.org/wiki/Media_control_symbols)

    ```
    <input id="play" type="button" value="▶">
    ```

2. in *main.js* (ab jetzt) speichern wir eine Referenz auf den Button und reagieren mit einem `onclick` Event-Listener auf Klicks auf den Button. In dieser Funktion ermitteln wir zuerst den aktuellen Wert des Sliders und setzen ihn auf den ersten Datensatz, wenn wir schon beim letzten Datensatz sind. Unsere Animation wird damit entweder am Anfang oder der aktuellen Position gestartet.

    ```
    let playButton = document.querySelector("#play");
    playButton.onclick = function () {
        let value;
        if (slider.value == slider.max) {
            value = slider.min;
        } else {
            value = slider.value;
        }
    }
    ```

3. Animieren mit Hilfe von `window.setInterval` und `window.clearInterval`

    Der Code zum Animieren der Kreisgrößen sieht in seiner ersten Version so aus:

    ```
    let runningAnimation = null;

    playButton.onclick = function () {
        // Wert des Sliders in value ermitteln

        runningAnimation = window.setInterval(function () {
            slider.value = value;
            drawCircles();
            value++;

            if (value > slider.max) {
                window.clearInterval(runningAnimation);
                runningAnimation = null;
            }
        }, 250)
    }
    ```

    **was passiert dabei?**

    * außerhalb des `onclick` Event-Listeners definieren wir die Variable `runningAnimation` die uns helfen wird festzustellen, ob gerade eine Animation läuft oder nicht
    * innerhalb des `onclick` Event-Listeners wiederholt  `window.setInterval` alle 250 Millisekunden den Codeblock seiner Funktion und speichert die ID dieser Animation in `runningAnimation` ab - siehe auch [MDN .setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval). In der Funktion passiert Folgendes:
        * bei jedem Durchlauf wird die Karte neu gezeichnet und danach der Wert des Sliders um Eins erhöht 
        * wenn der nächste Sliderwert größer als der höchste Wert des Sliders wäre, haben wir den letzten Datensatz  erreicht und können die Animation mit `window.clearInterval` stoppen - siehe auch [MDN .clearInterval()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval)
        * `window.clearInterval` benötigt dazu die ID der laufenden Animation in `runningAnimation` und setzt selbige danach wieder auf `null` um anzuzeigen, dass keine Animation mehr läuft

    Damit läuft unsere Animation vom Start-, bzw. aktuell beim Slider eingestellten Zeitpunkt bis zum letzten Datensatz durch und stoppt dann

4. Pausieren der Animation

    Die Implementierung der Pause-Taste erfolgt in einer `if`-Abfrage die ermittelt, ob beim Klick auf den Button gerade eine Animation läuft, oder nicht. Ob, oder ob nicht entscheidet der aktuelle Wert von `runningAnimation`. Ist er nicht `null` (die ID von `setInterval` ist übrigens eine Zahl) läuft die Animation und wir stoppen sie mit `clearInterval` und setzen danach `runningAnimation` auf `null`, ist er `null` läuft keine Animation und wir starten die Animation neu.


    ```
    if (runningAnimation) {
        window.clearInterval(runningAnimation);
        runningAnimation = null;
    } else {
        runningAnimation = window.setInterval(function () {
            // Animation
        }, 250)
    }
    ```

    Damit können wir die Animation an jeder beliebigen Stelle durch Klick auf den Button stoppen, bzw. starten. Als optisches Feedback bleibt noch, den Label des Buttons auf *play* oder *pause* zu setzen:

    * vor der `if (runningAnimation) {...}` Abfrage setzen wir per default ein Pause-Zeichen
        
        ```
        playButton.value = "⏸";
        ```

    * innerhalb von `if (runningAnimation) {...}` beim Stoppen setzen wir wieder ein Play-Zeichen

        ```
        playButton.value = "▶";
        ```
    
    * innerhalb von `if (value > slider.max) {...}` beim automatischen Beenden setzen wir wieder ein Play-Zeichen

        ```
        playButton.value = "▶";
        ```

