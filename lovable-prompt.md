# Lovable Prompt: Kreuzfahrt & Reise Packlisten-Generator

Erstelle eine moderne, responsive Single-Page-App mit React, TypeScript, Tailwind CSS und shadcn/ui: **"Kreuzfahrt & Reise Packlisten-Generator"**

Die App ist komplett auf Deutsch.

---

## TECH-STACK & DESIGN-SYSTEM

**Tailwind-Konfiguration – erweitere `tailwind.config.ts`:**

```ts
colors: {
  navy: { DEFAULT: "#1a365d", light: "#2b6cb0" },
  accent: "#ed8936",
  surface: "#f7fafc",
  card: "#ffffff",
  ink: "#2d3748",
}
```

**Google Font:** "Plus Jakarta Sans" (über `<link>` in `index.html` einbinden, als `font-sans` in Tailwind setzen).

**Design-Prinzipien:**
- Clean, maritim, professionell.
- Mobile-first responsive.
- Keine externen Bilder – nur CSS, inline SVG und Lucide-Icons (`lucide-react`).
- Cards: `rounded-2xl shadow-md bg-card`.
- Zwischen Sektionen ein dezenter CSS-Wellen-Separator (SVG wave als `div` mit `position: absolute`, navy → surface oder surface → white).
- Buttons: Primary = `bg-navy text-white`, CTA = `bg-accent text-white hover:bg-orange-500`, mit `rounded-xl px-6 py-3 font-semibold`.

---

## DATENMODELL

Definiere in `src/data/types.ts`:

```ts
type Season = "sommer" | "winter" | "uebergang";
type TripType = "kreuzfahrt" | "strandurlaub" | "staedtereise" | "familienurlaub" | "natur";
type Gender = "frau" | "mann";
type Destination = "mittelmeer" | "karibik" | "nordeuropa" | "asien" | "fernreise";
type Luggage = "handgepaeck" | "koffer" | "beides";
type Priority = "essential" | "recommended" | "nice-to-have";

interface PackingItem {
  id: string;
  name: string;
  category: string;
  quantity: string;            // z.B. "2", "1 Set", "1 pro Person", "nach Bedarf"
  quantityPerDay: boolean;     // true → Menge × Reisetage
  quantityPerPerson: boolean;  // true → Menge × Personenzahl
  conditions: {
    seasons?: Season[];
    tripTypes?: TripType[];
    gender?: Gender[];
    hasKids?: boolean;
    minDays?: number;
    destinations?: Destination[];
  };
  luggage: Luggage;
  priority: Priority;
  proTip?: string;
}
```

Definiere in `src/data/userConfig.ts`:

```ts
interface UserConfig {
  packingFor: "frau" | "mann" | "paar";
  tripType: TripType;
  destination: Destination;
  season: Season;
  duration: "3-5" | "6-10" | "11-14" | "15+";
  kids: "nein" | "unter4" | "4-8" | "ueber8" | "mehrere";
}
```

---

## KOMPLETTER ITEM-DATENBESTAND

Erstelle in `src/data/packingItems.ts` ein Array `const packingItems: PackingItem[]` mit **allen** folgenden Items. Generiere für jedes Item eine eindeutige `id` (z.B. slugifizierter Name). Verwende die Kategorien exakt wie angegeben.

Die 11 Kategorien sind:
1. Kleidung
2. Schuhe & Accessoires
3. Kulturbeutel & Hygiene
4. Reiseapotheke
5. Technik & Gadgets
6. Dokumente & Finanzen
7. Strand & Pool
8. Kinder-Extras
9. Kreuzfahrt-Spezial
10. Handgepäck-Essentials
11. Sonstiges & Praktisches

### KLEIDUNG

**Für alle (gender: nicht gesetzt):**

| Name | quantity | perDay | seasons | tripTypes | luggage | priority | proTip |
|---|---|---|---|---|---|---|---|
| T-Shirts / Oberteile | 1 pro 2 Tage | true | alle | alle | koffer | recommended | |
| Langarm-Shirts | 2 | false | uebergang, winter | alle | koffer | recommended | |
| Leichte Sommerhose | 2 | false | sommer | alle | koffer | recommended | |
| Kurze Hosen / Shorts | 2 | false | sommer | alle | koffer | recommended | |
| Lange Hose / Jeans | 2 | false | alle | alle | koffer | recommended | |
| Gürtel | 1 | false | alle | alle | koffer | nice-to-have | |
| Pullover / Hoodie / Sweatshirt | 2 | false | alle | alle | koffer | recommended | Auch im Sommer sinnvoll: Die Klimaanlage auf Kreuzfahrtschiffen ist oft eiskalt. |
| Schlafanzug / Nachtwäsche | 1 | false | alle | alle | koffer | recommended | |
| Unterwäsche | 1 pro Tag + 2 Reserve | true | alle | alle | koffer | essential | |
| Socken | 1 Paar pro Tag | true | alle | alle | koffer | essential | |
| Leichte Jacke / Cardigan | 1 | false | alle | alle | handgepaeck | essential | Im Handgepäck mitnehmen – an Bord und im Flugzeug oft überraschend kühl. |
| Regenjacke (leicht, packbar) | 1 | false | alle | alle | koffer | essential | |
| Warmer Pullover / Fleecejacke | 1 | false | winter | alle | koffer | recommended | Auch bei Destination nordeuropa anzeigen. |
| Sportkleidung | 1 Set | false | alle | alle | koffer | nice-to-have | |

