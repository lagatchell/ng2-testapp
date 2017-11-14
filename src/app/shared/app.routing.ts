import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { ErrorComponent } from '../error/error.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'home' , component: HomeComponent},
            { path: '' , component: HomeComponent},
            { path: '**' , component: ErrorComponent }
        ])
    ],
    exports: [
        RouterModule
    ],
    declarations: [
    ]
})
export class AppRoutingModule {}

