### Workload für die Woche vom 26. März bis 2. April 2020

## Eine Karte für deine Etappe der Neuseelandreise

Im der `main.js` Javascript-Datei eurer Etappe der Neuseelandreise ist noch viel Platz und deshalb sollt ihr dort bis zur nächsten Session eine Übersichtskarte mit Leaflet implementieren. Die Koordinaten zur Positionierung des Kartenmittelpunkts stehen im DIV mit der ID `map` als `data-lat` und `dat-lng` Attribute bereit und aus dem `data-title` Attribut lässt sich ein schönes Popup basteln, das nach dem Laden der Seite angezeigt werden kann.

Wie ihr in Leaflet eine einfache Karte implementieren könnt findet ihr auf der [Leaflet Tutorials Seite](https://leafletjs.com/examples.html) im [Leaflet Quick Start Guide](https://leafletjs.com/examples/quick-start/) Beispiel.

Der *Erfinder* von Leaflet, Vladimir Agafonkin, arbeitet heute als Entwickler bei der Firma [Mapbox](https://www.mapbox.com/), die unter anderem kommerziellen Support für Leaflet anbietet und in diesem Tutorial ein bisschen Werbung für sich machen will ;-) Deshalb könnt ihr als Kartenhintergrund diesen freien Layer der OpenStreetMap verwenden:

```
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>tributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https:/ntopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
})
```

Parallel dazu natürlich wieder GIT verwenden und allfällige im OLAT-Feedback erwähnte Fehler bereinigen.

Bis spätestens **Donnerstag, 2. April 2020 mittags** soll die fertige Etappe samt Karte unter `https://username.github.io/nz` erreichbar sein
