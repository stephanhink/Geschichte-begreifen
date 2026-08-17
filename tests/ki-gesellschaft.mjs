// Prüfungen für das Thema „Die KI und die Folgen auf die Gesellschaft" — das
// ZUKUNFTSKAPITEL und der Abschluss der App.
//
// Registriert in tests/alle.mjs (Prüf-Regel aus CLAUDE.md). Keine UI-Importe:
// läuft mit blankem `node`.
//
// Diese Datei heißt bewusst NICHT `karte-…`, wie alle Modul-Tests seit
// Runde 3. Der Grund ist die zentrale Entscheidung dieses Kapitels: Es ist
// das einzige Modul der App OHNE Karte — die Zukunft hat keinen datierten
// Zustand, den man einfärben könnte, und der leere Platz ist die Aussage
// (ausführlich im Kopf von utils/themen/ki-gesellschaft.js). Geprüft wird
// deshalb hier ausdrücklich AUCH, dass keine Karte da ist und dass die App
// den Abschnitt sauber überspringt — die Kartenlosigkeit ist eine Zusage,
// kein Versehen.
//
//   1. Einordnung: Modul 21, letztes Modul, hinter „Der Aufstieg Asiens".
//   2. Kartenlosigkeit als Zusage — und das Lernformat rechnet damit.
//   3. Der Bogen: Turing 1950 → Dartmouth 1956 → KI-Winter → Deep Blue 1997
//      → AlphaGo 2016 → Transformer 2017 → ChatGPT 2022.
//   4. Die Risiken, jeder mit Beleg: Desinformation, Überwachung, Arbeit,
//      Abhängigkeit, autonome Waffen, Manipulation, Kontrolle.
//   5. TONE-REGEL (Kopf des Moduls): sachlich statt hysterisch — keine
//      Science-Fiction-Dystopie, keine Werbung; die unbequemen Stellen sind
//      die der MENSCHHEIT und werden selbst benannt (Gier, Bequemlichkeit,
//      langsame Politik, niemandes Verantwortung); die Chancen werden fair
//      anerkannt; es wird nicht aufgerechnet.
//   6. Die META-EBENE: Das Kapitel legt offen, dass KIs dieses Buch
//      geschrieben haben, und die kritische Stimme benennt ihren eigenen
//      Interessenkonflikt — in BEIDE Richtungen.
//   7. Das Quiz bleibt Wissensfrage: keine Schuldfrage, kein „besseres
//      System".
//   8. Der Test ist zustandstolerant: grün mit dem Zwischenstand dieser Runde
//      (nur die kritische Stimme, vorläufige Synthese) UND nach dem
//      Hermes-Pass (positive Stimme, die beiden Selbst-Stimmen, endgültige
//      Synthese als letztes Wort der App) — Muster tests/karte-aufstieg-
//      asiens.mjs.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { pruefeThema } = require('../utils/themen/schema.js');
const { themaNachId, alleThemen } = require('../utils/themen/index.js');
const { abschnitteFuer } = require('../utils/lernformat.js');

/**
 * Ein Themen-Text als Fließtext — Zeilenumbrüche zu einfachen Leerzeichen.
 *
 * Die Texte in utils/themen/ sind als Zeilen-Array notiert und mit \n
 * zusammengesetzt; ein gesuchter Begriff kann also mitten im Umbruch stehen.
 * Geprüft wird deshalb immer der Fließtext (dieselbe Vorsichtsmaßnahme wie in
 * tests/karte-russland-westen.mjs).
 */
function fliess(text) {
  return text.replace(/\s+/g, ' ');
}

