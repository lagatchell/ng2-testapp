import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { NavModule } from '../nav/nav.module';

import { AuthComponent } from './authComponent/auth.component';
import { LoginComponent }    from './login/login.component';
import { SignUpComponent }    from './signUp/sign-up.component';
import { AccountComponent } from './account/account.component';

import { MaterialDesignModule } from '../shared/mat.module';
import { UserService } from './authShared/user.service';

const AuthRoutes: Routes = [
    { 
        path: 'auth',  
        component: AuthComponent, 
        children: [
            { path: 'account', component: AccountComponent, canActivate: [UserService] },
            { path: 'signup', component: SignUpComponent },
            { path: 'login', component: LoginComponent },
            { path: '', component: LoginComponent}
        ]
    },
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(AuthRoutes),
        NavModule,
        MaterialDesignModule
    ],
    exports: [
        RouterModule       
    ],
    declarations: [
        AuthComponent,
        LoginComponent,
        SignUpComponent,
        AccountComponent
    ],
    providers: [
        UserService
    ]
})
export class AuthModule {}

