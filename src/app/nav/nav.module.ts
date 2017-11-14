import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { NavComponent } from './navComponent/nav.component';

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    BrowserModule,
    RouterModule
  ],
  exports: [
    NavComponent
  ],
  providers: [],
  bootstrap: [NavComponent]
})

export class NavModule { }