**Nur Frauen (gender: ["frau"]):**

| Name | quantity | perDay | seasons | tripTypes | luggage | priority | proTip |
|---|---|---|---|---|---|---|---|
| BH / Dessous | 3-4 | false | alle | alle | koffer | essential | |
| Strumpfhosen | 2 | false | winter, uebergang | alle | koffer | recommended | |
| Kleid / Sommerkleid / Strandkleid | 1-2 | false | sommer | alle | koffer | recommended | |
| Rock | 1 | false | sommer | alle | koffer | nice-to-have | |
| Bluse | 1-2 | false | alle | alle | koffer | recommended | |
| Tops | 2-3 | false | sommer | alle | koffer | recommended | |
| Abendkleid / elegantes Outfit (Gala-Abend) | 1 | false | alle | kreuzfahrt | koffer | recommended | Auf den meisten Kreuzfahrtschiffen gibt es 1-2 formelle Abende. Ein elegantes Kleid oder schicker Jumpsuit reicht völlig. |
| Schal / Seidentuch / Kopftuch | 1 | false | alle | alle | koffer | nice-to-have | Vielseitig einsetzbar: Als Sonnenschutz, Schulterbedeckung in Kirchen und Moscheen, oder gegen die Klimaanlage. |
| Bikini / Badeanzug | 2 | false | sommer | kreuzfahrt, strandurlaub | koffer | recommended | |

**Nur Männer (gender: ["mann"]):**

| Name | quantity | perDay | seasons | tripTypes | luggage | priority | proTip |
|---|---|---|---|---|---|---|---|
| Unterhemden | 3 | false | alle | alle | koffer | recommended | |
| Polo Shirts | 2 | false | sommer | alle | koffer | recommended | |
| Hemden | 1-2 | false | alle | alle | koffer | recommended | |
| Anzug / Sakko mit Hemd und Krawatte (Gala-Abend) | 1 | false | alle | kreuzfahrt | koffer | recommended | Bei Kreuzfahrten gibt es 1-2 Gala-Abende. Ein dunkler Anzug oder zumindest Sakko mit Hemd reicht aus. |
| Hosenträger | 1 | false | alle | kreuzfahrt | koffer | nice-to-have | |
| Badehose | 2 | false | sommer | kreuzfahrt, strandurlaub | koffer | recommended | |

### SCHUHE & ACCESSOIRES

| Name | quantity | perDay | perPerson | seasons | tripTypes | gender | luggage | priority | proTip |
|---|---|---|---|---|---|---|---|---|---|
| Bequeme Laufschuhe / Sneaker | 1 Paar | false | false | alle | alle | | koffer | essential | |
| Wanderschuhe / feste Schuhe | 1 Paar | false | false | alle | natur, staedtereise | | koffer | recommended | |
| Bequeme Sandalen | 1 Paar | false | false | sommer | alle | | koffer | recommended | |
| Flip-Flops / Badelatschen | 1 Paar | false | false | alle | strandurlaub, kreuzfahrt | | koffer | recommended | Für den Poolbereich und die Kabine auf dem Schiff unverzichtbar. |
| Badeschuhe / Aquaschuhe | 1 Paar | false | false | sommer | strandurlaub | | koffer | recommended | Besonders bei Destination karibik empfohlen. |
| Elegante Schuhe (Abend) | 1 Paar | false | false | alle | kreuzfahrt | | koffer | recommended | |
| Sonnenhut / Cap | 1 | false | false | sommer | alle | | handgepaeck | recommended | |
| Sonnenbrille | 1 | false | false | alle | alle | | handgepaeck | essential | |
| Rucksack für Landausflüge | 1 | false | false | alle | alle | | koffer | essential | |
| Strandtasche | 1 | false | false | sommer | strandurlaub, kreuzfahrt | frau | koffer | nice-to-have | |
| Handtasche | 1 | false | false | alle | alle | frau | koffer | nice-to-have | |

### KULTURBEUTEL & HYGIENE

**Für alle:**

| Name | quantity | seasons | luggage | priority | proTip |
|---|---|---|---|---|---|
| Duschgel (Reisegröße) | 1 | alle | koffer | recommended | In der Kabine gibt es Basis-Waschlotion und Seife. Wer auf seine eigenen Produkte nicht verzichten will, bringt Minis aus der Drogerie mit. |
| Shampoo & Spülung (Reisegröße) | 1 Set | alle | koffer | recommended | |
| Zahnbürste / elektrische Zahnbürste | 1 | alle | koffer | essential | |
| Zahnpasta | 1 | alle | koffer | essential | |
| Zahnseide / Interdentalbürsten | 1 | alle | koffer | recommended | |
| Deo | 1 | alle | koffer | essential | |
| Haarbürste / Kamm | 1 | alle | koffer | recommended | |
| Handcreme / Bodylotion | 1 | alle | koffer | recommended | |
| Lippenpflege / Labello | 1 | alle | handgepaeck | recommended | Salzige Seeluft trocknet die Lippen schnell aus – Labello gehört immer griffbereit ins Handgepäck. |
| Nagelset (Schere, Knipser, Feile, Pinzette) | 1 | alle | koffer | recommended | Nicht ins Handgepäck! |
| Wattestäbchen (Reisegröße) | 1 | alle | koffer | nice-to-have | |
| Handdesinfektionsmittel | 1 | alle | handgepaeck | recommended | |
| Febreze / Textilerfrischer | 1 | alle (kreuzfahrt) | koffer | nice-to-have | |
| Reisewaschmittel | 1 | alle | koffer | nice-to-have | |

