### Workload für die Woche vom 30. April bis 7. Mai 2020

## Beispiel Adlerweg erweitern und zwei Kleinigkeiten

### A. alle Metadaten der Etappen im HTML sichtbar mchen

Von den 14 Attributen für jede Etappe in `etappen.js` sollt ihr, mit Ausnahme der Nummer, alle  über unsere `et-*` ID Lösung im HTML viusalisieren. Wie und wo ihr sie anzeigt bleibt euch überlassen, ich hätte aber gerne, dass die Einkehrmöglichkeiten mit Kommas statt der Rauten getrennt sind und aus dem `track`-Attribut ein Link zum Download des jeweiligen `.gpx` Files gemacht wird.

### B. besorgt euch einen geonames.org Account

Nächste Woche werden wir noch Wikipediainhalte in unsere Adlerwegkarte einbauen und dazu benötigt ihr einen kostenlosen Account bei [geonames.org](https://www.geonames.org/login)

### C. Teambuilding für die Projektphase

Findet euch bitte zu Dreierteams für die Projektphase zusammen und sendet mir bis spätestens **Dienstag Abend** ein Mail mit den Namen der Teammitglieder. Im Gegenzug bekommt ihr von mir als kleine Challenge die Nummern jener Etappen, für die ihr als Team die Koordinaten der Einkehrmöglichkeiten herausfinden und nach folgendem Muster in `einkehr.js` speichern sollt.

```
const EINKEHR = [
    [ Etappennummer (1-33), Einkehrmöglichkeit, Lat, Lng ],
    [ Etappennummer (1-33), Einkehrmöglichkeit, Lat, Lng ],
    // u.s.w.
];
```

Bis spätestens **Donnerstag, 7. Mai 2020 mittags** sollen die Ergänzungen unter `https://username.github.io/adlerweg` erreichbar sein und ihr einen `geonames.org` Account haben.
