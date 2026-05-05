# Standalone Components Migration

**Date:** 2026-05-05
**Status:** Approved

## Goal

Migrate the Adventsrad Angular app from NgModule-based architecture to fully standalone components. Remove `AppModule`, update the bootstrap entry point, and clean up three unused npm dependencies.

## Scope

- Convert `AppComponent` and `MatesComponent` to `standalone: true`
- Delete `app.module.ts`
- Update `main.ts` to use `bootstrapApplication()`
- Remove unused packages: `@angular/router`, `@angular/animations`, `@xmldom/xmldom`
- Update `app.component.spec.ts` to use `imports` instead of `declarations`

Out of scope: Angular Signals, `output()`, zoneless mode (P3).

## Component Changes

### AppComponent

Add `standalone: true` and declare direct template dependencies in `imports`.

```typescript
@Component({
  standalone: true,
  imports: [MatesComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
```

`MatesComponent` is the only direct template dependency. `TeamMateService` is injected via DI and requires no import.

### MatesComponent

Add `standalone: true` and import `FormsModule` (required for `[(ngModel)]` in the template).

```typescript
@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-mates',
  templateUrl: './mates.component.html',
  styleUrls: ['./mates.component.css'],
})
```

### TeamMateService

No changes. `providedIn: 'root'` works independently of NgModule.

## Bootstrap

Replace `platformBrowserDynamic().bootstrapModule(AppModule)` with `bootstrapApplication()`.

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch(err => console.error(err));
```

No `providers` array is needed: `TeamMateService` is tree-shakeable via `providedIn: 'root'`.

`app.module.ts` is deleted. No other file references it after the bootstrap change.

## Dependency Cleanup

Three packages are unused and will be removed:

| Package | Reason |
|---|---|
| `@angular/router` | No routes configured, no `RouterModule` imported anywhere |
| `@angular/animations` | No `BrowserAnimationsModule`, no animation triggers |
| `@xmldom/xmldom` | No import in any source file |

Command: `npm uninstall @angular/router @angular/animations @xmldom/xmldom`

## Test Changes

`app.component.spec.ts`: `declarations` array replaced with `imports` — standalone components are imported, not declared.

```typescript
await TestBed.configureTestingModule({
  imports: [AppComponent, MatesComponent, FormsModule],
}).compileComponents();
```

`team-mate.service.spec.ts`: No changes required.

## Verification

After migration, all 15 existing tests must pass without modification to test logic.

`ng build --configuration production` must succeed and produce a smaller bundle (three removed packages).
