import { Component, effect, inject, OnInit, signal, Signal } from '@angular/core';
import { ProductService } from '../services/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartState, ModifiedProduct, Product, ProductState, Review, User, UserService } from '@my-shopping-app/shared-services';
import { ProductDetail } from '../product-detail/productDetail';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule,ProductDetail],
  templateUrl: './productList.html',
  styleUrl: './productList.scss'
})
export class ProductList implements OnInit {

  constructor(){
    effect(()=>{
      this.updatedProductList.set(this.productList());
    })
  }

  private productService: ProductService = inject(ProductService);
  private cartStateService:CartState=inject(CartState);
  private userService:UserService=inject(UserService);
  private productState:ProductState=inject(ProductState);
  userDetail!:User;

  reviewStarColor="rgb(245 158 11)";

  totalStarCount = Array.from({ length: 5}, (value, index) => index);

  private existingProductList=toSignal(this.productState.getProducts(),{initialValue:[]})

  private productList:Signal<ModifiedProduct[]> = this.existingProductList().length ? this.existingProductList : toSignal(this.productService.getProductList().pipe(
    map(y => {

      return y.products.map((x: Product) => {
        const totalRatingCount = x.reviews.reduce((acc: number, curr: Review) => {
          acc = acc + curr.rating;
          return acc;
        }, 0);
        const ratingUserCountMap=this.totalStarCount.reduce((acc:{rating:number,count:number,per:number}[],curr:number)=>{
            acc=acc.concat({
              rating:curr+1,
              per: ((curr+1)/this.totalStarCount.length)*100,
              count:x.reviews.filter(x=>x.rating == curr+1).length
            });
            return acc;
        },[])
        const avgRating = totalRatingCount / x.reviews.length;
        return {
          ...x,
          ratingUserCountMap: ratingUserCountMap,
          averageRating: avgRating,
          flrAverageRating: parseFloat(avgRating.toFixed(2)),
          quantity: x.minimumOrderQuantity,
          selectedImage: x.thumbnail,
          imageZoomed:false,
          productAdded:false,
          originalPrice: x.discountPercentage > 0 ? parseFloat((((x.price * x.discountPercentage)/100)+x.price).toFixed(2)) : x.price
        }
      })
    })), { initialValue: [] });

  updatedProductList=signal<ModifiedProduct[]>([]);

    ngOnInit(){
      this.userService.getUser().subscribe((result:User|null)=>{
        console.log(result);
        if(result){
        this.userDetail=result;
        }
      })
    }

    updatingProductList(modifiedProduct:ModifiedProduct){
      this.updatedProductList.update((list:ModifiedProduct[])=>{
        return list.map((product:ModifiedProduct)=>{
          return product.id == modifiedProduct.id ? modifiedProduct : product
        })
      })
    }

    addProductToCart(product:ModifiedProduct){
      product.productAdded=true;
      this.updatingProductList(product);
      this.productState.updateProducts(this.updatedProductList());
      this.cartStateService.addProductToCart(product,this.userDetail.id);
    }

}
