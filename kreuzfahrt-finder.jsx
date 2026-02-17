import { useState, useEffect, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// STYLE CONSTANTS
// ═══════════════════════════════════════════════════════

const COLORS = {
  textPrimary: "#e2e8f0",
  textSecondary: "#8ba4b8",
  textMuted: "#64748b",
  textDisabled: "#475569",
  accent: "#0ea5e9",
  accentDark: "#0284c7",
  accentText: "#38bdf8",
  danger: "#f87171",
  dangerBg: "rgba(239,68,68,0.06)",
  dangerBorder: "rgba(239,68,68,0.15)",
  bgPage: "#0b1120",
  bgCard: "rgba(255,255,255,0.04)",
  bgCardHover: "rgba(14,165,233,0.07)",
  bgCardActive: "rgba(14,165,233,0.14)",
  bgSubtle: "rgba(255,255,255,0.03)",
  bgOverlay: "rgba(255,255,255,0.06)",
  borderDefault: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.05)",
  borderHover: "rgba(255,255,255,0.1)",
  borderAccent: "rgba(14,165,233,0.45)",
  borderAccentHover: "rgba(14,165,233,0.25)",
  borderAccentLight: "rgba(14,165,233,0.2)",
  accentBg: "rgba(14,165,233,0.1)",
  accentBgStrong: "rgba(14,165,233,0.08)",
  accentBgWeak: "rgba(14,165,233,0.12)",
  accentBgActive: "rgba(14,165,233,0.4)",
  progressTrack: "rgba(255,255,255,0.08)",
  white: "#fff",
  transparent: "transparent",
};

const GRADIENTS = {
  accent: "linear-gradient(135deg, #0ea5e9, #0284c7)",
  progress: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
  bgRadial1: "radial-gradient(ellipse at 20% 50%, rgba(14,165,233,0.05) 0%, transparent 50%)",
  bgRadial2: "radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.03) 0%, transparent 50%)",
};

const FONTS = {
  body: "var(--f)",
  heading: "var(--fh)",
};

// ═══════════════════════════════════════════════════════
// DATA: Reedereien (Kreuzfahrtlinien)
// ═══════════════════════════════════════════════════════

