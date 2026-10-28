import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {Product} from '@my-shopping-app/shared-services';

@Injectable({providedIn:'root'})

export class ProductService {

    constructor(private httpClient:HttpClient){}

    getProductList():Observable<{products:Product[]}>{
        return this.httpClient.get<{products:Product[]}>('https://dummyjson.com/products');
    }
}
