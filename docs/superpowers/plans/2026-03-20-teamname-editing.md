# Teamname-Bearbeitung verbessern — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Bearbeitung von Teamnamen im `MatesComponent` auf eine übersichtliche Inline-Edit-Liste mit Einzelhinzufügen und ✕-Button-Entfernen umstellen.

**Architecture:** Nur `MatesComponent` wird geändert (Template, TypeScript, CSS). Der `TeamMateService` bleibt unverändert. `saveNewMate()` wird zu `addMate()` mit einzelner Namensvalidierung umgebaut. Ein neuer `removeMate()`-Handler im Edit-Modus ruft `removePlayer(name, true)` auf.

**Tech Stack:** Angular 21, TypeScript, ngModel (FormsModule bereits importiert), localStorage via TeamMateService

---

## Dateien

| Datei | Aktion |
|-------|--------|
| `src/app/components/mates/mates.component.ts` | Modifizieren |
| `src/app/components/mates/mates.component.html` | Modifizieren |
| `src/app/components/mates/mates.component.css` | Modifizieren |

Kein neues File, kein Service-Umbau nötig.

---

## Task 1: `addMate()` in der TypeScript-Komponente

**Files:**
- Modify: `src/app/components/mates/mates.component.ts`

- [ ] **Schritt 1: `saveNewMate()` durch `addMate()` ersetzen**

Ersetze die gesamte `saveNewMate()`-Methode (Zeilen 52–63) durch:

```typescript
addMate() {
  const name = this.newMateName.trim();
  if (!name) return;
  if (this.members.includes(name)) return;
  this.teamService.addPlayers([name]);
  this.loadMembers();
  this.newMateName = '';
  this.onMatelistChanged.emit();
}
```

Wichtig:
- Kein `split(',')` mehr
- `this.isEditing` wird **nicht** auf `false` gesetzt
- Duplikat-Check: `this.members.includes(name)` (case-sensitive)

- [ ] **Schritt 2: `removeMate()`-Methode hinzufügen**

Direkt nach `addMate()` einfügen:

```typescript
removeMate(member: string) {
  this.teamService.removePlayer(member, true);
  this.loadMembers();
  this.onMatelistChanged.emit();
}
```

- [ ] **Schritt 3: Build prüfen**

```bash
npm run build
```

Erwartet: Build erfolgreich, keine TypeScript-Fehler

- [ ] **Schritt 4: Commit**

```bash
git add src/app/components/mates/mates.component.ts
git commit -m "refactor: saveNewMate → addMate (einzeln, kein Komma), removeMate hinzugefügt"
```

---

## Task 2: Template überarbeiten

**Files:**
- Modify: `src/app/components/mates/mates.component.html`

- [ ] **Schritt 1: Gesamtes Template ersetzen**

Ersetze den vollständigen Inhalt von `mates.component.html` durch (bei Problemen: `git checkout src/app/components/mates/mates.component.html` stellt den Originalzustand wieder her):

```html
<h3>Pool</h3>
@for (member of members; track member) {
  <button (click)="won(member)" [disabled]="isEditing">{{member}}</button>
}
<button class="reset" (click)="reset()">Reset</button>

<button class="changeMates" (click)="editMateList()">{{isEditing ? 'Close' : 'Change'}}</button>

@if (isEditing) {
  <div class="editList">
    @for (member of members; track member) {
      <div class="editRow">
        <span>{{member}}</span>
        <button class="removeBtn" (click)="removeMate(member)" [disabled]="members.length <= 1">✕</button>
      </div>
    }
  </div>
  <div class="changeForm">
    <input
      type="text"
      [(ngModel)]="newMateName"
      placeholder="Name hinzufügen"
      (keyup.enter)="addMate()"
    />
    <button (click)="addMate()">Hinzufügen</button>
  </div>
}
```

