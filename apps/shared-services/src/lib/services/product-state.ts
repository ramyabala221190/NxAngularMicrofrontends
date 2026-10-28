import { Injectable } from '@angular/core';
import { ModifiedProduct } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn:'root'})

export class ProductState {

    private productListSub$=new BehaviorSubject<ModifiedProduct[]>([]); 

    updateProducts(productList:ModifiedProduct[]){
        this.productListSub$.next(productList);
    }

    getProducts(){
        return this.productListSub$.asObservable();
    }
}
