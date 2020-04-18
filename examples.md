# Arbeitsbeispiele

### [Neuseelandreise in 18 Etappen](https://webmapping.github.io/nz/route.html)

HTML Seitenstruktur mit *head*, *body*, *header*, *main*, *div*, *footer*, *nav*; Überschriften, Links, Abbildungen mit *figure*, *img* und *figcaption*; public-domain Bilder von pixabay.com und wikimedia; Bildbearbeitung mit GIMP; Styling mit CSS in *main.css*, Responsive Design mit *max-width* und *@media* Regeln; Webfonts mit Google Fonts; Icons mit Font Awesome; *defer-Attribut* für das zentrale Javascript *main.js*; erste Leafletkarte mit *L.map* und einem Hintergrundlayer (*L.tileLayer*) aus *leaflet-providers*; Auslesen von *data-Attributen* des Karten-DIVS über *document.querySelector* zur Positionierung eines Markers mit *L.marker*; *template-Syntax* mit \`Backticks\` bei *.bindPopup*

### [COVID-19 Weltkarte](https://webmapping.github.io/world/index.html)

Umwandeln von CSV-Daten in JSON Arrays bei convertcsv.com; *if, else if, else Abfrage* zur Bestimmung der Datensätze *const CONFIRMED, DEATHS, RECOVERED* sowie der Kreisfarbe; Sortierung der verschachtelten Datenarrays nach Wert absteigend; *for-Schleife* zum Abarbeiten der Datenarrays; flächenproportionale *L.circleMarker* in eine eigene *L.featureGroup* zeichnen; *L.control.layers* für Hintergrundlayer und Overlay ein-, ausschaltbar; Interaktion zwischen Javascript und HTML; Titel der Karte als *span-Element* setzen; Themenauswahl über Puldownmenü mit *select*, *option* und dem Attribut *selected*; Slider für verschiedene Zeitpunkte der Daten mit *input type="range"* und den Attributen *min*, *max*, *step*, *value*; *.onchange-Callbacks* zum Neuzeichnen nach Themen- und Zeitpunktwechsel; Animation aller verfügbaren Zeitpunkt *.onclick* auf einen Button (*input type="button"*) mit *.setInterval* und *.clearInterval* mit Pauseoption.

### [Wien Open Government Data](https://webmapping.github.io/wien/index.html)

GeoJSON Punkte, Linien und Flächen zeichnen; Daten asynchron mit *L.geoJson.ajax* Plugin laden; *pointToLayer* Funktion für Marker mit *L.icon*; *style* Funktion für Farben von Linien und Flächen; *onEachFeature* Funktion für Popups aus *feature.properties* Attributen; *map.fitBounds* in Kkombination mit *.getBounds()* im *data:loaded* Callback zum Setzen des Kartenausschnitts nach dem Zeichnen der Marker; Zusammenfassen von Markern über das *L.markerClusterGroup* Plugin; Popups mit Bildern aus *feature.properties* Attributen; strichlierte und punktierte Linien mit *dashArray*

### [Wetterstationen Tirol](https://webmapping.github.io/aws-tirol/index.html)

work-in-progress ...