**Nur Frauen (gender: ["frau"]):**

| Name | quantity | luggage | priority |
|---|---|---|---|
| Kosmetik / Schminkzeug / Make-up | 1 Set | koffer | recommended |
| Haarspray / Schaumfestiger | 1 | koffer | nice-to-have |
| Damenhygieneartikel (Binden / Tampons) | nach Bedarf | koffer | essential |
| Parfüm (Reisegröße) | 1 | koffer | nice-to-have |

**Nur Männer (gender: ["mann"]):**

| Name | quantity | luggage | priority |
|---|---|---|---|
| Rasierer / Elektrorasierer | 1 | koffer | essential |
| Rasierschaum / Rasiergel | 1 | koffer | recommended |
| Haargel / Haarstyling | 1 | koffer | nice-to-have |
| Aftershave / Parfüm (Reisegröße) | 1 | koffer | nice-to-have |

### REISEAPOTHEKE

**Schmerz & Fieber:**

| Name | quantity | seasons | destinations | luggage | priority | proTip |
|---|---|---|---|---|---|---|
| Schmerz- und Fiebermittel (Ibuprofen, Paracetamol) | 1 Packung | alle | | koffer | essential | Aspirin effect ist praktisch, weil man kein Wasser zum Einnehmen braucht. |
| Fieberthermometer | 1 | alle | | koffer | recommended | |

**Magen & Darm:**

| Name | quantity | seasons | destinations | luggage | priority | proTip |
|---|---|---|---|---|---|---|
| Mittel gegen Durchfall (Imodium akut / Loperamid) | 1 | alle | | koffer | essential | Grad auf Fernreisen und in südlichen Ländern kann Durchfall schnell den Tag ruinieren. |
| Mittel gegen Verstopfung (Dulcolax / Bisacodyl) | 1 | alle | | koffer | recommended | |
| Mittel gegen Sodbrennen (Talcid / Maaloxan) | 1 | alle | | koffer | recommended | Am Büffet zu sehr über die Stränge geschlagen? Talcid-Kautabletten helfen schnell. |
| Mittel gegen Übelkeit/Erbrechen (Vomex A) | 1 | alle | | koffer | recommended | |
| Rehydratationslösung (Elotrans) | 1 | alle | karibik, asien, fernreise | koffer | recommended | Bei Durchfall den Flüssigkeits- und Elektrolythaushalt schnell ausgleichen. |

**Seekrankheit:**

| Name | quantity | tripTypes | luggage | priority | proTip |
|---|---|---|---|---|---|
| Mittel gegen Seekrankheit (Superpep / Vomex) | 1 | kreuzfahrt | handgepaeck | essential | Mindestens für die ersten Seetage einpacken. Gibt es auch als Kaugummi – praktischer als Tabletten. |

**Erkältung:**

| Name | quantity | luggage | priority | proTip |
|---|---|---|---|---|
| Medikamente gegen Erkältung, Halsschmerzen, Husten | 1 Set | koffer | recommended | Stark klimatisierte Innenräume an Bord machen Erkältungen wahrscheinlicher als man denkt. |
| Abschwellendes Nasenspray | 1 | koffer | recommended | |
| Lutschtabletten gegen Halsschmerzen | 1 | koffer | nice-to-have | |

**Sonnenschutz & Insekten:**

| Name | quantity | seasons | destinations | luggage | priority | proTip |
|---|---|---|---|---|---|---|
| Sonnencreme LSF 50 | 1 | sommer | | koffer | essential | An Bord von Kreuzfahrtschiffen extrem teuer. Unbedingt von zu Hause mitbringen! |
| After-Sun-Lotion (Aloe Vera) | 1 | sommer | | koffer | recommended | |
| Insektenschutzmittel (Autan Spray) | 1 | sommer | karibik, asien, fernreise | koffer | essential | |
| Mittel gegen Insektenstiche (After Bite / Bite Away) | 1 | sommer | karibik, asien, fernreise | koffer | recommended | |

**Wundversorgung:**

| Name | quantity | luggage | priority |
|---|---|---|---|
| Wunddesinfektionsmittel | 1 | koffer | essential |
| Wasserfeste Wundpflaster | 1 Set | koffer | essential |
| Sterile Verbände / Kompressen | 1 Set | koffer | recommended |
| Einweghandschuhe | 2-4 | koffer | nice-to-have |
| Kleine Schere & Pinzette | 1 (im Nagelset) | koffer | recommended |

**Sonstiges Apotheke:**

| Name | quantity | destinations | luggage | priority | proTip |
|---|---|---|---|---|---|
| Augentropfen (Bepanthen) | 1 | | koffer | recommended | Trockene Augen nach langen Flugreisen oder durch Klimaanlagen – Augentropfen schaffen schnell Abhilfe. |
| Mittel gegen Allergien / Antihistaminikum | 1 | | koffer | recommended | |
| Mittel gegen Pilzinfektionen | 1 | | koffer | nice-to-have | |
| Kondome / Verhütungsmittel | nach Bedarf | | koffer | nice-to-have | |
| FFP2-Masken | 2 | | koffer | nice-to-have | |
| Persönliche Dauermedikamente | nach Bedarf | | handgepaeck | essential | IMMER im Handgepäck! Wenn der Koffer verloren geht, stehst du im Ausland ohne deine Medizin da. Rezeptkopie mitnehmen. |

