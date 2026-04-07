import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingComponent {}
