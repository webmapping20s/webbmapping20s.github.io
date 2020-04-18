### Workload für die Woche vom 16. April bis 23. April 2020

## Die GeoJson-Beispiele der letzten Session verfeinern

### Open Government Daten Wien

- beim Layer "Sehenswürdigkeiten Standorte" für jede Sehenswürdigkeit ein Popup mit Vorschaublid, Namen, Adresse sowie einem weiterführenden Link
- beim Layer "Weltkulturerbe" ein Popup mit Namen und Zusatzinfo sowie verschiedene (transparente) Flächenfarben für Kernzone (rot) und Pufferzone (gelb)
- beim Layer "Stadtwanderwege und RundumadumWanderweg Wien" die Bezeichnung des Weges als Popup und die Linien nach Typ: *Stadtwanderwege* schwarz strichliert, *Rundumadum Wege* schwarz punktiert - siehe dazu https://leafletjs.com/reference-1.6.0.html#path-dasharray

### Wetterstationen Tirol

- nur Wetterstationen anzeigen, für die auch ein Temperaturwert vorhanden ist
- das Popup verfeinern und folgende Attribute als Liste anzeigen:
    * Name und Seehöhe
    * Position lat/lng
    * Datum
    * Lufttemperatur
    * Windgeschwindigkeit
    * Relative Luftfeuchte
    * Schneehöhe
    * ein Link zu Grafiken für die jeweilige Wetterstation. Alles was ihr dazu braucht ist dieser "Musterlink" *https://lawine.tirol.gv.at/data/grafiken/1100/standard/tag/seegrube.png* und das Attribut `plot` ...


Parallel dazu für die einzelnen Schritte natürlich wieder GIT verwenden.

Bis spätestens **Donnerstag, 23. April 2020 mittags** sollen die Verfeinerungen unter `https://username.github.io/wien` und `https://username.github.io/aws-tirol` erreichbar sein