**Homöopathie & Nahrungsergänzung (optional, alle nice-to-have):**

| Name | quantity | destinations | luggage | proTip |
|---|---|---|---|---|
| Arnica / Profelan Salbe (Prellungen) | 1 | | koffer | |
| Bachblüten Rescura Tropfen | 1 | | koffer | |
| Vitamin C & Zink | 1 | | koffer | |
| Probiotika | 1 | karibik, asien, fernreise | koffer | |

### TECHNIK & GADGETS

| Name | quantity | tripTypes | luggage | priority | proTip |
|---|---|---|---|---|---|
| Smartphone + Ladekabel | 1 | alle | handgepaeck | essential | |
| Powerbank (unter 27.000 mAh für Flug) | 1 | alle | handgepaeck | essential | |
| Kamera + Speicherkarten + Ladekabel | 1 Set | alle | handgepaeck | recommended | Speicherkarten lieber eine zu viel als zu wenig. Auf Kreuzfahrten fotografiert man mehr als gedacht. |
| Tablet + Ladekabel | 1 | alle | handgepaeck | nice-to-have | |
| Notebook / Laptop + Netzteil | 1 | alle | handgepaeck | nice-to-have | |
| Universal-Reiseadapter | 1 | alle | koffer | essential | Auf Kreuzfahrtschiffen gibt es oft europäische UND amerikanische Steckdosen. Bei deutschen Reedereien meist kein Adapter nötig. |
| Mehrfachsteckdose (ohne Überspannungsschutz!) | 1 | kreuzfahrt | koffer | recommended | In Kabinen gibt es meist nur 1-2 Steckdosen. Mehrfachstecker ist Gold wert. Achtung: TUI Mein Schiff verbietet Steckdosenleisten! |
| Kopfhörer (Noise Cancelling für Flug) | 1 | alle | handgepaeck | recommended | |
| E-Reader / Kindle | 1 | alle | handgepaeck | nice-to-have | |
| USB-Stick mit Reisedokumenten-Kopien | 1 | alle | handgepaeck | recommended | |

### DOKUMENTE & FINANZEN

| Name | quantity | perPerson | tripTypes | destinations | luggage | priority | proTip |
|---|---|---|---|---|---|---|---|
| Reisepass (Gültigkeit prüfen: mind. 6 Monate!) | 1 | true | alle | | handgepaeck | essential | Auf Kreuzfahrt den Pass IMMER im Safe der Kabine aufbewahren. Nicht auf Landausflüge mitnehmen, wenn nicht zwingend nötig. |
| Personalausweis | 1 | true | alle | | handgepaeck | essential | Personalausweis UND Reisepass mitnehmen, auch wenn nur einer nötig wäre. Getrennt aufbewahren! Ohne gültige Dokumente kommt man nicht an Bord. |
| Visum / E-Visa-Ausdrucke | nach Bedarf | false | alle | asien, fernreise | handgepaeck | recommended | |
| Krankenversicherungskarte | 1 | false | alle | | handgepaeck | essential | |
| Auslandskrankenversicherung (Nachweis) | 1 | false | alle | | handgepaeck | essential | |
| Allergiepass (falls vorhanden) | 1 | false | alle | | handgepaeck | nice-to-have | |
| Impfpass | 1 | true | alle | karibik, asien, fernreise | handgepaeck | recommended | |
| Kreditkarte (mind. 2 verschiedene) | 2 | false | alle | | handgepaeck | essential | |
| EC-Karte / Maestro-Karte | 1 | false | alle | | handgepaeck | recommended | |
| Bargeld + Fremdwährung | nach Bedarf | false | alle | | handgepaeck | essential | Fremdwährung am besten 2 Wochen vorher bei der Hausbank bestellen. |
| Führerschein (ggf. internationaler) | 1 | false | alle | | handgepaeck | recommended | |
| Buchungsbestätigungen (Flug, Hotel, Kreuzfahrt) | 1 Set | false | alle | | handgepaeck | essential | |
| Kreuzfahrt-Bordkarte / Set Sail Pass | 1 | true | kreuzfahrt | | handgepaeck | essential | |
| Reiseunterlagen der Reederei inkl. Vouchers | 1 Set | false | kreuzfahrt | | handgepaeck | essential | |
| Kopien aller Dokumente (digital + Papier) | 1 Set | false | alle | | beides | essential | |
| Notfallnummern (Banken, Kreditkarten, Versicherungen) | 1 Liste | false | alle | | handgepaeck | recommended | |
| ADAC-Karte / Auslandsschutzbrief | 1 | false | alle | | handgepaeck | nice-to-have | |

### STRAND & POOL

| Name | quantity | perPerson | seasons | tripTypes | hasKids | luggage | priority | proTip |
|---|---|---|---|---|---|---|---|---|
| Strandtuch / Mikrofaser-Handtuch | 1 | true | sommer | strandurlaub | | koffer | recommended | Auf Kreuzfahrtschiffen gibt es Pool-Handtücher an Bord. Für den Strand im Hafen trotzdem ein eigenes mitnehmen. |
| Schnorchelset | 1 | false | sommer | strandurlaub, kreuzfahrt | | koffer | nice-to-have | Destinations: mittelmeer, karibik |
| Dry Bag (wasserdichte Tasche) | 1 | false | alle | strandurlaub, natur | | koffer | recommended | |
| Strandspielzeug (Kinder) | 1 Set | false | sommer | strandurlaub | true | koffer | recommended | |
| Unterwasserhülle fürs Handy | 1 | false | sommer | strandurlaub | | koffer | nice-to-have | |

