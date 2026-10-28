import { Component } from '@angular/core';
import { CartDetail } from '../cart-detail/cart-detail';

@Component({
  imports: [CartDetail],
  selector: 'app-carts-entry',
  template: `<app-cart-detail></app-cart-detail>`
})
export class RemoteEntry {}
