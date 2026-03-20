# Design: Verbesserte Bearbeitung von Teamnamen

**Datum:** 2026-03-20
**Komponente:** `MatesComponent`
**Status:** Approved

---

## Problemstellung

Die aktuelle Implementierung erlaubt nur die Eingabe mehrerer Namen gleichzeitig über ein kommagetrennte Texteingabe. Das ist wenig intuitiv und die UX ist unübersichtlich.

## Ziel

- Namen einzeln hinzufügen (Eingabefeld + Button)
- Namen einzeln entfernen (✕-Button je Eintrag, nur im Edit-Modus sichtbar)
- Klarere, übersichtlichere Oberfläche

---

## Design

### Normalmodus (unverändert)

- Namen werden als Buttons dargestellt
- Klick auf einen Namen entfernt ihn aus dem aktiven Pool (Gewinner)
- "Change"-Button öffnet den Edit-Modus
- "Reset"-Button stellt die ursprüngliche Liste wieder her

### Edit-Modus (überarbeitet)

**Namensliste:**
- Jeder Name wird als Zeile dargestellt: `[Name]  [✕]`
- ✕-Button entfernt den Eintrag sofort aus der Liste
- Buttons wechseln nicht mehr die Farbe (kein `editMode`-Klick-zum-Entfernen mehr)

**Hinzufügen:**
- Eingabefeld für einen einzelnen Namen
- "Hinzufügen"-Button (oder Taste Enter) übernimmt den Namen direkt
- Kein Komma-Parsing mehr

**Schließen:**
- "Close"-Button beendet den Edit-Modus (wie bisher)
- Hinweistext ("Alle Namen sind jetzt im Bearbeitungsmodus") entfällt

---

## Technische Änderungen

### `mates.component.html`

- Edit-Modus-Block: Namen als `<div>`-Zeilen mit ✕-Button statt als `<button class="editMode">`
- Eingabefeld bleibt (`[(ngModel)]="newMateName"`), Placeholder wird zu "Name hinzufügen"
- "Save"-Button wird zu "Hinzufügen"
- Hinweistext `<em>` wird entfernt

### `mates.component.ts`

- `saveNewMate()` umbenennen zu `addMate()` — kein Split auf Komma mehr, direktes Hinzufügen eines einzelnen Namens
- `removePlayer()` bleibt unverändert, wird jetzt direkt vom ✕-Button aufgerufen

### `mates.component.css`

- `.editMode`-Stil (orange Buttons) entfällt oder wird nicht mehr für Mitglieder-Buttons verwendet
- Neue Stile für die Edit-Zeilen (Flexbox: Name links, ✕ rechts)

---

## Nicht im Scope

- Umbenennen bestehender Namen
- Drag & Drop Sortierung
- Bestätigungsdialoge beim Entfernen