Änderungen gegenüber vorher:
- Normalmodus-Buttons: `[disabled]="isEditing"` — kein Klick-zum-Entfernen im Edit-Modus. **Wichtig:** Dieses Binding ist nicht nur UX, sondern sicherheitsrelevant: `won()` ruft intern `removePlayer(member, this.isEditing)` auf — würde es im Edit-Modus aufgerufen, wäre die Löschung dauerhaft (Backup betroffen).
- `[class.editMode]="isEditing"` entfernt
- Neuer `div.editList`-Block mit `div.editRow` pro Mitglied + ✕-Button
- ✕-Button: `[disabled]="members.length <= 1"`
- Eingabefeld: neuer Placeholder, `(keyup.enter)="addMate()"`
- "Save" → "Hinzufügen", ruft `addMate()` auf
- `<em>`-Hinweistext entfernt

- [ ] **Schritt 2: Build prüfen**

```bash
npm run build
```

Erwartet: Build erfolgreich

- [ ] **Schritt 3: Commit**

```bash
git add src/app/components/mates/mates.component.html
git commit -m "feat: Edit-Modus als Inline-Liste mit ✕-Button, Einzelhinzufügen"
```

---

## Task 3: CSS anpassen

**Files:**
- Modify: `src/app/components/mates/mates.component.css`

- [ ] **Schritt 1: `.editMode` entfernen, neue Edit-Zeilen-Stile hinzufügen**

Ersetze den vollständigen Inhalt von `mates.component.css` durch:

```css
:host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

button {
    padding: .5em;
    width: 100px;
    margin-bottom: 1em;
}

button.reset {
    background-color: crimson;
}

.changeMates {
    margin-top: 3em;
    background-color: #eee;
    color: #555;
}

.editList {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 200px;
    margin-bottom: 1em;
}

.editRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .5em;
}

.editRow span {
    flex: 1;
}

.removeBtn {
    width: auto;
    padding: .2em .5em;
    margin-bottom: 0;
    background-color: crimson;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.removeBtn:disabled {
    opacity: 0.3;
    cursor: default;
}

.changeForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
    margin-bottom: 1em;
}

.changeForm input {
    padding: .2em;
    width: 200px;
}
```

- [ ] **Schritt 2: Build + Test**

```bash
npm run build && npm test -- --watch=false --browsers=ChromeHeadless
```

Erwartet: Build erfolgreich, alle vorhandenen Tests bestehen (Anzahl variiert je nach vorhandenen Spec-Dateien)

- [ ] **Schritt 3: Commit**

```bash
git add src/app/components/mates/mates.component.css
git commit -m "style: editMode-Klasse entfernt, Edit-Zeilen-Layout hinzugefügt"
```

---

## Task 4: Manuelle Verifikation

- [ ] **Schritt 1: Dev-Server starten**

```bash
npm start
```

Öffne `http://localhost:4200` im Browser.

- [ ] **Schritt 2: Normalmodus prüfen**

- Namen werden als Buttons angezeigt ✓
- Klick auf einen Namen entfernt ihn aus dem Pool ✓
- "Reset" stellt die Liste wieder her ✓

- [ ] **Schritt 3: Edit-Modus prüfen**

- "Change" öffnet den Edit-Modus ✓
- Namen im Normalmodus nicht mehr klickbar (disabled) ✓
- Jeder Name erscheint als Zeile mit ✕-Button ✓
- ✕-Button bei letztem verbleibendem Mitglied ist deaktiviert ✓
- Entfernter Name erscheint auch nach "Reset" nicht mehr ✓

- [ ] **Schritt 4: Hinzufügen prüfen**

- Name im Eingabefeld eingeben, "Hinzufügen" klicken → Name erscheint ✓
- Enter-Taste funktioniert ebenfalls ✓
- Leere Eingabe wird ignoriert ✓
- Doppelter Name wird ignoriert ✓
- Edit-Modus bleibt nach Hinzufügen offen ✓
- Eingabefeld wird nach Hinzufügen geleert ✓

- [ ] **Schritt 5: Abschluss-Commit (falls noch ausstehende Änderungen)**

```bash
git status
```
