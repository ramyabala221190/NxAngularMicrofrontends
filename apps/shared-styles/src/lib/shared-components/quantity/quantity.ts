import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-quantity',
  imports: [],
  templateUrl: './quantity.html',
  styleUrl: './quantity.scss'
})
export class Quantity {

  @Input('minOrderQty') minOrderQty!: number;
  @Input('providedQty')providedQty !:number;
  @Output('updatedQuantity') updatedQuantity = new EventEmitter<number>();
  quantity: number = 0;

  ngOnChanges() {
    if(!this.providedQty){
    this.quantity = this.minOrderQty;
    return;
    }
      this.quantity = this.providedQty;
  }

  increaseQunatity() {
    this.quantity = this.quantity + 1;
    this.updatedQuantity.emit(this.quantity)
  }

  decreaseQuantity() {
    this.quantity = this.quantity == this.minOrderQty ? this.quantity : this.quantity - 1;
    this.updatedQuantity.emit(this.quantity)
  }

}
