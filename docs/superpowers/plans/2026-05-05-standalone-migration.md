# Standalone Components Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Adventsrad from NgModule to fully standalone components, remove AppModule, update bootstrap, and clean up three unused npm packages.

**Architecture:** Both components become self-contained with their own `imports` arrays. `AppModule` is deleted. Bootstrap switches from `platformBrowserDynamic().bootstrapModule()` to `bootstrapApplication()`. No behavior changes — all 15 existing tests must pass throughout.

**Tech Stack:** Angular 21, TypeScript 5.9, Karma/Jasmine

---

## File Map

| File | Change |
|---|---|
| `src/app/app.component.spec.ts` | `declarations` → `imports` in TestBed setup (Task 1) |
| `src/app/components/mates/mates.component.ts` | Add `standalone: true`, `imports: [FormsModule]` (Task 2) |
| `src/app/app.component.ts` | Add `standalone: true`, `imports: [MatesComponent]` (Task 2) |
| `src/app/app.module.ts` | **Delete** (Task 3) |
| `src/main.ts` | Switch to `bootstrapApplication()` (Task 3) |
| `package.json` / `package-lock.json` | Remove 3 unused packages via npm (Task 4) |

---

## Task 1: Update test setup to use standalone imports (RED)

**Files:**
- Modify: `src/app/app.component.spec.ts:38-41`

- [ ] **Step 1: Replace `declarations` with `imports` in TestBed**

In `src/app/app.component.spec.ts`, change the `configureTestingModule` call:

```typescript
// Before:
await TestBed.configureTestingModule({
  declarations: [AppComponent, MatesComponent],
  imports: [FormsModule],
}).compileComponents();

// After:
await TestBed.configureTestingModule({
  imports: [AppComponent, MatesComponent, FormsModule],
}).compileComponents();
```

- [ ] **Step 2: Run tests to verify RED state**

```
npx ng test --watch=false --browsers=ChromeHeadless --no-progress
```

Expected: compile error — `Component AppComponent is not standalone and cannot be directly imported`. This proves the test checks for standalone correctness.

---

## Task 2: Convert both components to standalone (GREEN)

**Files:**
- Modify: `src/app/components/mates/mates.component.ts`
- Modify: `src/app/app.component.ts`
- Modify: `src/app/app.module.ts` (clear declarations — full deletion happens in Task 3)

- [ ] **Step 1: Convert MatesComponent**

Replace the `@Component` decorator in `src/app/components/mates/mates.component.ts`:

```typescript
// Before:
@Component({
    selector: 'app-mates',
    templateUrl: './mates.component.html',
    styleUrls: ['./mates.component.css'],
    standalone: false
})

// After:
@Component({
    standalone: true,
    imports: [FormsModule],
    selector: 'app-mates',
    templateUrl: './mates.component.html',
    styleUrls: ['./mates.component.css'],
})
```

Also add the `FormsModule` import at the top of the file:

```typescript
import { FormsModule } from '@angular/forms';
```

- [ ] **Step 2: Convert AppComponent**

Replace the `@Component` decorator in `src/app/app.component.ts`:

```typescript
// Before:
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})

// After:
@Component({
    standalone: true,
    imports: [MatesComponent],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
```

Also add the `MatesComponent` import at the top of the file:

```typescript
import { MatesComponent } from './components/mates/mates.component';
```

- [ ] **Step 3: Remove both components from AppModule declarations**

In `src/app/app.module.ts`, empty the `declarations` array (Angular rejects standalone components in declarations):

```typescript
@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

- [ ] **Step 4: Run tests to verify GREEN state**

```
npx ng test --watch=false --browsers=ChromeHeadless --no-progress
```

Expected: `TOTAL: 15 SUCCESS`

---

## Task 3: Delete AppModule and update bootstrap

**Files:**
- Delete: `src/app/app.module.ts`
- Modify: `src/main.ts`

- [ ] **Step 1: Replace main.ts**

Overwrite `src/main.ts` with:

```typescript
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
}).catch(err => console.error(err));
```

- [ ] **Step 2: Run tests to verify still GREEN**

```
npx ng test --watch=false --browsers=ChromeHeadless --no-progress
```

Expected: `TOTAL: 15 SUCCESS`

- [ ] **Step 3: Verify production build succeeds**

```
npx ng build --configuration production
```

Expected: build completes without errors, `dist/adventsrad` is populated.

- [ ] **Step 4: Commit**

`git rm` removes the file from disk and stages the deletion in one step:

```
git add src/app/app.component.ts src/app/components/mates/mates.component.ts src/app/app.component.spec.ts src/main.ts
git rm src/app/app.module.ts
git commit -m "migrate to standalone components, remove AppModule"
```

---

## Task 4: Remove unused npm packages

**Files:**
- Modify: `package.json` (via npm)
- Modify: `package-lock.json` (via npm)

- [ ] **Step 1: Uninstall the three unused packages**

```
npm uninstall @angular/router @angular/animations @xmldom/xmldom
```

Expected output: three packages removed from `package.json` and `package-lock.json`.

- [ ] **Step 2: Run tests to confirm nothing broke**

```
npx ng test --watch=false --browsers=ChromeHeadless --no-progress
```

Expected: `TOTAL: 15 SUCCESS`

- [ ] **Step 3: Verify production build still succeeds**

```
npx ng build --configuration production
```

Expected: build completes. Bundle size should be smaller than before Task 4 (three packages removed from tree-shaking scope).

- [ ] **Step 4: Commit**

```
git add package.json package-lock.json
git commit -m "remove unused dependencies: router, animations, xmldom"
```
