import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  constructor(public router: Router)
  {}


  signup() {
    this.router.navigate(['/auth/signup']);
  }

  browse() {
    this.router.navigate(['/auth/movies']);
  }

}
