import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { map } from 'rxjs';
import { NAV_SECTIONS } from '../../shared/navigation/nav-section.model';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.html',
  styleUrl: './shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeDrawer()',
  },
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatIconButton,
    MatListModule,
  ],
})
export class ShellComponent {
  private readonly scrollDispatcher = inject(ScrollDispatcher);
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly navSections = NAV_SECTIONS;

  protected readonly isScrolledDown = signal(false);
  protected readonly isDrawerOpen = signal(false);

  protected readonly isLargeScreen = toSignal(
    this.breakpointObserver.observe('(min-width: 1024px)').pipe(
      map(result => result.matches)
    ),
    { initialValue: this.breakpointObserver.isMatched('(min-width: 1024px)') }
  );

  constructor() {
    let lastScrollTop = 0;
    this.scrollDispatcher.scrolled().pipe(
      map(() => {
        const el = document.documentElement;
        const current = el.scrollTop || document.body.scrollTop;
        const scrolledDown = current > lastScrollTop && current > 56;
        lastScrollTop = current <= 0 ? 0 : current;
        return scrolledDown;
      })
    ).subscribe(scrolledDown => this.isScrolledDown.set(scrolledDown));

    effect(() => {
      if (this.isLargeScreen()) {
        this.isDrawerOpen.set(false);
      }
    });
  }

  protected openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  protected toggleDrawer(): void {
    this.isDrawerOpen.update(open => !open);
  }
}
