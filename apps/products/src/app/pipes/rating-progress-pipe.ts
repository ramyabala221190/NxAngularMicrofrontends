import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingProgress',
  standalone:true,
  pure:true
})
export class RatingProgressPipe implements PipeTransform {
  transform(rating:number,list: {rating:number,count:number,per:number}[]): {count:number,per:number} {
    const entry=list.find(x=>x.rating == rating);
    return {count: entry?.count || 0, per: entry?.per || 0 }
  }
}
