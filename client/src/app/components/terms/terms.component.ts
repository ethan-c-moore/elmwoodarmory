import { Component } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-terms',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle("Terms and Conditions - Elmwood Armory");
  }
}
