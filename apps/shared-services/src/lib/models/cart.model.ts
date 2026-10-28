import { ModifiedProduct } from "./product.model";

export interface Cart {
    userId: number,
    products: ModifiedProduct[]
}

export interface ModifiedCart{
    userId:number,
    products:ModifiedProduct[],
    subtotal:number,
    discount:number
}


