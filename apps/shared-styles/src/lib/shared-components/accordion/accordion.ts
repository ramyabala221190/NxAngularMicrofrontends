import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-accordion',
  imports: [],
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss'
})
export class Accordion {

@Input('accordionIdentifier')accordionIdentifier!:string|number;
@Input('accordionHeading')accordionHeading!:string;

}