const REEDEREIEN = [
  {
    id: "aida", name: "AIDA Cruises", typ: "hochsee",
    kurzbeschreibung: "Das schwimmende Clubresort für alle, die Spaß, Action und entspannte Urlaubsstimmung auf Deutsch suchen.",
    usp: ["Deutschlands beliebteste Kreuzfahrtmarke", "Günstige Preise ab deutschen Häfen", "Lockere Club-Atmosphäre"],
    passt_nicht: "Nicht geeignet für Luxus-Liebhaber, Ruhesuchende oder Gäste ohne Deutschkenntnisse.",
    preisrange: "500–1.500 €", website: "https://www.aida.de",
    affiliate: "AWIN_LINK_AIDA",
    affiliateLabel: "AIDA Kreuzfahrten entdecken",
    scores: {
      budget_budget: 8, budget_mittel: 8, budget_premium: 3, budget_luxus: 0,
      gruppe_paar: 7, gruppe_familie_klein: 7, gruppe_familie_teen: 8, gruppe_solo: 5, gruppe_freunde: 8, gruppe_senioren: 4,
      ziel_mittelmeer: 9, ziel_karibik: 7, ziel_nordeuropa: 9, ziel_fernreise: 5, ziel_fluss: 0,
      atmosphaere_party: 9, atmosphaere_wellness: 5, atmosphaere_kultur: 3, atmosphaere_abenteuer: 2,
      schiff_mega: 9, schiff_mittel: 6, schiff_boutique: 0,
      sprache_deutsch: 10, sprache_international: 2,
      kulinarik_allinclusive: 8, kulinarik_auswahl: 7, kulinarik_gourmet: 2,
      kinder_keine: 1, kinder_vorhanden: 8, kinder_top: 6,
      entertainment_action: 9, entertainment_spa: 5, entertainment_expedition: 0,
      dresscode_leger: 10, dresscode_schick: 0,
    },
  },
  {
    id: "tui_cruises", name: "TUI Cruises (Mein Schiff)", typ: "hochsee",
    kurzbeschreibung: "Die Wohlfühlflotte mit Premium-All-Inclusive, riesigen Spa-Bereichen und entspannter Atmosphäre auf Deutsch.",
    usp: ["Premium All-Inclusive als Standard", "Riesige Spa- und Wellnessbereiche", "Deutschsprachig mit hohem Balkonanteil"],
    passt_nicht: "Nicht geeignet für Action-Liebhaber, die Wasserrutschen und laute Animation suchen.",
    preisrange: "800–2.200 €", website: "https://www.meinschiff.com",
    affiliate: "AWIN_LINK_MEINSCHIFF",
    affiliateLabel: "Mein Schiff Kreuzfahrten entdecken",
    scores: {
      budget_budget: 4, budget_mittel: 8, budget_premium: 7, budget_luxus: 1,
      gruppe_paar: 9, gruppe_familie_klein: 6, gruppe_familie_teen: 6, gruppe_solo: 5, gruppe_freunde: 7, gruppe_senioren: 7,
      ziel_mittelmeer: 9, ziel_karibik: 7, ziel_nordeuropa: 9, ziel_fernreise: 6, ziel_fluss: 0,
      atmosphaere_party: 4, atmosphaere_wellness: 9, atmosphaere_kultur: 4, atmosphaere_abenteuer: 2,
      schiff_mega: 6, schiff_mittel: 8, schiff_boutique: 0,
      sprache_deutsch: 10, sprache_international: 2,
      kulinarik_allinclusive: 10, kulinarik_auswahl: 8, kulinarik_gourmet: 5,
      kinder_keine: 1, kinder_vorhanden: 7, kinder_top: 5,
      entertainment_action: 5, entertainment_spa: 9, entertainment_expedition: 0,
      dresscode_leger: 8, dresscode_schick: 3,
    },
  },
  {
    id: "msc", name: "MSC Cruises", typ: "hochsee",
    kurzbeschreibung: "Italienisches Temperament auf riesigen Schiffen mit top Kinderprogramm zu günstigen Preisen.",
    usp: ["Mega-Ships mit italienischem Flair", "Top-Kinderprogramm ab 1 Jahr", "Unschlagbare Familienpreise"],
    passt_nicht: "Nicht geeignet für Ruhesuchende oder Gäste, die rein deutschsprachigen Service erwarten.",
    preisrange: "500–1.400 €", website: "https://www.msccruises.de",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/msc-kreuzfahrten?partner=DEINE_EHOI_ID",
    affiliateLabel: "MSC Cruises bei e-hoi entdecken",
    scores: {
      budget_budget: 9, budget_mittel: 7, budget_premium: 3, budget_luxus: 1,
      gruppe_paar: 7, gruppe_familie_klein: 9, gruppe_familie_teen: 9, gruppe_solo: 4, gruppe_freunde: 8, gruppe_senioren: 3,
      ziel_mittelmeer: 10, ziel_karibik: 8, ziel_nordeuropa: 7, ziel_fernreise: 6, ziel_fluss: 0,
      atmosphaere_party: 9, atmosphaere_wellness: 4, atmosphaere_kultur: 2, atmosphaere_abenteuer: 1,
      schiff_mega: 10, schiff_mittel: 3, schiff_boutique: 0,
      sprache_deutsch: 5, sprache_international: 9,
      kulinarik_allinclusive: 5, kulinarik_auswahl: 8, kulinarik_gourmet: 3,
      kinder_keine: 0, kinder_vorhanden: 8, kinder_top: 9,
      entertainment_action: 9, entertainment_spa: 4, entertainment_expedition: 0,
      dresscode_leger: 7, dresscode_schick: 5,
    },
  },
  {
    id: "costa", name: "Costa Cruises", typ: "hochsee",
    kurzbeschreibung: "Der günstigste Einstieg in die Kreuzfahrtwelt mit lässig-italienischer Lebensart.",
    usp: ["Niedrigste Einstiegspreise", "Italienisches Lebensgefühl", "Viele Mittelmeer-Routen"],
    passt_nicht: "Nicht geeignet für qualitätsbewusste Gäste mit hohen Serviceansprüchen.",
    preisrange: "350–1.100 €", website: "https://www.costakreuzfahrten.de",
    affiliate: "AWIN_LINK_COSTA",
    affiliateLabel: "Costa Kreuzfahrten entdecken",
    scores: {
      budget_budget: 10, budget_mittel: 6, budget_premium: 1, budget_luxus: 0,
      gruppe_paar: 6, gruppe_familie_klein: 7, gruppe_familie_teen: 6, gruppe_solo: 4, gruppe_freunde: 7, gruppe_senioren: 5,
      ziel_mittelmeer: 10, ziel_karibik: 6, ziel_nordeuropa: 6, ziel_fernreise: 4, ziel_fluss: 0,
      atmosphaere_party: 7, atmosphaere_wellness: 3, atmosphaere_kultur: 2, atmosphaere_abenteuer: 1,
      schiff_mega: 9, schiff_mittel: 5, schiff_boutique: 0,
      sprache_deutsch: 4, sprache_international: 9,
      kulinarik_allinclusive: 4, kulinarik_auswahl: 5, kulinarik_gourmet: 2,
      kinder_keine: 1, kinder_vorhanden: 6, kinder_top: 5,
      entertainment_action: 7, entertainment_spa: 3, entertainment_expedition: 0,
      dresscode_leger: 8, dresscode_schick: 4,
    },
  },
  {
    id: "royal_caribbean", name: "Royal Caribbean", typ: "hochsee",
    kurzbeschreibung: "Die größten und innovativsten Schiffe der Welt mit Wow-Faktor für die ganze Familie.",
    usp: ["Weltgrößte Schiffe mit Wow-Faktor", "Erstklassiges Familienprogramm", "Wasserrutschen, Surfanlage & Zipline"],
    passt_nicht: "Nicht geeignet für deutschsprachige Gäste ohne Englisch, Ruhesuchende oder Fans kleiner Schiffe.",
    preisrange: "650–2.500 €", website: "https://www.royalcaribbean.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/royal-caribbean?partner=DEINE_EHOI_ID",
    affiliateLabel: "Royal Caribbean bei e-hoi entdecken",
    scores: {
      budget_budget: 5, budget_mittel: 8, budget_premium: 6, budget_luxus: 1,
      gruppe_paar: 7, gruppe_familie_klein: 9, gruppe_familie_teen: 10, gruppe_solo: 5, gruppe_freunde: 9, gruppe_senioren: 4,
      ziel_mittelmeer: 7, ziel_karibik: 10, ziel_nordeuropa: 7, ziel_fernreise: 7, ziel_fluss: 0,
      atmosphaere_party: 9, atmosphaere_wellness: 4, atmosphaere_kultur: 2, atmosphaere_abenteuer: 2,
      schiff_mega: 10, schiff_mittel: 4, schiff_boutique: 0,
      sprache_deutsch: 2, sprache_international: 9,
      kulinarik_allinclusive: 4, kulinarik_auswahl: 9, kulinarik_gourmet: 4,
      kinder_keine: 1, kinder_vorhanden: 9, kinder_top: 10,
      entertainment_action: 10, entertainment_spa: 5, entertainment_expedition: 0,
      dresscode_leger: 7, dresscode_schick: 4,
    },
  },
  {
    id: "ncl", name: "Norwegian Cruise Line (NCL)", typ: "hochsee",
    kurzbeschreibung: "Freestyle Cruising ohne Regeln, maximale Freiheit und perfekt für Alleinreisende.",
    usp: ["Freestyle Cruising ohne Dresscode", "Eigene Solo-Kabinen", "Go-Kart und Broadway auf See"],
    passt_nicht: "Nicht geeignet für deutschsprachige Gäste ohne Englisch oder Traditions-Liebhaber.",
    preisrange: "700–2.000 €", website: "https://www.ncl.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/norwegian-cruise-line?partner=DEINE_EHOI_ID",
    affiliateLabel: "NCL bei e-hoi entdecken",
    scores: {
      budget_budget: 5, budget_mittel: 8, budget_premium: 5, budget_luxus: 2,
      gruppe_paar: 7, gruppe_familie_klein: 5, gruppe_familie_teen: 7, gruppe_solo: 9, gruppe_freunde: 8, gruppe_senioren: 4,
      ziel_mittelmeer: 7, ziel_karibik: 9, ziel_nordeuropa: 7, ziel_fernreise: 7, ziel_fluss: 0,
      atmosphaere_party: 8, atmosphaere_wellness: 5, atmosphaere_kultur: 2, atmosphaere_abenteuer: 2,
      schiff_mega: 9, schiff_mittel: 5, schiff_boutique: 0,
      sprache_deutsch: 2, sprache_international: 9,
      kulinarik_allinclusive: 5, kulinarik_auswahl: 9, kulinarik_gourmet: 5,
      kinder_keine: 1, kinder_vorhanden: 6, kinder_top: 5,
      entertainment_action: 9, entertainment_spa: 5, entertainment_expedition: 0,
      dresscode_leger: 10, dresscode_schick: 1,
    },
  },
  {
    id: "celebrity", name: "Celebrity Cruises", typ: "hochsee",
    kurzbeschreibung: "Modern Luxury für Design-Liebhaber und Genießer, stilvoll und erwachsenenorientiert.",
    usp: ["Preisgekröntes Modern-Luxury-Konzept", "Herausragende Küche", "Innovative Edge-Class-Schiffe"],
    passt_nicht: "Nicht geeignet für Familien mit kleinen Kindern, Party-Urlauber oder Budget-Reisende.",
    preisrange: "900–2.800 €", website: "https://www.celebritycruises.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/celebrity-cruises?partner=DEINE_EHOI_ID",
    affiliateLabel: "Celebrity Cruises bei e-hoi entdecken",
    scores: {
      budget_budget: 2, budget_mittel: 5, budget_premium: 9, budget_luxus: 4,
      gruppe_paar: 9, gruppe_familie_klein: 3, gruppe_familie_teen: 4, gruppe_solo: 6, gruppe_freunde: 7, gruppe_senioren: 7,
      ziel_mittelmeer: 8, ziel_karibik: 8, ziel_nordeuropa: 7, ziel_fernreise: 7, ziel_fluss: 0,
      atmosphaere_party: 3, atmosphaere_wellness: 9, atmosphaere_kultur: 6, atmosphaere_abenteuer: 3,
      schiff_mega: 6, schiff_mittel: 9, schiff_boutique: 1,
      sprache_deutsch: 1, sprache_international: 9,
      kulinarik_allinclusive: 5, kulinarik_auswahl: 9, kulinarik_gourmet: 7,
      kinder_keine: 4, kinder_vorhanden: 4, kinder_top: 2,
      entertainment_action: 3, entertainment_spa: 9, entertainment_expedition: 2,
      dresscode_leger: 5, dresscode_schick: 7,
    },
  },
  {
    id: "disney", name: "Disney Cruise Line", typ: "hochsee",
    kurzbeschreibung: "Magische Kreuzfahrten mit Mickey Mouse, das Nonplusultra für Familien mit Kindern.",
    usp: ["Weltweit beste Kinderbetreuung auf See", "Disney-Charaktere & Broadway-Shows", "Einziges Feuerwerk auf dem Meer"],
    passt_nicht: "Nicht geeignet für Budget-Reisende, kinderfreie Paare oder Gäste ohne Englischkenntnisse.",
    preisrange: "1.200–3.800 €", website: "https://disneycruise.disney.go.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/disney-cruise-line?partner=DEINE_EHOI_ID",
    affiliateLabel: "Disney Cruise Line bei e-hoi entdecken",
    scores: {
      budget_budget: 1, budget_mittel: 2, budget_premium: 8, budget_luxus: 4,
      gruppe_paar: 5, gruppe_familie_klein: 10, gruppe_familie_teen: 8, gruppe_solo: 2, gruppe_freunde: 4, gruppe_senioren: 3,
      ziel_mittelmeer: 5, ziel_karibik: 10, ziel_nordeuropa: 4, ziel_fernreise: 4, ziel_fluss: 0,
      atmosphaere_party: 5, atmosphaere_wellness: 5, atmosphaere_kultur: 3, atmosphaere_abenteuer: 3,
      schiff_mega: 7, schiff_mittel: 7, schiff_boutique: 0,
      sprache_deutsch: 0, sprache_international: 8,
      kulinarik_allinclusive: 5, kulinarik_auswahl: 7, kulinarik_gourmet: 5,
      kinder_keine: 0, kinder_vorhanden: 10, kinder_top: 10,
      entertainment_action: 7, entertainment_spa: 5, entertainment_expedition: 0,
      dresscode_leger: 8, dresscode_schick: 3,
    },
  },
  {
    id: "hapag_lloyd", name: "Hapag-Lloyd Cruises", typ: "hochsee",
    kurzbeschreibung: "Deutschlands Luxus-Reederei Nr. 1, von 5-Sterne-Plus-Suiten bis Expeditionen in die Arktis.",
    usp: ["Einzige 5-Sterne-Plus-Schiffe", "Expeditionen mit höchster Eisklasse", "Gourmetküche auf Sterneniveau"],
    passt_nicht: "Nicht geeignet für Budget-Reisende, Party-Urlauber oder Familien mit Animationsbedarf.",
    preisrange: "3.500–15.000 €", website: "https://www.hl-cruises.de",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/hapag-lloyd-cruises?partner=DEINE_EHOI_ID",
    affiliateLabel: "Hapag-Lloyd bei e-hoi entdecken",
    scores: {
      budget_budget: 0, budget_mittel: 0, budget_premium: 3, budget_luxus: 10,
      gruppe_paar: 9, gruppe_familie_klein: 3, gruppe_familie_teen: 3, gruppe_solo: 5, gruppe_freunde: 4, gruppe_senioren: 8,
      ziel_mittelmeer: 7, ziel_karibik: 5, ziel_nordeuropa: 9, ziel_fernreise: 9, ziel_fluss: 0,
      atmosphaere_party: 0, atmosphaere_wellness: 8, atmosphaere_kultur: 9, atmosphaere_abenteuer: 9,
      schiff_mega: 0, schiff_mittel: 0, schiff_boutique: 10,
      sprache_deutsch: 10, sprache_international: 5,
      kulinarik_allinclusive: 4, kulinarik_auswahl: 8, kulinarik_gourmet: 10,
      kinder_keine: 7, kinder_vorhanden: 3, kinder_top: 1,
      entertainment_action: 0, entertainment_spa: 8, entertainment_expedition: 10,
      dresscode_leger: 4, dresscode_schick: 7,
    },
  },
  {
    id: "phoenix", name: "Phoenix Reisen", typ: "hochsee",
    kurzbeschreibung: "Deutschsprachig, familiär und erschwinglich, die TV-bekannte Reederei für Best-Ager.",
    usp: ["Bestes Preis-Leistungs-Verhältnis auf Deutsch", "Familiäre Atmosphäre", "Bekannt aus Das Traumschiff"],
    passt_nicht: "Nicht geeignet für junge Reisende, Familien mit Kindern oder Fans moderner Mega-Ships.",
    preisrange: "900–2.500 €", website: "https://www.phoenixreisen.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/phoenix-reisen?partner=DEINE_EHOI_ID",
    affiliateLabel: "Phoenix Reisen bei e-hoi entdecken",
    scores: {
      budget_budget: 6, budget_mittel: 8, budget_premium: 4, budget_luxus: 1,
      gruppe_paar: 7, gruppe_familie_klein: 1, gruppe_familie_teen: 2, gruppe_solo: 6, gruppe_freunde: 4, gruppe_senioren: 10,
      ziel_mittelmeer: 8, ziel_karibik: 5, ziel_nordeuropa: 8, ziel_fernreise: 8, ziel_fluss: 0,
      atmosphaere_party: 1, atmosphaere_wellness: 5, atmosphaere_kultur: 7, atmosphaere_abenteuer: 3,
      schiff_mega: 0, schiff_mittel: 7, schiff_boutique: 6,
      sprache_deutsch: 10, sprache_international: 1,
      kulinarik_allinclusive: 5, kulinarik_auswahl: 4, kulinarik_gourmet: 4,
      kinder_keine: 9, kinder_vorhanden: 1, kinder_top: 0,
      entertainment_action: 1, entertainment_spa: 4, entertainment_expedition: 3,
      dresscode_leger: 5, dresscode_schick: 7,
    },
  },
  {
    id: "hurtigruten", name: "Hurtigruten", typ: "hochsee",
    kurzbeschreibung: "Norwegens legendäre Postschiffroute und Polarexpeditionen, Natur pur statt Animation.",
    usp: ["Legendäre norwegische Küstenroute", "Polarexpeditionen mit Wissenschaftsteam", "Nordlicht-Versprechen"],
    passt_nicht: "Nicht geeignet für Party-Urlauber, Familien mit kleinen Kindern oder Sonnenanbeter.",
    preisrange: "1.200–8.000 €", website: "https://www.hurtigruten.de",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/hurtigruten?partner=DEINE_EHOI_ID",
    affiliateLabel: "Hurtigruten bei e-hoi entdecken",
    scores: {
      budget_budget: 3, budget_mittel: 6, budget_premium: 7, budget_luxus: 3,
      gruppe_paar: 8, gruppe_familie_klein: 2, gruppe_familie_teen: 3, gruppe_solo: 7, gruppe_freunde: 5, gruppe_senioren: 7,
      ziel_mittelmeer: 1, ziel_karibik: 1, ziel_nordeuropa: 10, ziel_fernreise: 8, ziel_fluss: 0,
      atmosphaere_party: 0, atmosphaere_wellness: 4, atmosphaere_kultur: 7, atmosphaere_abenteuer: 10,
      schiff_mega: 0, schiff_mittel: 1, schiff_boutique: 9,
      sprache_deutsch: 5, sprache_international: 8,
      kulinarik_allinclusive: 5, kulinarik_auswahl: 4, kulinarik_gourmet: 4,
      kinder_keine: 9, kinder_vorhanden: 2, kinder_top: 0,
      entertainment_action: 1, entertainment_spa: 3, entertainment_expedition: 10,
      dresscode_leger: 10, dresscode_schick: 0,
    },
  },
  {
    id: "cunard", name: "Cunard", typ: "hochsee",
    kurzbeschreibung: "Britische Tradition mit Gala-Abenden und Afternoon Tea, Kreuzfahrt wie in der goldenen Ära.",
    usp: ["Einziger Transatlantik-Liniendienst", "Legendäre Gala-Abende", "Über 180 Jahre Tradition"],
    passt_nicht: "Nicht geeignet für Casual-Urlauber, Familien mit Kindern oder Gäste, die sich ungern schick anziehen.",
    preisrange: "800–4.000 €", website: "https://www.cunard.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/cunard?partner=DEINE_EHOI_ID",
    affiliateLabel: "Cunard bei e-hoi entdecken",
    scores: {
      budget_budget: 2, budget_mittel: 5, budget_premium: 8, budget_luxus: 7,
      gruppe_paar: 8, gruppe_familie_klein: 2, gruppe_familie_teen: 3, gruppe_solo: 6, gruppe_freunde: 4, gruppe_senioren: 9,
      ziel_mittelmeer: 7, ziel_karibik: 6, ziel_nordeuropa: 7, ziel_fernreise: 8, ziel_fluss: 0,
      atmosphaere_party: 1, atmosphaere_wellness: 6, atmosphaere_kultur: 10, atmosphaere_abenteuer: 1,
      schiff_mega: 4, schiff_mittel: 9, schiff_boutique: 0,
      sprache_deutsch: 2, sprache_international: 9,
      kulinarik_allinclusive: 3, kulinarik_auswahl: 7, kulinarik_gourmet: 8,
      kinder_keine: 7, kinder_vorhanden: 3, kinder_top: 1,
      entertainment_action: 1, entertainment_spa: 7, entertainment_expedition: 1,
      dresscode_leger: 1, dresscode_schick: 10,
    },
  },
  {
    id: "princess", name: "Princess Cruises", typ: "hochsee",
    kurzbeschreibung: "Das Love Boat lebt, klassische Eleganz mit modernster Technik und weltweiten Routen.",
    usp: ["MedallionClass-Technologie", "Größtes Alaska-Programm", "Weltreisen und 150+ Routen"],
    passt_nicht: "Nicht geeignet für junge Party-Urlauber, Familien mit Kleinkindern oder deutschsprachige Gäste.",
    preisrange: "500–2.400 €", website: "https://www.princess.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/princess-cruises?partner=DEINE_EHOI_ID",
    affiliateLabel: "Princess Cruises bei e-hoi entdecken",
    scores: {
      budget_budget: 4, budget_mittel: 8, budget_premium: 7, budget_luxus: 1,
      gruppe_paar: 8, gruppe_familie_klein: 4, gruppe_familie_teen: 5, gruppe_solo: 5, gruppe_freunde: 5, gruppe_senioren: 8,
      ziel_mittelmeer: 8, ziel_karibik: 7, ziel_nordeuropa: 7, ziel_fernreise: 9, ziel_fluss: 0,
      atmosphaere_party: 3, atmosphaere_wellness: 7, atmosphaere_kultur: 6, atmosphaere_abenteuer: 4,
      schiff_mega: 7, schiff_mittel: 7, schiff_boutique: 0,
      sprache_deutsch: 2, sprache_international: 9,
      kulinarik_allinclusive: 5, kulinarik_auswahl: 7, kulinarik_gourmet: 5,
      kinder_keine: 4, kinder_vorhanden: 5, kinder_top: 2,
      entertainment_action: 4, entertainment_spa: 7, entertainment_expedition: 1,
      dresscode_leger: 5, dresscode_schick: 7,
    },
  },
  {
    id: "azamara", name: "Azamara", typ: "hochsee",
    kurzbeschreibung: "Kleine Schiffe mit den längsten Hafenaufenthalten aller Reedereien, für echte Entdecker.",
    usp: ["Längste Hafenaufenthalte", "Exklusive AzAmazing-Kulturevents", "Kleine Schiffe, besondere Häfen"],
    passt_nicht: "Nicht geeignet für Familien mit Kindern, Action-Suchende oder Budget-Reisende.",
    preisrange: "1.300–4.000 €", website: "https://www.azamara.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/azamara?partner=DEINE_EHOI_ID",
    affiliateLabel: "Azamara bei e-hoi entdecken",
    scores: {
      budget_budget: 1, budget_mittel: 3, budget_premium: 8, budget_luxus: 5,
      gruppe_paar: 9, gruppe_familie_klein: 0, gruppe_familie_teen: 1, gruppe_solo: 6, gruppe_freunde: 5, gruppe_senioren: 8,
      ziel_mittelmeer: 9, ziel_karibik: 6, ziel_nordeuropa: 7, ziel_fernreise: 8, ziel_fluss: 0,
      atmosphaere_party: 1, atmosphaere_wellness: 6, atmosphaere_kultur: 8, atmosphaere_abenteuer: 4,
      schiff_mega: 0, schiff_mittel: 0, schiff_boutique: 9,
      sprache_deutsch: 1, sprache_international: 9,
      kulinarik_allinclusive: 7, kulinarik_auswahl: 5, kulinarik_gourmet: 6,
      kinder_keine: 10, kinder_vorhanden: 0, kinder_top: 0,
      entertainment_action: 1, entertainment_spa: 6, entertainment_expedition: 3,
      dresscode_leger: 8, dresscode_schick: 4,
    },
  },
  {
    id: "star_clippers", name: "Star Clippers", typ: "hochsee",
    kurzbeschreibung: "Echte Großsegler zum Mitsegeln, Abenteuer unter weißen Segeln für Romantiker.",
    usp: ["Einzige Großsegler-Kreuzfahrten", "Nur 170–227 Gäste", "Mitmach-Segeln & Wassersport"],
    passt_nicht: "Nicht geeignet für Familien mit Kleinkindern, Rollstuhlfahrer oder Gäste, die Shows erwarten.",
    preisrange: "1.100–5.500 €", website: "https://www.starclippers.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/star-clippers?partner=DEINE_EHOI_ID",
    affiliateLabel: "Star Clippers bei e-hoi entdecken",
    scores: {
      budget_budget: 2, budget_mittel: 4, budget_premium: 7, budget_luxus: 3,
      gruppe_paar: 9, gruppe_familie_klein: 1, gruppe_familie_teen: 3, gruppe_solo: 5, gruppe_freunde: 6, gruppe_senioren: 6,
      ziel_mittelmeer: 8, ziel_karibik: 8, ziel_nordeuropa: 1, ziel_fernreise: 5, ziel_fluss: 0,
      atmosphaere_party: 2, atmosphaere_wellness: 3, atmosphaere_kultur: 5, atmosphaere_abenteuer: 9,
      schiff_mega: 0, schiff_mittel: 0, schiff_boutique: 10,
      sprache_deutsch: 5, sprache_international: 9,
      kulinarik_allinclusive: 4, kulinarik_auswahl: 3, kulinarik_gourmet: 5,
      kinder_keine: 9, kinder_vorhanden: 1, kinder_top: 0,
      entertainment_action: 1, entertainment_spa: 2, entertainment_expedition: 6,
      dresscode_leger: 9, dresscode_schick: 2,
    },
  },
  {
    id: "explora", name: "Explora Journeys", typ: "hochsee",
    kurzbeschreibung: "Neue Ultra-Luxus-Marke mit Superyacht-Feeling, komplett All-Inclusive auf höchstem Niveau.",
    usp: ["Brandneue Superyacht-Schiffe", "Komplett All-Inclusive mit Champagner", "Nur Suiten mit Terrasse"],
    passt_nicht: "Nicht geeignet für Budget-Reisende, Familien mit Kindern oder Party-Urlauber.",
    preisrange: "3.100–10.000 €", website: "https://explorajourneys.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/explora-journeys?partner=DEINE_EHOI_ID",
    affiliateLabel: "Explora Journeys bei e-hoi entdecken",
    scores: {
      budget_budget: 0, budget_mittel: 0, budget_premium: 3, budget_luxus: 10,
      gruppe_paar: 9, gruppe_familie_klein: 2, gruppe_familie_teen: 2, gruppe_solo: 4, gruppe_freunde: 5, gruppe_senioren: 7,
      ziel_mittelmeer: 8, ziel_karibik: 8, ziel_nordeuropa: 7, ziel_fernreise: 6, ziel_fluss: 0,
      atmosphaere_party: 1, atmosphaere_wellness: 9, atmosphaere_kultur: 6, atmosphaere_abenteuer: 2,
      schiff_mega: 0, schiff_mittel: 5, schiff_boutique: 7,
      sprache_deutsch: 3, sprache_international: 10,
      kulinarik_allinclusive: 9, kulinarik_auswahl: 9, kulinarik_gourmet: 9,
      kinder_keine: 7, kinder_vorhanden: 3, kinder_top: 0,
      entertainment_action: 0, entertainment_spa: 10, entertainment_expedition: 1,
      dresscode_leger: 7, dresscode_schick: 6,
    },
  },
  {
    id: "oceania", name: "Oceania Cruises", typ: "hochsee",
    kurzbeschreibung: "Die beste Küche auf See, ein schwimmendes Gourmet-Restaurant für Feinschmecker und Weltreisende.",
    usp: ["Beste Küche aller Kreuzfahrtlinien", "Alle Spezialitätenrestaurants inklusive", "Exklusiv für Erwachsene"],
    passt_nicht: "Nicht geeignet für Familien mit Kindern, Party-Urlauber oder Budget-Reisende.",
    preisrange: "1.800–5.000 €", website: "https://www.oceaniacruises.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/oceania-cruises?partner=DEINE_EHOI_ID",
    affiliateLabel: "Oceania Cruises bei e-hoi entdecken",
    scores: {
      budget_budget: 0, budget_mittel: 2, budget_premium: 8, budget_luxus: 6,
      gruppe_paar: 9, gruppe_familie_klein: 0, gruppe_familie_teen: 1, gruppe_solo: 6, gruppe_freunde: 5, gruppe_senioren: 9,
      ziel_mittelmeer: 8, ziel_karibik: 7, ziel_nordeuropa: 7, ziel_fernreise: 9, ziel_fluss: 0,
      atmosphaere_party: 0, atmosphaere_wellness: 7, atmosphaere_kultur: 8, atmosphaere_abenteuer: 3,
      schiff_mega: 0, schiff_mittel: 7, schiff_boutique: 7,
      sprache_deutsch: 1, sprache_international: 8,
      kulinarik_allinclusive: 6, kulinarik_auswahl: 9, kulinarik_gourmet: 10,
      kinder_keine: 10, kinder_vorhanden: 1, kinder_top: 0,
      entertainment_action: 0, entertainment_spa: 8, entertainment_expedition: 2,
      dresscode_leger: 7, dresscode_schick: 5,
    },
  },
  {
    id: "arosa", name: "A-ROSA", typ: "fluss",
    kurzbeschreibung: "Premium-Flusskreuzfahrten mit All-Inclusive, entspannt über Europas schönste Flüsse gleiten.",
    usp: ["Premium All-Inclusive auf dem Fluss", "Bestes Familien-Flussschiff", "Kinder bis 15 reisen gratis"],
    passt_nicht: "Nicht geeignet für Abenteurer oder Gäste, die exotische Flüsse suchen.",
    preisrange: "800–2.500 €", website: "https://www.a-rosa.de",
    affiliate: "AWIN_LINK_AROSA",
    affiliateLabel: "A-ROSA Flusskreuzfahrten entdecken",
    scores: {
      budget_budget: 6, budget_mittel: 8, budget_premium: 6, budget_luxus: 1,
      gruppe_paar: 8, gruppe_familie_klein: 7, gruppe_familie_teen: 6, gruppe_solo: 5, gruppe_freunde: 6, gruppe_senioren: 6,
      ziel_mittelmeer: 0, ziel_karibik: 0, ziel_nordeuropa: 0, ziel_fernreise: 0, ziel_fluss: 9,
      atmosphaere_party: 2, atmosphaere_wellness: 7, atmosphaere_kultur: 5, atmosphaere_abenteuer: 2,
      schiff_mega: 0, schiff_mittel: 0, schiff_boutique: 9,
      sprache_deutsch: 9, sprache_international: 3,
      kulinarik_allinclusive: 8, kulinarik_auswahl: 5, kulinarik_gourmet: 4,
      kinder_keine: 2, kinder_vorhanden: 8, kinder_top: 5,
      entertainment_action: 2, entertainment_spa: 7, entertainment_expedition: 1,
      dresscode_leger: 9, dresscode_schick: 1,
    },
  },
  {
    id: "nicko", name: "nicko cruises", typ: "fluss",
    kurzbeschreibung: "Von der Donau bis zum Mekong, die größte Routenvielfalt aller deutschen Flussreedereien.",
    usp: ["Breiteste Routenvielfalt inkl. Nil & Mekong", "Haustürabholung inklusive", "Über 30 Jahre Erfahrung"],
    passt_nicht: "Nicht geeignet für Familien mit Kindern oder Gäste, die durchgängig moderne Schiffe erwarten.",
    preisrange: "700–2.000 €", website: "https://www.nicko-cruises.de",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/nicko-cruises?partner=DEINE_EHOI_ID",
    affiliateLabel: "nicko cruises bei e-hoi entdecken",
    scores: {
      budget_budget: 7, budget_mittel: 8, budget_premium: 4, budget_luxus: 1,
      gruppe_paar: 7, gruppe_familie_klein: 1, gruppe_familie_teen: 2, gruppe_solo: 5, gruppe_freunde: 5, gruppe_senioren: 9,
      ziel_mittelmeer: 1, ziel_karibik: 0, ziel_nordeuropa: 1, ziel_fernreise: 0, ziel_fluss: 9,
      atmosphaere_party: 1, atmosphaere_wellness: 4, atmosphaere_kultur: 7, atmosphaere_abenteuer: 3,
      schiff_mega: 0, schiff_mittel: 1, schiff_boutique: 10,
      sprache_deutsch: 10, sprache_international: 3,
      kulinarik_allinclusive: 3, kulinarik_auswahl: 4, kulinarik_gourmet: 4,
      kinder_keine: 9, kinder_vorhanden: 1, kinder_top: 0,
      entertainment_action: 0, entertainment_spa: 4, entertainment_expedition: 1,
      dresscode_leger: 7, dresscode_schick: 5,
    },
  },
  {
    id: "viva", name: "Viva Cruises", typ: "fluss",
    kurzbeschreibung: "Die junge Premium-Reederei mit dem großzügigsten All-Inclusive auf Europas Flüssen.",
    usp: ["Umfassendstes All-Inclusive mit Minibar", "Jüngstes Publikum aller Flussreedereien", "Zweisprachig DE/EN"],
    passt_nicht: "Nicht geeignet für Familien mit Kindern oder Gäste, die exotische Flüsse suchen.",
    preisrange: "1.000–2.600 €", website: "https://www.viva-cruises.com",
    affiliate: "https://www.e-hoi.de/kreuzfahrten/viva-cruises?partner=DEINE_EHOI_ID",
    affiliateLabel: "Viva Cruises bei e-hoi entdecken",
    scores: {
      budget_budget: 3, budget_mittel: 7, budget_premium: 8, budget_luxus: 3,
      gruppe_paar: 9, gruppe_familie_klein: 1, gruppe_familie_teen: 1, gruppe_solo: 5, gruppe_freunde: 6, gruppe_senioren: 7,
      ziel_mittelmeer: 0, ziel_karibik: 0, ziel_nordeuropa: 0, ziel_fernreise: 0, ziel_fluss: 9,
      atmosphaere_party: 1, atmosphaere_wellness: 7, atmosphaere_kultur: 6, atmosphaere_abenteuer: 1,
      schiff_mega: 0, schiff_mittel: 0, schiff_boutique: 10,
      sprache_deutsch: 8, sprache_international: 6,
      kulinarik_allinclusive: 10, kulinarik_auswahl: 4, kulinarik_gourmet: 7,
      kinder_keine: 9, kinder_vorhanden: 1, kinder_top: 0,
      entertainment_action: 0, entertainment_spa: 7, entertainment_expedition: 0,
      dresscode_leger: 8, dresscode_schick: 2,
    },
  },
];