### KINDER-EXTRAS

**Alle Items in dieser Kategorie haben `hasKids: true`.**

| Name | quantity | perPerson/perKind | seasons | tripTypes | destinations | luggage | priority | proTip |
|---|---|---|---|---|---|---|---|---|
| Kinderreisepass | 1 pro Kind | true | alle | alle | | handgepaeck | essential | |
| Kindersonnencreme LSF 50+ | 1 | false | sommer | alle | | koffer | essential | |
| Kinder-Fiebersaft / Paracetamol-Zäpfchen | 1 | false | alle | alle | | koffer | essential | Fiebersaft und Zäpfchen in altersgerechter Dosierung – Tabletten sind für kleine Kinder ungeeignet. |
| Kinder-Ibuprofen-Saft | 1 | false | alle | alle | | koffer | essential | |
| Kinder-Durchfallmittel (Perenterol junior) | 1 | false | alle | alle | | koffer | essential | |
| Kinder-Mittel gegen Übelkeit (Vomex A Sirup) | 1 | false | alle | alle | | koffer | recommended | |
| Kinderpflaster (wasserfest, mit Motiven) | 1 | false | alle | alle | | koffer | essential | |
| Kinder-Insektenschutz (Autan Junior) | 1 | false | sommer | alle | karibik, asien | koffer | recommended | |
| Kinder-After-Sun-Lotion | 1 | false | sommer | alle | | koffer | recommended | |
| Kinder-Augentropfen (Euphrasia / Wala) | 1 | false | alle | alle | | koffer | nice-to-have | |
| Lieblingskuscheltier | 1 | false | alle | alle | | handgepaeck | essential | Das Kuscheltier IMMER ins Handgepäck. Wenn der Koffer verloren geht, ist DAS der wahre Notfall. |
| Beschäftigung für Flug/Fahrt (Malbuch, Sticker, Tablet) | 1 Set | false | alle | alle | | handgepaeck | essential | |
| Snacks für unterwegs | 1 Set | false | alle | alle | | handgepaeck | recommended | |
| Trinkflasche (leer für nach der Sicherheitskontrolle) | 1 pro Kind | true | alle | alle | | handgepaeck | recommended | |
| Wechselkleidung im Handgepäck | 1 Set pro Kind | true | alle | alle | | handgepaeck | essential | |
| Kinderkopfhörer (lautstärkebegrenzt) | 1 pro Kind | true | alle | alle | | handgepaeck | recommended | |
| Buggy / Reisebuggy (falls Kleinkind) | 1 | false | alle | alle | | handgepaeck | recommended | Kompakter Reisebuggy ist bis 3-4 Jahre auf Kreuzfahrten extrem praktisch, besonders in Häfen. Nur anzeigen wenn kids = unter4. |
| Schwimmwindeln | 1 Packung | false | sommer | alle | | koffer | recommended | Pflicht am Pool auf Kreuzfahrtschiffen für Kinder, die noch keine reguläre Badehose tragen. Nur anzeigen wenn kids = unter4. |
| Schwimmflügel / Schwimmhilfe | 1 pro Kind | true | sommer | kreuzfahrt, strandurlaub | | koffer | essential | |
| Nachtlicht (klein) | 1 | false | alle | alle | | koffer | nice-to-have | |

### KREUZFAHRT-SPEZIAL

**Alle Items haben `tripTypes: ["kreuzfahrt"]`.**

| Name | quantity | luggage | priority | proTip |
|---|---|---|---|---|
| Magnetische Haken für die Kabinenwand | 3-5 | koffer | recommended | Die Kabinenwände sind magnetisch! Haken zum Aufhängen von Jacken, Taschen und Schuhen sparen enorm Platz. |
| Lanyard / Schlüsselband für Bordkarte | 1 pro Person | koffer | recommended | Manche Reedereien nutzen noch physische Bordkarten. Ein Lanyard hält die Hände frei. |
| Kleiner Tagesrucksack für Landausflüge | 1 | koffer | essential | |
| Faltbare Einkaufstasche | 1 | koffer | nice-to-have | |
| Fernglas | 1 | koffer | nice-to-have | Für Ein-/Ausfahrt in Häfen und Wal-/Delfinbeobachtung vom Deck fantastisch. Auch bei tripType natur anzeigen. |
| Wiederverwendbare Trinkflasche | 1 pro Person | koffer | recommended | Wasser aus dem Buffet-Bereich abfüllen spart täglich Geld für Getränke. |
| Wäschenetz / Wäschebeutel | 1 | koffer | recommended | Trennt saubere und getragene Kleidung in der engen Kabine. |
| Wäscheklammern | 5-10 | koffer | recommended | Halten das Handtuch auf dem Balkon fest, den Duschvorhang auf Abstand und die Vorhänge bei Schaukeln geschlossen. Multitalent! |
| Strandtuchklammern | 2 | koffer | nice-to-have | |
| Kofferwaage | 1 | koffer | recommended | |
| Textmarker (für Bordprogramm) | 1 | koffer | recommended | Das Tagesprogramm an Bord ist oft mehrere Seiten lang. Mit Textmarker markierst du dir die Highlights. |
| Duct Tape / Gewebeband | 1 Rolle | koffer | nice-to-have | Universaltalent: Koffer verkleben, klappernde Schranktüren bei Seegang fixieren, Kabel bündeln. |
| Plastiktüten (für nasses Zeug) | 3-5 | koffer | recommended | |
| AIDA Chip-Armband (falls vorhanden) | 1 | koffer | nice-to-have | |

