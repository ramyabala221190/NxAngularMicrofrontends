import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartState, ModifiedCart, ModifiedProduct } from '@my-shopping-app/shared-services';
import { Quantity } from '@my-shopping-app/shared-styles';


@Component({
  selector: 'app-cart-detail',
  imports: [CommonModule, Quantity],
  standalone: true,
  templateUrl: './cart-detail.html',
  styleUrl: './cart-detail.scss'
})
export class CartDetail {

  constructor() {
    effect(() => {
      //triggers only when cartdata signal value changes
      const cartData = this.cartData();
      this.updatedCartData.set(cartData);
    })
  }

  private cartStateService: CartState = inject(CartState);

  private cartData: Signal<ModifiedCart> = toSignal(this.cartStateService.getCart(),{ initialValue: { userId: 0, products: [], subtotal: 0, finalPrice: 0, discount: 0 } })

  updatedCartData = signal<ModifiedCart>({ userId: 0, products: [], subtotal: 0, discount: 0 });

  totalDiscount = computed(() => {
    return this.updatedCartData().products.reduce((acc: number, curr: ModifiedProduct) => {
      acc = acc + curr.discountPercentage;
      return acc;
    }, 0)
  })

  subTotal = computed(() => {
    return this.updatedCartData().products.reduce((acc: number, curr: ModifiedProduct) => {
      acc = acc + parseFloat(((((curr.price * curr.discountPercentage) / 100) + curr.price) * curr.quantity).toFixed(2));
      return acc;
    }, 0)
  })

  finalPrice=computed(()=>{
    const subTotal=this.subTotal();
    const discount= this.totalDiscount();
    return (subTotal-discount).toFixed(2);
  })

  updateQuantity(product:ModifiedProduct,newQuantity:number){
    //this is essential to ensure we create a new reference to the modified product so that
    //change in updatedCartDaqta retriggers the subtotal,discount and finalPrice signals.
    //This is because signal change retriggers only on shallow updates. Since we have deep field update here,
    // we need to do the update manually
    this.updatedCartData.update((originalCart:ModifiedCart)=>{
      const updatedProductList=originalCart.products.map((x:ModifiedProduct)=>{
        if(x.id == product.id){
          x.quantity=newQuantity;
        }
        return x;
      })
      return {
        ...originalCart,
        products:updatedProductList
      }
    })

  }


}
