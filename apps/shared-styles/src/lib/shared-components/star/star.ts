import { CommonModule } from '@angular/common';
import { Component, computed, Input, Signal } from '@angular/core';

@Component({
  selector: 'app-star',
  imports: [CommonModule],
  templateUrl: './star.html',
  styleUrl: './star.scss'
})
export class Star {

  @Input('totalStarCount') totalStarCount!: number;
  @Input('totalStarsReceived') totalStarsReceived!: number;
  @Input('starFillColor')starFillColor:string="black";
  partialFilledStars=false;
  filledStars:number[]=[];
  emptyStars:number[]=[];

  ngOnChanges(){
    this.partialFilledStars=!Number.isInteger(this.totalStarsReceived);
    this.filledStars=Array.from({ length:  Math.floor(this.totalStarsReceived) }, (value, index) => index);
    this.emptyStars=Array.from({ length:  this.totalStarCount - Math.floor(this.totalStarsReceived) - (!Number.isInteger(this.totalStarsReceived) ? 1 : 0)}, (value, index) => index);
  }

}