### HANDGEPÄCK-ESSENTIALS

| Name | quantity | luggage | priority | proTip |
|---|---|---|---|---|
| Reiseunterlagen-Organizer | 1 | handgepaeck | recommended | Alle Unterlagen für die Kreuzfahrt griffbereit in einer Mappe. |
| Geldgürtel mit RFID-Blocker | 1 | handgepaeck | recommended | Versteckt tragbar, auch für Dokumente und Handy. Ausweise und Zahlungsmittel IMMER getrennt aufbewahren! |
| Kugelschreiber | 1 | handgepaeck | essential | Klingt banal, spart aber Stress im Flugzeug wenn Einreiseformulare verteilt werden. |
| Transparenter Zipper-Beutel für Flüssigkeiten (1 Liter) | 1 | handgepaeck | essential | |
| Ohrstöpsel / Ohropax + Schlafmaske | 1 Set | handgepaeck | recommended | |
| Reise-Nackenkissen | 1 | handgepaeck | nice-to-have | |
| Kaugummi / Bonbons (Druckausgleich Flug) | 1 Packung | handgepaeck | nice-to-have | |
| Snacks & Getränke für die Anreise | 1 Set | handgepaeck | recommended | |
| Wechsel-T-Shirt | 1 | handgepaeck | recommended | |
| Reiseführer / E-Book-Reader / Zeitschrift | 1 | handgepaeck | nice-to-have | |
| Brille / Lesebrille / Brillenetui (falls nötig) | 1 | handgepaeck | recommended | |
| Kontaktlinsen + Kontaktlinsenflüssigkeit (falls nötig) | nach Bedarf | handgepaeck | recommended | |
| Taschentücher | 1 Packung | handgepaeck | recommended | |

### SONSTIGES & PRAKTISCHES

| Name | quantity | tripTypes | luggage | priority | proTip |
|---|---|---|---|---|---|
| (Ver-)Kleidung für Themenabende (White Nights, Alpenglühen etc.) | nach Bedarf | kreuzfahrt | koffer | nice-to-have | |
| Zubehör für Landausflüge (Schnorchelzeug, Radkleidung etc.) | nach Bedarf | alle | koffer | nice-to-have | |
| Reisenähset / Sicherheitsnadeln | 1 | alle | koffer | nice-to-have | |
| Fitnesstracker / Smartwatch | 1 | alle | handgepaeck | nice-to-have | |
| Reiseflaschen zum selbst Befüllen | 1 Set | alle | koffer | recommended | Eigenes Duschgel, Shampoo und Conditioner in kleine Reiseflaschen umfüllen – spart Platz und Gewicht. |

---

## APP-ARCHITEKTUR (Komponenten)

### Seiten-Layout (`App.tsx`)

Die App ist eine Single-Page-App mit zwei Zuständen: **Konfigurator** (Step 1) und **Ergebnis** (Step 2). Steuere das über einen React-State `step: 1 | 2`. Kein Router nötig.

```
<div className="min-h-screen bg-surface font-sans text-ink">
  <HeroSection />
  <WaveSeparator />
  {step === 1 ? <Configurator onSubmit={handleSubmit} /> : <PackingListResult config={config} onReset={() => setStep(1)} />}
  <WaveSeparator />
  <TipsSection tripType={config.tripType} />  // nur bei step 2
  <Footer />
</div>
```

### `HeroSection`

- Zentrierter Text auf `bg-navy` Hintergrund.
- Headline: `text-3xl md:text-5xl font-bold text-white` → "Kreuzfahrt & Reise Packlisten-Generator"
- Subline: `text-lg text-blue-200 max-w-2xl mx-auto` → "Nie wieder etwas Wichtiges vergessen. Erstelle deine personalisierte Packliste basierend auf Reiseziel, Reiseart und Jahreszeit – mit Expertentipps aus 40+ Kreuzfahrten."
- Darunter klein: "Ein Tool von [fernwehblog.net](https://fernwehblog.net/koffer-packliste-kreuzfahrt/)" – DoFollow-Link, `target="_blank"`, `rel="noopener"`.
- Dezentes Anker-/Kompass-Icon aus Lucide oben.

### `WaveSeparator`

Inline-SVG-Wellenform als visueller Trenner. Nutze einen `<svg>` mit `viewBox="0 0 1440 100"` und einem `<path>` für eine sanfte Welle. Die Farbe wechselt je nach Position (navy → surface, surface → white, etc.).

### `Configurator`

Überschrift: "Sag mir, wohin es geht" (`text-2xl font-bold text-navy`).