// Vorberechnete Lookup-Map fuer O(1)-Zugriff statt linearer Suche
const REEDEREI_BY_ID = new Map(REEDEREIEN.map((r) => [r.id, r]));

// ═══════════════════════════════════════════════════════
// DATA: Quiz-Fragen
// ═══════════════════════════════════════════════════════

const QUESTIONS = [
  {
    id: "budget",
    title: "Dein Budget",
    subtitle: "Was darf die Kreuzfahrt pro Person und Woche kosten?",
    icon: "\u20AC",
    multi: false,
    options: [
      { label: "Unter 1.000 \u20AC", desc: "Hauptsache g\u00FCnstig aufs Meer", scoreKey: "budget_budget" },
      { label: "1.000\u20132.000 \u20AC", desc: "Gutes Preis-Leistungs-Verh\u00E4ltnis", scoreKey: "budget_mittel" },
      { label: "2.000\u20134.000 \u20AC", desc: "Premium darf es schon sein", scoreKey: "budget_premium" },
      { label: "\u00DCber 4.000 \u20AC", desc: "Luxus, das Beste vom Besten", scoreKey: "budget_luxus" },
    ],
  },
  {
    id: "gruppe",
    title: "Mit wem reist du?",
    subtitle: "W\u00E4hle alle zutreffenden Optionen",
    icon: "\uD83D\uDC65",
    multi: true,
    options: [
      { label: "Als Paar", desc: "Romantik zu zweit", scoreKey: "gruppe_paar" },
      { label: "Familie mit kleinen Kindern", desc: "Kids unter 6 Jahren dabei", scoreKey: "gruppe_familie_klein" },
      { label: "Familie mit Teenagern", desc: "Die Gro\u00DFen wollen Action", scoreKey: "gruppe_familie_teen" },
      { label: "Solo", desc: "Alleine die Welt entdecken", scoreKey: "gruppe_solo" },
      { label: "Freundesgruppe", desc: "Gemeinsam Spa\u00DF haben", scoreKey: "gruppe_freunde" },
      { label: "Best Ager / Senioren", desc: "Entspannt und komfortabel", scoreKey: "gruppe_senioren" },
    ],
  },
  {
    id: "ziel",
    title: "Wohin soll es gehen?",
    subtitle: "Auch mehrere Ziele m\u00F6glich",
    icon: "\uD83C\uDF0D",
    multi: true,
    options: [
      { label: "Mittelmeer", desc: "Sonne, Kultur, gutes Essen", scoreKey: "ziel_mittelmeer" },
      { label: "Karibik", desc: "T\u00FCrkises Wasser, Palmen", scoreKey: "ziel_karibik" },
      { label: "Nordeuropa & Norwegen", desc: "Fjorde, Nordlicht, Natur", scoreKey: "ziel_nordeuropa" },
      { label: "Fernreise", desc: "Asien, S\u00FCdamerika, Weltreise", scoreKey: "ziel_fernreise" },
      { label: "Flusskreuzfahrt", desc: "Donau, Rhein, Nil oder Mekong", scoreKey: "ziel_fluss" },
    ],
  },
  {
    id: "atmosphaere",
    title: "Welche Stimmung an Bord?",
    subtitle: "Auch mehrere m\u00F6glich",
    icon: "\u2728",
    multi: true,
    options: [
      { label: "Party & Action", desc: "Shows, Wasserrutschen, Nightlife", scoreKey: "atmosphaere_party" },
      { label: "Wellness & Entspannung", desc: "Spa, Pool, Ruhe genie\u00DFen", scoreKey: "atmosphaere_wellness" },
      { label: "Kultur & Bildung", desc: "Vortr\u00E4ge, Bibliothek, Geschichte", scoreKey: "atmosphaere_kultur" },
      { label: "Abenteuer & Expedition", desc: "Natur hautnah, Zodiac-Fahrten", scoreKey: "atmosphaere_abenteuer" },
    ],
  },
  {
    id: "schiff",
    title: "Welche Schiffsgr\u00F6\u00DFe?",
    subtitle: "Mega-Resort oder Boutique-Schiff?",
    icon: "\uD83D\uDEA2",
    multi: false,
    options: [
      { label: "Mega-Ship", desc: "\u00DCber 3.000 G\u00E4ste, Freizeitpark", scoreKey: "schiff_mega" },
      { label: "Mittelgro\u00DF", desc: "1.000\u20133.000 G\u00E4ste, guter Mix", scoreKey: "schiff_mittel" },
      { label: "Klein & Boutique", desc: "Unter 1.000 G\u00E4ste, pers\u00F6nlich", scoreKey: "schiff_boutique" },
    ],
  },
  {
    id: "sprache",
    title: "Bordsprache",
    subtitle: "Wie wichtig ist dir Deutsch an Bord?",
    icon: "\uD83D\uDDE3\uFE0F",
    multi: false,
    options: [
      { label: "Deutsch muss sein", desc: "Bordprogramm, Men\u00FCs, Crew", scoreKey: "sprache_deutsch" },
      { label: "International ist okay", desc: "Englisch reicht mir v\u00F6llig", scoreKey: "sprache_international" },
    ],
  },
  {
    id: "kulinarik",
    title: "Essen an Bord",
    subtitle: "Wie wichtig ist dir die K\u00FCche?",
    icon: "\uD83C\uDF7D\uFE0F",
    multi: false,
    options: [
      { label: "Buffet reicht v\u00F6llig", desc: "All-Inclusive, Hauptsache satt", scoreKey: "kulinarik_allinclusive" },
      { label: "Gute Auswahl wichtig", desc: "Mehrere Restaurants, Vielfalt", scoreKey: "kulinarik_auswahl" },
      { label: "Fine Dining & Gourmet", desc: "Sterneniveau, Highlight", scoreKey: "kulinarik_gourmet" },
    ],
  },
  {
    id: "kinder",
    title: "Kinderbetreuung",
    subtitle: "Brauchst du ein Kinderprogramm?",
    icon: "\uD83E\uDDD2",
    multi: false,
    options: [
      { label: "Kein Bedarf", desc: "Ohne Kinder / Erwachsenen-Schiff", scoreKey: "kinder_keine" },
      { label: "Nice-to-have", desc: "Mal ein paar Stunden Betreuung", scoreKey: "kinder_vorhanden" },
      { label: "Absolut entscheidend", desc: "Top-Kids-Club ist ein Muss", scoreKey: "kinder_top" },
    ],
  },
  {
    id: "entertainment",
    title: "Unterhaltung an Bord",
    subtitle: "Auch mehrere m\u00F6glich",
    icon: "\uD83C\uDFAD",
    multi: true,
    options: [
      { label: "Action & Shows", desc: "Wasserrutschen, Broadway, Casino", scoreKey: "entertainment_action" },
      { label: "Spa & Ruhe", desc: "Wellness, Pool, Sterne gucken", scoreKey: "entertainment_spa" },
      { label: "Natur & Expeditionen", desc: "Vortr\u00E4ge, Zodiac, Wildtiere", scoreKey: "entertainment_expedition" },
    ],
  },
  {
    id: "dresscode",
    title: "Dresscode",
    subtitle: "Wie leger darf es an Bord sein?",
    icon: "\uD83D\uDC54",
    multi: false,
    options: [
      { label: "Casual & leger", desc: "Flip-Flops und Shorts", scoreKey: "dresscode_leger" },
      { label: "Gerne mal schick", desc: "Gala-Abende und elegante Dinner", scoreKey: "dresscode_schick" },
    ],
  },
];

