# Design: Verbesserte Bearbeitung von Teamnamen

**Datum:** 2026-03-20
**Komponente:** `MatesComponent`
**Status:** Approved

---

## Problemstellung

Die aktuelle Implementierung erlaubt nur die Eingabe mehrerer Namen gleichzeitig über eine kommagetrennte Texteingabe. Das ist wenig intuitiv und die UX ist unübersichtlich.

## Ziel

- Namen einzeln hinzufügen (Eingabefeld + Button)
- Namen einzeln entfernen (✕-Button je Eintrag, nur im Edit-Modus sichtbar)
- Klarere, übersichtlichere Oberfläche

---

## Design

### Normalmodus (unverändert)

- Namen werden als Buttons dargestellt
- Klick auf einen Namen entfernt ihn aus dem aktiven Pool (Gewinner) — ruft `won(member)` auf
- "Change"-Button öffnet den Edit-Modus
- "Reset"-Button stellt die ursprüngliche Liste wieder her

### Edit-Modus (überarbeitet)

**Namensliste:**
- Jeder Name wird als Zeile dargestellt: `[Name]  [✕]`
- ✕-Button entfernt den Eintrag sofort und dauerhaft (`removePlayer(name, true)` — `isEditing: true` ist zwingend, damit auch der Backup-Store aktualisiert wird und Reset ihn nicht wiederherstellt)
- ✕-Button ist deaktiviert (disabled), wenn noch genau ein Name in der Liste ist — ein leeres Rad wäre ein Fehlerfall
- Mitglieder-Buttons reagieren im Edit-Modus nicht auf Klicks (`won()` wird nicht aufgerufen); der Klick-Handler wird im Template per `[disabled]="isEditing"` oder `(click)`-Guard deaktiviert

**Hinzufügen:**
- Eingabefeld für einen einzelnen Namen
- Hinzufügen per "Hinzufügen"-Button oder Enter-Taste (`(keyup.enter)="addMate()"`)
- Leere oder nur-Whitespace-Eingaben werden abgelehnt (`trim() === ''` → kein Hinzufügen)
- Bereits vorhandene Namen (Duplikate, Vergleich case-sensitive) werden abgelehnt
- Nach dem Hinzufügen bleibt der Edit-Modus geöffnet; das Eingabefeld wird geleert
- Kein Komma-Parsing mehr

**Schließen:**
- "Close"-Button beendet den Edit-Modus (wie bisher)
- Hinweistext ("Alle Namen sind jetzt im Bearbeitungsmodus") entfällt

---

## Technische Änderungen

### `mates.component.html`

- Normalmodus: Mitglieder-Buttons mit `[disabled]="isEditing"` oder `*ngIf`/`@if`-Guard, damit sie im Edit-Modus nicht klickbar sind
- Edit-Modus-Block: Namen als `<div>`-Zeilen mit ✕-`<button>` statt als `<button class="editMode">`
  - ✕-Button: `[disabled]="members.length <= 1"`
- Eingabefeld: Placeholder "Name hinzufügen", `(keyup.enter)="addMate()"`
- "Hinzufügen"-Button ruft `addMate()` auf
- "Save"-Button entfällt, Hinweistext `<em>` entfällt

### `mates.component.ts`

- `saveNewMate()` wird zu `addMate()`:
  - Trimmt die Eingabe, bricht ab wenn leer
  - Prüft auf Duplikat (case-sensitive), bricht ab wenn vorhanden
  - Ruft `teamService.addPlayers([this.newMateName.trim()])` auf (Array mit einem Element, passend zur Service-Signatur)
  - Setzt `this.newMateName = ''` zurück
  - Setzt `this.isEditing` **nicht** auf false — Edit-Modus bleibt offen
- ✕-Button-Handler: ruft `teamService.removePlayer(name, true)` auf, dann `loadMembers()`, dann `onMatelistChanged.emit()` — konsistent mit `won()` und `reset()`

### `mates.component.css`

- `.editMode`-Stil (orange Buttons im Edit-Modus) entfällt
- Neue Stile für Edit-Zeilen: Flexbox, Name linksbündig, ✕-Button rechtsbündig
- Deaktivierte ✕-Buttons erhalten reduzierten Opacity-Wert

---

## Nicht im Scope

- Umbenennen bestehender Namen
- Drag & Drop Sortierung
- Bestätigungsdialoge beim Entfernen
