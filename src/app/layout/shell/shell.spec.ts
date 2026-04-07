import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Subject, EMPTY } from 'rxjs';
import axe from 'axe-core';
import { ShellComponent } from './shell';

@Component({ selector: 'fake-home', template: '<p>Home</p>' })
class FakeHomeComponent {}

@Component({ selector: 'fake-shopping', template: '<p>Shopping</p>' })
class FakeShoppingComponent {}

@Component({ selector: 'fake-tasks', template: '<p>Tasks</p>' })
class FakeTasksComponent {}

const testRoutes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' as const },
      { path: 'home', component: FakeHomeComponent },
      { path: 'shopping', component: FakeShoppingComponent },
      { path: 'tasks', component: FakeTasksComponent },
    ],
  },
];

class MockBreakpointObserver {
  private readonly subject = new Subject<BreakpointState>();
  private _matches = false;

  observe(_queries: string | string[]) {
    return this.subject.asObservable();
  }

  isMatched(_query: string): boolean {
    return this._matches;
  }

  emit(matches: boolean): void {
    this._matches = matches;
    this.subject.next({ matches, breakpoints: {} });
  }
}

class MockScrollDispatcher {
  scrolled() { return EMPTY; }
  register() {}
  deregister() {}
  ancestorScrolled() { return EMPTY; }
  getAncestorScrollContainers() { return []; }
}

describe('ShellComponent', () => {
  let mockBreakpointObserver: MockBreakpointObserver;

  beforeEach(async () => {
    mockBreakpointObserver = new MockBreakpointObserver();

    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter(testRoutes),
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: ScrollDispatcher, useValue: new MockScrollDispatcher() },
      ],
    }).compileComponents();
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('marks drawer nav item active via routerLinkActive on route change', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    const router = TestBed.inject(Router);
    await fixture.whenStable();
    fixture.detectChanges();

    await router.navigate(['/shopping']);
    fixture.detectChanges();

    const activeItem = fixture.nativeElement.querySelector(
      'mat-nav-list a[aria-current="page"]'
    ) as HTMLElement | null;
    expect(activeItem?.textContent?.trim()).toContain('Shopping');
  });

  it('opens and closes drawer via toggleDrawer()', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    const component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component['isDrawerOpen']()).toBe(false);

    component['toggleDrawer']();
    expect(component['isDrawerOpen']()).toBe(true);

    component['toggleDrawer']();
    expect(component['isDrawerOpen']()).toBe(false);
  });

  it('closes drawer when Escape key is pressed', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    const component = fixture.componentInstance;
    await fixture.whenStable();

    component['openDrawer']();
    fixture.detectChanges();
    expect(component['isDrawerOpen']()).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(component['isDrawerOpen']()).toBe(false);
  });

  it('reflects isLargeScreen signal when breakpoint matches', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    const component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component['isLargeScreen']()).toBe(false);

    mockBreakpointObserver.emit(true);
    fixture.detectChanges();

    expect(component['isLargeScreen']()).toBe(true);
  });

  it('auto-closes drawer when switching to large screen', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    const component = fixture.componentInstance;
    await fixture.whenStable();

    component['openDrawer']();
    fixture.detectChanges();
    expect(component['isDrawerOpen']()).toBe(true);

    mockBreakpointObserver.emit(true);
    fixture.detectChanges();
    expect(component['isDrawerOpen']()).toBe(false);
  });
});

describe('ShellComponent accessibility', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([
          { path: 'home', component: FakeHomeComponent },
          { path: '**', redirectTo: 'home' },
        ]),
        { provide: BreakpointObserver, useValue: new MockBreakpointObserver() },
        { provide: ScrollDispatcher, useValue: new MockScrollDispatcher() },
      ],
    }).compileComponents();
  });

  it('has zero AXE violations', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const results = await axe.run(fixture.nativeElement as Element);
    expect(results.violations).toHaveLength(0);
  });
});