// ═══════════════════════════════════════════════════════
// BUSINESS LOGIC
// ═══════════════════════════════════════════════════════

function calculateResults(answers) {
  const scores = {};
  REEDEREIEN.forEach((reederei) => {
    let total = 0;
    Object.values(answers).forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach((key) => { total += reederei.scores[key] || 0; });
      } else {
        total += reederei.scores[value] || 0;
      }
    });
    scores[reederei.id] = total;
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const maxScore = sorted[0][1];

  return sorted.map(([id, score]) => ({
    ...REEDEREI_BY_ID.get(id),
    totalScore: score,
    matchPercent: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
  }));
}

function generateExplanation(winner, answers) {
  const parts = [];

  const budgetLabels = {
    budget_budget: "g\u00FCnstigen Preisen",
    budget_mittel: "fairem Preis-Leistungs-Verh\u00E4ltnis",
    budget_premium: "Premium-Qualit\u00E4t",
    budget_luxus: "echtem Luxus",
  };
  const atmosphereLabels = {
    atmosphaere_party: "Action und Entertainment",
    atmosphaere_wellness: "Wellness und Entspannung",
    atmosphaere_kultur: "Kultur und Bildung",
    atmosphaere_abenteuer: "Abenteuer und Natur",
  };
  const foodLabels = {
    kulinarik_allinclusive: "ein unkompliziertes All-Inclusive-Konzept",
    kulinarik_auswahl: "eine gute Restaurantauswahl",
    kulinarik_gourmet: "erstklassige Gourmetk\u00FCche",
  };

  if (answers.budget) {
    parts.push(`Du suchst nach ${budgetLabels[answers.budget] || "einer guten Kreuzfahrt"}`);
  }
  if (answers.atmosphaere) {
    const atmosphereKeys = Array.isArray(answers.atmosphaere) ? answers.atmosphaere : [answers.atmosphaere];
    const labels = atmosphereKeys.map((key) => atmosphereLabels[key]).filter(Boolean);
    if (labels.length) parts.push(`legst Wert auf ${labels.join(" und ")}`);
  }
  if (answers.kulinarik) {
    parts.push(`w\u00FCnschst dir ${foodLabels[answers.kulinarik] || "gutes Essen"}`);
  }

  let text = parts.length > 0 ? parts.join(", ") + ". " : "";
  text += `**${winner.name}** trifft genau diesen Nerv: ${winner.kurzbeschreibung}`;
  return text;
}