6 Auswahl-Gruppen als Card-Grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`). Jede Gruppe:
- Label über der Gruppe.
- Optionen als klickbare Cards (shadcn `Card` Komponente), die bei Auswahl einen `ring-2 ring-accent` Rahmen bekommen.
- Jede Option hat ein passendes Lucide-Icon + Text.

**Gruppe 1 – "Ich packe für":** Frau (User-Icon) | Mann (User-Icon) | Paar (Users-Icon)
**Gruppe 2 – "Reiseart":** Kreuzfahrt (Ship) | Strandurlaub (Umbrella) | Städtereise (Building) | Familienurlaub (Baby) | Natur & Abenteuer (Mountain)
**Gruppe 3 – "Reiseziel":** Mittelmeer (Sun) | Karibik (Palmtree) | Nordeuropa (Snowflake) | Asien (Globe) | Fernreise (Plane)
**Gruppe 4 – "Jahreszeit":** Sommer (Sun) | Winter (Snowflake) | Übergang (CloudSun)
**Gruppe 5 – "Reisedauer":** 3-5 Tage | 6-10 Tage | 11-14 Tage | 15+ Tage (Calendar-Icon)
**Gruppe 6 – "Kinder dabei?":** Nein | Ja, unter 4 | Ja, 4-8 | Ja, über 8 | Mehrere Altersgruppen (Baby-Icon)

Darunter ein großer CTA-Button: "Meine Packliste erstellen" (`bg-accent text-white text-lg rounded-xl px-8 py-4 font-bold shadow-lg hover:shadow-xl transition-all`). Der Button ist disabled, solange nicht alle 6 Gruppen ausgewählt sind.

### `PackingListResult`

**Oben:** Zusammenfassung als shadcn `Badge`-Reihe: z.B. "👩 Frau", "🚢 Kreuzfahrt", "☀️ Sommer", "🌍 Mittelmeer", "7 Tage". Nutze dafür Lucide-Icons statt Emojis, verpackt in `Badge variant="secondary"`.

**Fortschrittsbalken:** shadcn `Progress`-Komponente. Text: "X von Y Items eingepackt (Z%)".

**Filter-Leiste:** Buttons (shadcn `Button variant="outline"`): Alle | Nur Essential | Nur Handgepäck | Nur Koffer.
**Suchfeld:** shadcn `Input` mit Lucide `Search`-Icon. Filtert Items live nach Name.

**Packliste:** Verwende für jede der 11 Kategorien eine shadcn `Accordion`-Komponente (`AccordionItem`). Jede Kategorie zeigt:
- Kategorie-Icon (Lucide) + Name + Item-Anzahl als Badge.
- "Alles abhaken"-Button (klein, outline) pro Kategorie.
- Items als Liste:
  - shadcn `Checkbox` + Item-Name.
  - Berechnete Menge rechts (z.B. "7 Stück" bei 7 Tagen und quantityPerDay).
  - `Badge` für Luggage: "Handgepäck" (blau/`bg-blue-100 text-blue-800`) oder "Koffer" (grau/`bg-gray-100 text-gray-800`).
  - Priority-Dot: Essential = `bg-red-500`, Recommended = `bg-orange-400`, Nice-to-have = `bg-green-400` – als kleiner farbiger Kreis vor dem Namen.
  - Gender-Indikator: dezentes ♀ oder ♂ neben dem Namen, wenn geschlechtsspezifisch.
  - Wenn `proTip` vorhanden: Lucide `Info`-Icon, bei Klick öffnet sich ein shadcn `Tooltip` oder `Popover` mit dem Tipp-Text.

**Berechnung der angezeigten Items:**
1. Filtere alle `packingItems` anhand des `UserConfig`:
   - `conditions.seasons`: Wenn gesetzt, muss die gewählte Season enthalten sein. Wenn nicht gesetzt → immer anzeigen.
   - `conditions.tripTypes`: Wenn gesetzt, muss der gewählte TripType enthalten sein. Wenn nicht gesetzt → immer anzeigen.
   - `conditions.gender`: Wenn gesetzt, muss zum gewählten packingFor passen (bei "paar" → beide). Wenn nicht gesetzt → immer anzeigen.
   - `conditions.hasKids`: Wenn true, nur anzeigen wenn kids ≠ "nein".
   - `conditions.destinations`: Wenn gesetzt, muss die gewählte Destination enthalten sein. Wenn nicht gesetzt → immer anzeigen.
2. Berechne Mengen:
   - Basis: `quantity` (parse die Zahl daraus).
   - Wenn `quantityPerDay`: multipliziere mit Reisetagen (Mittelwert der Range, z.B. "6-10" → 8).
   - Wenn `quantityPerPerson`: multipliziere mit Personenzahl (1 bei frau/mann, 2 bei paar).
   - Bei "paar": Zeige geschlechtsspezifische Items beider Geschlechter, markiere mit ♀/♂.

**Aktionen unten:**
- "Als PDF speichern" → `window.print()`. Erstelle ein `@media print` Stylesheet: Nur Checkboxen und Text, keine Hintergrundfarben/Schatten, kompaktes Layout.
- "Neue Liste erstellen" → Zurück zum Konfigurator, alle States zurücksetzen.

### `TipsSection`

Nur sichtbar bei Step 2. Box mit Überschrift "Noch mehr Tipps für deine Reisevorbereitung". Zeigt 3-4 kontextuelle Links basierend auf `tripType`:

**Kreuzfahrt:**
- [Die ultimative Koffer-Packliste für Kreuzfahrer](https://fernwehblog.net/koffer-packliste-kreuzfahrt/)
- [Reiseapotheke: Unverzichtbare Medikamente](https://fernwehblog.net/reiseapotheke/)
- [Seekrankheit vorbeugen – Was wirklich hilft](https://fernwehblog.net/seekrankheit-kreuzfahrt/)
- [Kreuzfahrt-Tipps für Anfänger und Profis](https://fernwehblog.net/kreuzfahrt-tipps/)

**Strandurlaub:**
- [Die ultimative Koffer-Packliste](https://fernwehblog.net/koffer-packliste-kreuzfahrt/)
- [Reiseapotheke für den Urlaub](https://fernwehblog.net/reiseapotheke/)
- [Den richtigen Reisekoffer finden](https://fernwehblog.net/reisekoffer-hartschalenkoffer-weichschalenkoffer/)
- [Packliste erstellen mit KI](https://fernwehblog.net/reiseplanung-mit-ki-packliste/)

**Städtereise:**
- [Städtereisen Europa – Tipps & Inspiration](https://fernwehblog.net/staedtereisen-europa-tipps-staedtetrips/)
- [Reise-Apps die du kennen musst](https://fernwehblog.net/reise-apps-smartphone/)
- [Reiseapotheke für unterwegs](https://fernwehblog.net/reiseapotheke/)
- [Reise-Gadgets: Must-Haves für unterwegs](https://fernwehblog.net/reise-gadgets-kreuzfahrt-must-haves-amazon/)

**Familienurlaub:**
- [Kreuzfahrt mit Kindern – Der große Ratgeber](https://fernwehblog.net/kreuzfahrt-mit-kindern/)
- [Reiseapotheke für Familien](https://fernwehblog.net/reiseapotheke/)
- [Auslandskrankenversicherung – Was wichtig ist](https://fernwehblog.net/auslandskrankenversicherung-kreuzfahrt/)
- [Packlisten-Guide mit KI erstellen](https://fernwehblog.net/reiseplanung-mit-ki-packliste/)

**Natur & Abenteuer:**
- [Natur & Tierwelt erleben planen](https://fernwehblog.net/reiseplanung-mit-ki-natur-tierwelt/)
- [Reiseapotheke für Abenteurer](https://fernwehblog.net/reiseapotheke/)
- [Die beste Reisekamera finden](https://fernwehblog.net/reisekamera-sony-rx100-vii/)
- [Visa & Einreise recherchieren](https://fernwehblog.net/reiseplanung-mit-ki-visa-einreise/)

Alle Links: `target="_blank"`, `rel="noopener"`, DoFollow (kein `rel="nofollow"`).

### `Footer`

- `bg-navy text-white py-12`.
- "Kreuzfahrt & Reise Packlisten-Generator – Ein Tool von fernwehblog.net"
- Links (als `text-blue-300 hover:text-white` Links):
  - [Die ultimative Koffer-Packliste als Blog-Artikel mit Download-PDF](https://fernwehblog.net/koffer-packliste-kreuzfahrt/)
  - [Reiseapotheke: Alle Medikamente im Detail](https://fernwehblog.net/reiseapotheke/)
  - [Mehr Tools & Guides zur Reiseplanung mit KI](https://fernwehblog.net/reiseplanung-mit-ki-chatgpt-perplexity-guide/)
  - [Über Daniel Dorfer – Reisejournalist & Kreuzfahrtblogger](https://fernwehblog.net/about-us/)
- "© 2025 fernwehblog.net – Basierend auf der Erfahrung aus 40+ Kreuzfahrten und zahllosen Familienreisen"
- Alle Links: `target="_blank"`, `rel="noopener"`, DoFollow.

---

## SEO & META

In `index.html`:
- `<title>Kreuzfahrt & Reise Packlisten-Generator | fernwehblog.net</title>`
- `<meta name="description" content="Erstelle deine persönliche Packliste für Kreuzfahrt, Strandurlaub oder Städtereise – für Frauen und Männer. Mit Expertentipps aus 40+ Kreuzfahrten. Kostenlos.">`
- Open Graph Tags:
  - `og:title`: "Kreuzfahrt & Reise Packlisten-Generator | fernwehblog.net"
  - `og:description`: (gleich wie meta description)
  - `og:type`: "website"
  - `og:url`: (leer lassen)
- `<html lang="de">`

---

## PRINT-STYLESHEET

Erstelle ein `@media print` Stylesheet:
- Verstecke: Hero, Konfigurator, Filter-Buttons, Suchfeld, CTA-Buttons, Footer, TipsSection, Tooltips.
- Zeige: Zusammenfassung-Badges (als Text), Fortschrittsbalken (als Text), alle Kategorien aufgeklappt.
- Checkboxen als leere Kästchen (□) gedruckt.
- Kein Hintergrund, keine Schatten, kompakte Abstände.
- Schriftgröße 10pt, schwarz auf weiß.
- Seitenrand: 1.5cm.
- Oben auf der Druckseite: "Meine Packliste – erstellt mit fernwehblog.net"

---

## WICHTIGE HINWEISE

1. **State-Management:** Einfacher React State (`useState`). Kein localStorage, kein Redux. Abgehakte Items bleiben nur während der Session erhalten.
2. **Keine externen Bilder.** Nur Lucide-Icons, CSS-Gradienten und inline SVGs.
3. **Alle Texte auf Deutsch.**
4. **Performance:** Die Item-Liste kann 150+ Einträge haben. Verwende `useMemo` für die gefilterte/berechnete Liste.
5. **Accessibility:** Alle interaktiven Elemente mit Labels, korrekte Heading-Hierarchie (h1 → h2 → h3), ausreichender Farbkontrast.
6. **Smooth Scrolling:** Nach Klick auf "Meine Packliste erstellen" smooth nach oben zur Ergebnis-Sektion scrollen.
