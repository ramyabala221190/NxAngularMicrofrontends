import { BehaviorSubject, of, Subject } from "rxjs";
import { Cart, ModifiedCart } from "../models/cart.model";
import { ModifiedProduct, Product } from "../models/product.model";
import { inject, Injectable } from "@angular/core";
import { UserService } from "./user";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({ providedIn: 'root' })

export class CartState {

    constructor(){
        console.log("instance of cartState")
    }

    private userService: UserService = inject(UserService);
    userData = toSignal(this.userService.getUser(), { initialValue: null });
    private initialCart:ModifiedCart={ userId: 0, products: [],subtotal:0,discount:0 };

    private userCart: ModifiedCart = this.initialCart;

    private userCartSub$ = new BehaviorSubject<ModifiedCart>(this.initialCart);


    addProductToCart(product: ModifiedProduct, userId: number) {
        const currentProducts: ModifiedProduct[] = JSON.parse(JSON.stringify(this.userCart.products))
        this.userCart = {
            ...this.initialCart,
            userId: userId,
            products: currentProducts.concat(product)
        }
        this.userCartSub$.next(this.userCart);
    }

    updateProductInCart(updatedProduct: ModifiedProduct) {
        const productIndex: number = this.userCart.products.findIndex(x => x.id == updatedProduct.id);
        this.userCart.products.splice(productIndex, 1, updatedProduct);
        this.userCartSub$.next(this.userCart);
    }

    getCart() {
        return this.userCartSub$.asObservable();
    }



}
