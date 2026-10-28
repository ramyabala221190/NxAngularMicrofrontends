import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Star, Quantity, Accordion } from '@my-shopping-app/shared-styles';
import { RatingProgressPipe } from '../pipes/rating-progress-pipe';
import { ModifiedProduct, Product } from '@my-shopping-app/shared-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule,Star,Quantity,Accordion,RatingProgressPipe],
  templateUrl: './productDetail.html',
  styleUrl: './productDetail.scss'
})
export class ProductDetail {


  @Input('pro')pro!:ModifiedProduct;
  @Input('reviewStarColor')reviewStarColor:string="";
  @Input('totalStarCount')totalStarCount:number[]=[];
  @Output('addToCart')addToCart=new EventEmitter<ModifiedProduct>();

  addProductToCart(product:ModifiedProduct){
     this.addToCart.emit(product);
  }

}