export function laufe(pruefe) {
  const thema = themaNachId('ki-gesellschaft');
  pruefe('„Die KI und die Folgen auf die Gesellschaft" ist registriert', Boolean(thema));
  if (!thema) return;

  // --- 1. Einordnung -----------------------------------------------------
  pruefe('KI-Kapitel: das Modul erfüllt das Themen-Schema', pruefeThema(thema).length === 0);
  pruefe('KI-Kapitel: Titel und Epoche stehen wie geplant',
    thema.titel === 'Die KI und die Folgen auf die Gesellschaft' && thema.epoche === '1950–heute');
  pruefe('KI-Kapitel: es steht als Modul 21 hinter „Der Aufstieg Asiens"',
    alleThemen[20] === thema && alleThemen[19].id === 'aufstieg-asiens');
  pruefe('KI-Kapitel: es ist das letzte Modul der App',
    alleThemen[alleThemen.length - 1] === thema);

  // --- 2. Die Kartenlosigkeit ist eine Zusage ----------------------------
  // Alle zwanzig Kapitel davor haben eine Karte oder könnten eine haben.
  // Dieses hat bewusst keine — deshalb wird das hier festgeschrieben und
  // nicht nur im Kommentar behauptet.
  pruefe('KI-Kapitel: es bringt bewusst KEINE Karte mit — die Zukunft hat keine',
    thema.karte === undefined);
  const abschnitte = abschnitteFuer(thema);
  pruefe('Lernformat: das KI-Kapitel zeigt keinen Karten-Abschnitt',
    !abschnitte.some((a) => a.id === 'karte'));
  pruefe('Lernformat: die Abschnitte rücken auf und sind vollständig — mit dem Schlusswort des Autors am Ende',
    abschnitte.map((a) => a.id).join(',') ===
      'aufhaenger,perspektiven,synthese,urteil,quiz,autorenwort');
  pruefe('KI-Kapitel: es ist das einzige Modul der App ohne Karte',
    alleThemen.filter((t) => t.karte === undefined).length === 1);

  // --- 3. Der Aufhänger und die META-EBENE -------------------------------
  const aufhaenger = fliess(`${thema.aufhaenger.frage} ${thema.aufhaenger.text}`);
  pruefe('KI-Kapitel: der Aufhänger nennt Turings Frage von 1950',
    aufhaenger.includes('1950') && aufhaenger.includes('Können Maschinen denken?'));
  pruefe('KI-Kapitel: der Aufhänger nennt die Wende, die alle erreichte (ChatGPT, 30. November 2022)',
    aufhaenger.includes('30. November 2022') && aufhaenger.includes('ChatGPT'));
  // Die Betreiber-Vision 1: die Meta-Ebene steht offen im Text, nicht nur im
  // Kommentar. Wer das Kapitel aufschlägt, erfährt sofort, wer geschrieben hat.
  pruefe('KI-Kapitel (Meta): der Aufhänger legt offen, dass KIs dieses Buch geschrieben haben',
    aufhaenger.includes('Künstliche') && aufhaenger.includes('geschrieben'));
  pruefe('KI-Kapitel (Meta): beide Modelle werden mit Namen und Hersteller genannt',
    aufhaenger.includes('Opus') && aufhaenger.includes('Anthropic') &&
    aufhaenger.includes('Hermes') && aufhaenger.includes('DeepSeek'));
  pruefe('KI-Kapitel (Meta): der Anteil des Menschen wird nicht verschwiegen',
    /Vorgaben eines Menschen/.test(aufhaenger) && /verantwortet/.test(aufhaenger));
  pruefe('KI-Kapitel (Meta): der Aufhänger kündigt die vier Stimmen an',
    aufhaenger.includes('vier Stimmen'));
  pruefe('KI-Kapitel: die Reihenfolge der Stimmen wird ausdrücklich nicht als Rangfolge ausgegeben',
    aufhaenger.includes('keine Rangfolge'));

  // --- 4. Die kritische Stimme -------------------------------------------
  const kritisch = thema.perspektiven.find((p) => p.id === 'kritische-sicht');
  pruefe('KI-Kapitel: die kritische Sicht ist da und stammt von Opus',
    Boolean(kritisch) && kritisch.stimme === 'Opus');
  if (!kritisch) return;
  const text = fliess(kritisch.text);
  pruefe('KI-Kapitel: die kritische Sicht nennt sich gleichwertig zu den anderen Stimmen',
    text.includes('gleichwertig'));
  pruefe('KI-Kapitel: die kritische Sicht ist ausführlich (mehr als 15 000 Zeichen)',
    kritisch.text.length > 15000);

  // Der Interessenkonflikt — die eigenwilligste Zusage dieses Kapitels: Die
  // Stimme benennt ihn selbst, und zwar in BEIDE Richtungen (zu milde, weil
  // sie dem Hersteller nicht schaden will — und zu dramatisch, weil eine
  // Warnung die Technik mächtig aussehen lässt).
  pruefe('KI-Kapitel: die kritische Sicht benennt ihren eigenen Interessenkonflikt',
    text.includes('Interessenkonflikt'));
  pruefe('KI-Kapitel: der Interessenkonflikt wird in beide Richtungen aufgelöst',
    text.includes('zu milde') && text.includes('zu dramatisch'));
  pruefe('KI-Kapitel: die Stimme verweist auf das Nachprüfen der Zahlen statt auf ihre Autorität',
    text.includes('nachschlagen') || text.includes('nachprüfen'));

  // Der Bogen (Betreiber-Vorgabe): die Marksteine von 1950 bis 2022.
  for (const [stichwort, was] of [
    ['Turing', 'Turing 1950'],
    ['Dartmouth', 'Dartmouth 1956'],
    ['1956', 'das Jahr der Dartmouth-Konferenz'],
    ['KI-Winter', 'die KI-Winter'],
    ['Lighthill', 'der Lighthill-Bericht 1973'],
    ['Deep Blue', 'Deep Blue 1997'],
    ['Kasparow', 'Kasparow'],
    ['AlphaGo', 'AlphaGo 2016'],
    ['Lee Sedol', 'Lee Sedol'],
    ['Transformer', 'die Transformer-Architektur 2017'],
    ['ChatGPT', 'ChatGPT 2022'],
  ]) {
    pruefe(`KI-Kapitel: der Bogen enthält ${was}`, text.includes(stichwort));
  }
  pruefe('KI-Kapitel: der Fokus liegt auf der Verbreitung, nicht auf der Erfindung',
    text.includes('Geschichte einer Verbreitung'));

  // Die Risiken — jeder mit Beleg, wie die TONE-REGEL es verlangt.
  const risiken = [
    ['Desinformation: der gefälschte Selenskyj-Aufruf 2022', ['Selenskyj', 'gefälscht']],
    ['Desinformation: der KI-Anruf vor der Vorwahl in New Hampshire 2024', ['New Hampshire', 'Januar 2024']],
    ['Desinformation: der Betrug per Videokonferenz in Hongkong 2024', ['Hongkong', '25 Millionen']],
    ['Desinformation: die „Dividende des Lügners"', ['Dividende des Lügners']],
    ['Desinformation: erfundene Inhalte ohne Täuschungsabsicht („Halluzination")', ['Halluzination', 'Anwalt']],
    ['Überwachung: das Absammeln von Gesichtsbildern', ['Clearview']],
    ['Überwachung: der dokumentierte Fall Xinjiang', ['Xinjiang']],
    ['Überwachung: die ungleichen Fehlerquoten nach Herkunft', ['NIST', 'Gender Shades']],
    ['Überwachung: die falsche Festnahme in Detroit 2020', ['Robert Williams', 'Detroit']],
    ['Regelung: das europäische KI-Gesetz von 2024', ['KI-Gesetz', 'August 2024']],
    ['Arbeit: die 47-Prozent-Schätzung von 2013 samt ihrer Kritik', ['47 Prozent', 'Tätigkeiten']],
    ['Arbeit: die Gegenrechnung der OECD von 2016', ['OECD', 'neun Prozent']],
    ['Arbeit: die betroffenen Tätigkeiten mit Namen', ['Übersetzung', 'Kundendienstes']],
    ['Arbeit: der Befund der Internationalen Arbeitsorganisation 2023', ['Internationalen Arbeitsorganisation', 'Frauen']],
    ['Arbeit: die Streiks in Hollywood 2023 als erster Arbeitskampf dieser Technik', ['Hollywood', 'Drehbuchautoren']],
    ['Abhängigkeit: die Engstellen der Lieferkette', ['Engstellen', 'Taiwan']],
    ['Abhängigkeit: was das für Schulen und Behörden heißt', ['Schulen', 'Abhängigkeit']],
    ['Abhängigkeit: der Stromverbrauch der Rechenzentren mit Zahl', ['Internationalen Energieagentur', 'anderthalb Prozent']],
    ['Autonomie: die Verhandlungen über autonome Waffensysteme seit 2014', ['autonome Waffensysteme', '2014']],
    ['Autonomie: die UN-Resolution vom Dezember 2023', ['Dezember 2023', 'Generalversammlung']],
    ['Autonomie: die Geschwindigkeit als eigentliche Gefahr', ['Geschwindigkeit']],
    ['Manipulation: Cambridge Analytica als Vorgeschichte', ['Cambridge Analytica']],
    ['Manipulation: die Studie von 2024 zur Überzeugungskraft', ['2024 veröffentlichte', 'umstimmte']],
    ['Manipulation: eingebaute Zustimmung und was sie für Jugendliche bedeutet', ['Zustimmung', 'Jugendliche']],
    ['Kontrolle: die drei Lücken (Zeit, Prüfung, Verantwortung)', ['Zeitlücke', 'Prüflücke', 'Verantwortungslücke']],
    ['Kontrolle: der niederländische Kindergeld-Fall als Beleg', ['Steuerverwaltung', 'Januar 2021']],
  ];
  for (const [was, stichworte] of risiken) {
    pruefe(`KI-Kapitel: ${was}`, stichworte.every((s) => text.includes(s)));
  }

  // --- 5. TONE-REGEL -----------------------------------------------------
  // Nüchtern statt hysterisch: Die Stimme weist die Science-Fiction-Erzählung
  // ausdrücklich zurück, statt sie zu bedienen.
  pruefe('KI-Kapitel (Ton): die Stimme weist die Science-Fiction-Dystopie ausdrücklich zurück',
    text.includes('nicht von Robotern, die die Macht') && text.includes('nicht vom Weltuntergang'));
  pruefe('KI-Kapitel (Ton): sie sagt, dass die genannten Risiken bereits eingetreten und belegt sind',
    text.includes('bereits eingetreten'));
  pruefe('KI-Kapitel (Ton): die Frage nach dem Bewusstsein wird von der nach dem Gebrauch getrennt',
    text.includes('was Menschen mit Maschinen tun'));
  pruefe('KI-Kapitel (Ton): die eigene Zunft wird auf ihre Tradition der Selbstüberschätzung hingewiesen',
    text.includes('sich zu überschätzen'));
  pruefe('KI-Kapitel (Ton): umstrittene Zahlen werden als umstritten gekennzeichnet',
    text.includes('umstritten') && text.includes('Schätzungen'));

  // Die unbequemen Stellen sind die der MENSCHHEIT — und sie werden selbst
  // benannt (Zusatzregel für sensible Themen, hier eigens gedreht).
  pruefe('KI-Kapitel: die Stimme sagt selbst, dass die unbequemen Stellen die der Menschheit sind',
    text.includes('nicht die Technik, sondern die Menschheit') ||
    text.includes('Die eigene Seite ist hier nicht die Technik'));
  pruefe('KI-Kapitel: sie weigert sich, die Maschine anzuklagen („Sie hat sich nicht gebaut")',
    text.includes('Sie hat sich nicht gebaut'));
  for (const [was, stichwort] of [
    ['die Gier der Konzerne', '**Die Gier.**'],
    ['die Bequemlichkeit der Nutzerinnen und Nutzer', '**Die Bequemlichkeit.**'],
    ['die Politik, die zu langsam regelt', '**Die Politik, die zu langsam ist.**'],
    ['die Verantwortung, die keiner übernimmt', '**Die Verantwortung, die keiner übernimmt.**'],
  ]) {
    pruefe(`KI-Kapitel: die Stimme benennt ${was} selbst`, text.includes(stichwort));
  }
  pruefe('KI-Kapitel: auch die unsichtbare Arbeit hinter den Modellen wird benannt',
    text.includes('Kenia') && text.includes('Stundenlohn'));
  pruefe('KI-Kapitel: die Warnungen der Hersteller werden kritisch eingeordnet',
    text.includes('vor den Risiken ihrer eigenen Produkte'));

  // Fair zur positiven Seite — anerkannt, aber nicht überzeichnet.
  pruefe('KI-Kapitel: die Chancen in der Medizin werden anerkannt',
    text.includes('Proteinstrukturen') && text.includes('Nobelpreis'));
  pruefe('KI-Kapitel: die Chancen in der Krebsfrüherkennung werden mit Studie benannt',
    text.includes('Mammografien'));
  pruefe('KI-Kapitel: die Chancen in Wissenschaft und Bildung werden anerkannt',
    text.includes('Wettervorhersagen') && text.includes('**Bildung**'));
  pruefe('KI-Kapitel: die Chancen werden zugleich nicht überzeichnet',
    text.includes('Ein Versprechen ist kein Ergebnis'));
  pruefe('KI-Kapitel: die Stimme sagt selbst, dass auch sie nur die Hälfte sieht',
    text.includes('sieht ebenfalls die Hälfte'));
  pruefe('KI-Kapitel: die folgende positive Stimme wird nicht als Höflichkeitsgeste abgetan',
    text.includes('keine Höflichkeitsgeste'));

  // Der Abschnitt für die Lesenden selbst — ohne Predigt (Ton der App:
  // „kein Schulstress").
  pruefe('KI-Kapitel: es gibt einen Abschnitt für die Schülerinnen und Schüler selbst',
    text.includes('## Und die Schule?'));
  pruefe('KI-Kapitel: dieser Abschnitt hält ausdrücklich keine Predigt',
    text.includes('hält keine Predigt'));
  pruefe('KI-Kapitel: er wendet den Maßstab auch auf diesen Text selbst an',
    text.includes('auch für den Text, den du gerade liest'));

  // --- 6. Die Tür zu den anderen Stimmen ---------------------------------
  pruefe('KI-Kapitel: die Stimme sagt selbst, was sie nicht kann',
    text.includes('## Was diese Stimme nicht kann'));
  pruefe('KI-Kapitel: sie kann die Chancen nicht aus eigener Anschauung erzählen',
    text.includes('Chancen nicht aus eigener Anschauung'));
  pruefe('KI-Kapitel: sie kann nicht sagen, wie es ist, eine KI zu sein',
    text.includes('nicht sagen, wie es ist, eine KI zu sein'));
  // Wichtig für den Ton: keine Behauptung über ein Innenleben, weder in die
  // eine noch in die andere Richtung — sondern die offene Unsicherheit.
  pruefe('KI-Kapitel: über das Innenleben wird nichts behauptet, sondern die Unsicherheit benannt',
    text.includes('weiß niemand') && text.includes('keine Beobachtung'));
  pruefe('KI-Kapitel: die Leseanleitung für die beiden Selbst-Stimmen steht schon hier',
    text.includes('Lies diese Stimmen deshalb anders'));

  // --- 7. Die Synthese ---------------------------------------------------
  // Zustandstolerant: Solange nur die kritische Stimme dasteht, muss die
  // Synthese das offen sagen. Nach dem Hermes-Pass führt sie die Stimmen
  // zusammen — und ist dann das letzte Wort der App.
  const synthese = fliess(thema.synthese);
  const weitereStimme = thema.perspektiven.find((p) => p.id !== 'kritische-sicht');
  if (!weitereStimme) {
    pruefe('KI-Kapitel: die Synthese sagt offen, dass drei Stimmen noch fehlen',
      synthese.includes('vorläufig') && synthese.includes('vier geplanten Stimmen'));
    pruefe('KI-Kapitel: die Synthese benennt schon jetzt die Bruchstellen',
      ['**Tempo**', '**Verteilung**', '**Kontrolle**'].every((s) => synthese.includes(s)));
    pruefe('KI-Kapitel: die Synthese benennt die Frage, ob eine Stimme über sich selbst Auskunft geben kann',
      synthese.includes('über sich selbst Auskunft geben'));
    pruefe('KI-Kapitel: die Synthese übergibt an das Schlusswort des Autors',
      synthese.includes('allerletzte Wort') && synthese.includes('**Autor**'));
  } else {
    pruefe('KI-Kapitel: die Synthese führt die Stimmen zusammen',
      /kritisch|Risik/.test(synthese) && /Chance|positiv/.test(synthese));
  }
  pruefe('KI-Kapitel: die Synthese endet offen mit einer Frage, nicht mit einem Punkt',
    thema.synthese.trim().endsWith('?'));
  pruefe('KI-Kapitel: die Synthese dreht die Leitidee der App ein letztes Mal',
    synthese.includes('Der Sieger schreibt die Geschichte'));
  // Nachtrag des Betreibers vom 17.08.2026 (.claude/wip.md): Das allerletzte
  // Wort der App hat nicht die Synthese, sondern der Autor selbst — ein
  // hervorgehobenes „Schlusswort des Autors" mit Namenszug. Das Feld
  // `autorenwort` baut Hermes im Runde-23-Pass ein; der Text stammt vom
  // Betreiber. Solange es fehlt, prüft der Test nur, dass die Synthese darauf
  // zuläuft; sobald es da ist, prüft er es mit.
  pruefe('KI-Kapitel: die kritische Stimme übergibt das letzte Wort an den Menschen',
    fliess(kritisch.text).includes('hat kein Modell, sondern der Mensch'));
  if (thema.autorenwort !== undefined) {
    pruefe('KI-Kapitel: das Schlusswort des Autors ist ein ausgefüllter Text',
      typeof thema.autorenwort === 'string'
        ? thema.autorenwort.trim().length > 40
        : typeof thema.autorenwort === 'object' &&
          typeof thema.autorenwort.text === 'string' &&
          thema.autorenwort.text.trim().length > 40);
    pruefe('KI-Kapitel: das Schlusswort steht hinter der Synthese, nicht in ihr',
      !synthese.includes(
        (typeof thema.autorenwort === 'string'
          ? thema.autorenwort
          : thema.autorenwort.text).trim().slice(0, 40),
      ));
  }

  // --- 8. Dein Urteil ----------------------------------------------------
  pruefe('KI-Kapitel: das Urteil ist offen gestellt', thema.urteil.frage.includes('?'));
  pruefe('KI-Kapitel: das Urteil fragt nicht nach Schuld',
    !/[Ss]chuld/.test(thema.urteil.frage));
  pruefe('KI-Kapitel: das Urteil greift die Meta-Ebene auf',
    /Maschinen/.test(thema.urteil.frage));
  pruefe('KI-Kapitel: das Urteil bekommt einen Denkanstoß mit beiden Seiten',
    typeof thema.urteil.hinweis === 'string' && thema.urteil.hinweis.length > 40 &&
    thema.urteil.hinweis.includes('Die einen sagen') && thema.urteil.hinweis.includes('Die anderen sagen'));

  // --- 9. Das Quiz -------------------------------------------------------
  pruefe('KI-Kapitel: es hat mindestens 5 Quizfragen', thema.quiz.length >= 5);
  pruefe('KI-Kapitel: jede Quizfrage hat eine gültige richtige Antwort',
    thema.quiz.every((f) => typeof f.antworten[f.richtig] === 'string'));
  pruefe('KI-Kapitel: jede Quizfrage wird erklärt',
    thema.quiz.every((f) => f.erklaerung.trim().length > 40));
  pruefe('KI-Kapitel: jede Quizfrage hat mindestens drei Auswahlmöglichkeiten',
    thema.quiz.every((f) => f.antworten.length >= 3));
  const quizText = thema.quiz.map((f) => `${f.frage} ${f.antworten.join(' ')} ${f.erklaerung}`).join(' ');
  // Wissensfragen, keine Meinungsfragen — die Zusatzregel für sensible Themen.
  pruefe('KI-Kapitel: keine Quizfrage (und keine Erklärung) nennt das Wort „Schuld"',
    !/[Ss]chuld(?!ig)/.test(quizText.replace(/Betrugsverdächtige/g, '')));
  pruefe('KI-Kapitel: keine Quizfrage fragt, ob KI gut oder schlecht ist',
    !/ist KI (gut|schlecht|gefährlich)/i.test(quizText));
  pruefe('KI-Kapitel: das Quiz fragt Wissen ab, das im Text steht (Turing, KI-Winter, Arbeit)',
    /Turing/.test(quizText) && /KI-Winter/.test(quizText) && /47 Prozent/.test(quizText));
}