// ═══════════════════════════════════════════════════════
// HELPER: FormattedText (ersetzt dangerouslySetInnerHTML)
// ═══════════════════════════════════════════════════════

function FormattedText({ text, style }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <p style={style}>
      {parts.map((part, index) =>
        index % 2 === 1
          ? <strong key={index} style={{ color: COLORS.textPrimary }}>{part}</strong>
          : part
      )}
    </p>
  );
}

// ═══════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════

function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div style={{ width: "100%", marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.body }}>
        <span>Frage {current} von {total}</span>
        <span>{percent}%</span>
      </div>
      <div style={{ width: "100%", height: 6, background: COLORS.progressTrack, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          width: `${percent}%`,
          height: "100%",
          background: GRADIENTS.progress,
          borderRadius: 3,
          transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      </div>
    </div>
  );
}

function QuestionCard({ question, onAnswer, onBack, canGoBack, animating, existingAnswer }) {
  const isMulti = question.multi;

  // FIX: Beide Modi (single + multi) nutzen existingAnswer zur Initialisierung
  const [selected, setSelected] = useState(
    isMulti
      ? (Array.isArray(existingAnswer) ? existingAnswer : [])
      : (existingAnswer || null)
  );

  // FIX: existingAnswer in Dependency-Array aufgenommen
  useEffect(() => {
    if (isMulti) {
      setSelected(Array.isArray(existingAnswer) ? existingAnswer : []);
    } else {
      setSelected(existingAnswer || null);
    }
  }, [question.id, existingAnswer, isMulti]);

  const handleClick = (key) => {
    if (isMulti) {
      setSelected((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
    } else {
      onAnswer(question.id, key);
    }
  };

  const handleConfirm = () => {
    if (Array.isArray(selected) && selected.length > 0) {
      onAnswer(question.id, selected);
    }
  };

  // FIX: isOptionSelected prueft jetzt auch Single-Select-Zustand
  const isOptionSelected = (key) => {
    if (isMulti) return Array.isArray(selected) && selected.includes(key);
    return selected === key;
  };

  const multiCount = isMulti && Array.isArray(selected) ? selected.length : 0;

  return (
    <div style={{
      opacity: animating ? 0 : 1,
      transform: animating ? "translateY(14px)" : "translateY(0)",
      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{question.icon}</div>
        <h2 style={{ fontFamily: FONTS.heading, fontSize: 23, fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 4px 0" }}>
          {question.title}
        </h2>
        <p style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textSecondary, margin: 0 }}>
          {question.subtitle}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {question.options.map((option, index) => {
          const active = isOptionSelected(option.scoreKey);
          return (
            <button
              key={option.scoreKey}
              onClick={() => handleClick(option.scoreKey)}
              style={{
                display: "flex", alignItems: "center", gap: 11, padding: "12px 14px",
                background: active ? COLORS.bgCardActive : COLORS.bgCard,
                border: `1px solid ${active ? COLORS.borderAccent : COLORS.borderDefault}`,
                borderRadius: 11, cursor: "pointer", textAlign: "left", color: COLORS.textPrimary,
                transition: "all 0.15s ease", width: "100%", fontFamily: FONTS.body, outline: "none",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = COLORS.bgCardHover;
                  e.currentTarget.style.borderColor = COLORS.borderAccentHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = COLORS.bgCard;
                  e.currentTarget.style.borderColor = COLORS.borderDefault;
                }
              }}
            >
              <div style={{
                width: isMulti ? 22 : 32, height: isMulti ? 22 : 32,
                borderRadius: isMulti ? 5 : 8,
                background: active ? COLORS.accentBgActive : COLORS.accentBgWeak,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                color: active ? COLORS.white : COLORS.accentText,
                flexShrink: 0, transition: "all 0.15s ease",
              }}>
                {isMulti ? (active ? "\u2713" : "") : String.fromCharCode(65 + index)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 1 }}>{option.label}</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{option.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {canGoBack && (
          <button
            onClick={onBack}
            style={{
              flex: "0 0 auto", padding: "10px 16px",
              background: COLORS.bgCard, border: `1px solid ${COLORS.borderHover}`,
              borderRadius: 10, color: COLORS.textSecondary, fontSize: 13,
              fontFamily: FONTS.body, cursor: "pointer", transition: "all 0.15s ease", outline: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = COLORS.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLORS.borderHover;
              e.currentTarget.style.color = COLORS.textSecondary;
            }}
          >
            &larr; Zur\u00FCck
          </button>
        )}
        {isMulti && (
          <button
            onClick={handleConfirm}
            disabled={multiCount === 0}
            style={{
              flex: 1, padding: "10px 18px",
              background: multiCount > 0 ? GRADIENTS.accent : COLORS.bgCard,
              border: multiCount > 0 ? "none" : `1px solid ${COLORS.borderDefault}`,
              borderRadius: 10,
              color: multiCount > 0 ? COLORS.white : COLORS.textDisabled,
              fontSize: 13, fontWeight: 600, fontFamily: FONTS.body,
              cursor: multiCount > 0 ? "pointer" : "default",
              transition: "all 0.15s ease", outline: "none",
            }}
          >
            Weiter {multiCount > 0 && `(${multiCount})`}
          </button>
        )}
      </div>
    </div>
  );
}

function ResultCard({ results, answers, onRestart }) {
  const winner = results[0];
  const runners = results.slice(1, 4);
  const explanation = generateExplanation(winner, answers);

  return (
    <div style={{ animation: "fadeUp 0.5s ease-out forwards" }}>
      {/* Ergebnis-Header */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: COLORS.accentText, fontWeight: 700, fontFamily: FONTS.body, marginBottom: 5 }}>
          Dein Ergebnis
        </div>
        <h2 style={{ fontFamily: FONTS.heading, fontSize: 25, fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 3px 0" }}>
          {winner.name}
        </h2>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.body }}>
          {winner.typ === "fluss" ? "Flusskreuzfahrt" : "Hochseekreuzfahrt"} &middot; {winner.preisrange}/Woche
        </div>
      </div>

      {/* Match-Score & Erklaerung */}
      <div style={{ background: COLORS.accentBgStrong, border: `1px solid ${COLORS.borderAccentLight}`, borderRadius: 13, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: GRADIENTS.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 19, fontWeight: 800, color: COLORS.white, fontFamily: FONTS.body,
          }}>
            {winner.matchPercent}%
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary, fontFamily: FONTS.body }}>Match-Score</div>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.body }}>Passt am besten zu deinen W\u00FCnschen</div>
          </div>
        </div>
        <FormattedText
          text={explanation}
          style={{ fontSize: 13, lineHeight: 1.6, color: "#cbd5e1", margin: 0, fontFamily: FONTS.body }}
        />
      </div>

      {/* Top 3 Staerken */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: COLORS.textMuted, marginBottom: 7, fontFamily: FONTS.body }}>
          Top 3 St\u00E4rken
        </div>
        {winner.usp.map((uspItem, index) => (
          <div key={index} style={{
            display: "flex", alignItems: "center", gap: 9, padding: "8px 11px",
            background: COLORS.bgSubtle, borderRadius: 8,
            fontFamily: FONTS.body, fontSize: 13, color: "#cbd5e1", marginBottom: 4,
          }}>
            <span style={{ color: COLORS.accentText, fontWeight: 700 }}>{index + 1}.</span> {uspItem}
          </div>
        ))}
      </div>

      {/* Warnung */}
      <div style={{
        background: COLORS.dangerBg, border: `1px solid ${COLORS.dangerBorder}`,
        borderRadius: 9, padding: "9px 13px", marginBottom: 18,
        fontFamily: FONTS.body, fontSize: 12, color: COLORS.danger,
      }}>
        {winner.passt_nicht}
      </div>

      {/* Affiliate-Link */}
      <a
        href={winner.affiliate}
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "13px 18px", background: GRADIENTS.accent,
          border: "none", borderRadius: 11, color: COLORS.white,
          fontSize: 15, fontWeight: 700, fontFamily: FONTS.body,
          textDecoration: "none", cursor: "pointer",
          transition: "all 0.2s ease", marginBottom: 18,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 18px rgba(14,165,233,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {winner.affiliateLabel} &rarr;
      </a>

      {/* Weitere Empfehlungen */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: COLORS.textMuted, marginBottom: 7, fontFamily: FONTS.body }}>
          Auch interessant
        </div>
        {runners.map((reederei) => (
          <div key={reederei.id} style={{
            display: "flex", alignItems: "center", gap: 9, padding: "9px 11px",
            background: COLORS.bgSubtle, border: `1px solid ${COLORS.borderLight}`,
            borderRadius: 9, marginBottom: 5,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: COLORS.bgOverlay,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: COLORS.textMuted,
              fontFamily: FONTS.body, flexShrink: 0,
            }}>
              {reederei.matchPercent}%
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, fontFamily: FONTS.body }}>
                {reederei.name}
              </div>
              <div style={{
                fontSize: 11, color: COLORS.textSecondary, fontFamily: FONTS.body,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {reederei.preisrange} &middot; {reederei.usp[0]}
              </div>
            </div>
            <a
              href={reederei.affiliate}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{ fontSize: 11, color: COLORS.accentText, textDecoration: "none", fontFamily: FONTS.body, fontWeight: 600, flexShrink: 0 }}
            >
              Ansehen&rarr;
            </a>
          </div>
        ))}
      </div>

      {/* Neustart */}
      <button
        onClick={onRestart}
        style={{
          width: "100%", padding: "10px 18px",
          background: COLORS.transparent, border: `1px solid ${COLORS.borderHover}`,
          borderRadius: 9, color: COLORS.textSecondary, fontSize: 13,
          fontFamily: FONTS.body, cursor: "pointer", outline: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          e.currentTarget.style.color = COLORS.textPrimary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = COLORS.borderHover;
          e.currentTarget.style.color = COLORS.textSecondary;
        }}
      >
        Quiz nochmal starten
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function CruiseQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // FIX: Ergebnisse nur bei Aenderung neu berechnen
  const results = useMemo(
    () => (quizCompleted ? calculateResults(answers) : []),
    [quizCompleted, answers]
  );

  const handleAnswer = useCallback((questionId, value) => {
    setAnimating(true);
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setTimeout(() => setAnimating(false), 50);
      } else {
        setQuizCompleted(true);
      }
    }, 220);
  }, [currentQuestion]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentQuestion((prev) => prev - 1);
        setTimeout(() => setAnimating(false), 50);
      }, 180);
    }
  }, [currentQuestion]);

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setAnimating(false);
    setQuizStarted(false);
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        :root { --f: 'DM Sans', sans-serif; --fh: 'Playfair Display', serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        button:focus { outline: none; }
      `}</style>
      <div style={{
        minHeight: "100vh", background: COLORS.bgPage,
        backgroundImage: `${GRADIENTS.bgRadial1}, ${GRADIENTS.bgRadial2}`,
        padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          {/* Header / Badge */}
          <div style={{ textAlign: "center", marginBottom: quizStarted ? 12 : 20, paddingTop: 4 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 11px", background: COLORS.accentBg,
              border: `1px solid ${COLORS.borderAccentLight}`, borderRadius: 16,
              marginBottom: quizStarted ? 6 : 10,
            }}>
              <span style={{ fontSize: 14 }}>{"\uD83D\uDEA2"}</span>
              <span style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, color: COLORS.accentText, textTransform: "uppercase", letterSpacing: 1.5 }}>
                Kreuzfahrt-Finder
              </span>
            </div>

            {/* Startseite */}
            {!quizStarted && !quizCompleted && (
              <div style={{ animation: "fadeUp 0.5s ease-out" }}>
                <h1 style={{ fontFamily: FONTS.heading, fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, margin: "0 0 7px 0", lineHeight: 1.2 }}>
                  Welche Kreuzfahrt passt zu dir?
                </h1>
                <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textSecondary, margin: "0 0 20px 0", lineHeight: 1.5, maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
                  10 schnelle Fragen, 20 Reedereien im Vergleich. Finde in 2 Minuten deine perfekte Kreuzfahrtlinie.
                </p>
                <button
                  onClick={() => setQuizStarted(true)}
                  style={{
                    padding: "12px 32px", background: GRADIENTS.accent,
                    border: "none", borderRadius: 11, color: COLORS.white,
                    fontSize: 15, fontWeight: 700, fontFamily: FONTS.body,
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(14,165,233,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Quiz starten
                </button>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 12, fontFamily: FONTS.body, fontSize: 11, color: COLORS.textMuted }}>
                  <span>20 Reedereien</span><span>&middot;</span><span>10 Fragen</span><span>&middot;</span><span>~2 Min.</span>
                </div>
              </div>
            )}
          </div>

          {/* Quiz-Fragen */}
          {quizStarted && !quizCompleted && (
            <div>
              <ProgressBar current={currentQuestion + 1} total={QUESTIONS.length} />
              <QuestionCard
                question={QUESTIONS[currentQuestion]}
                onAnswer={handleAnswer}
                onBack={handleBack}
                canGoBack={currentQuestion > 0}
                animating={animating}
                existingAnswer={answers[QUESTIONS[currentQuestion].id]}
              />
            </div>
          )}

          {/* Ergebnis */}
          {quizCompleted && (
            <ResultCard results={results} answers={answers} onRestart={handleRestart} />
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 24, padding: "12px 0", borderTop: `1px solid ${COLORS.borderLight}` }}>
            <p style={{ fontFamily: FONTS.body, fontSize: 10, color: COLORS.textDisabled, margin: 0, lineHeight: 1.4 }}>
              Powered by fernwehblog.net &middot; * Affiliate-Links, dir entstehen keine Mehrkosten.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
