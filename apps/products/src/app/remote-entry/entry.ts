import { Component } from '@angular/core';
import { ProductList } from '../product-list/productList';

@Component({
  imports: [ProductList],
  selector: 'app-products-entry',
  template: `<app-product-list></app-product-list>`
})
export class RemoteEntry {}
