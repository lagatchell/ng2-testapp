import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { NavModule } from '../nav/nav.module';

import { AuthComponent } from './authComponent/auth.component';
import { LoginComponent }    from './login/login.component';
import { SignUpComponent }    from './signUp/sign-up.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateMovieComponent } from './movies/createMovie/createMovie.component';
import { MovieListComponent, InfoDialog } from './movies/movieList/movieList.component';
import { RentComponent, rentInfoDialog } from './rent/rent.component';

import { MaterialDesignModule } from '../shared/mat.module';
import { UserService } from './authShared/user.service';
import { MovieService } from './authShared/movie.service';
import { RentService } from './authShared/rent.service';
import { WishListService } from './authShared/wishlist.service';
import { HistoryService } from './authShared/history.service';

const AuthRoutes: Routes = [
    { 
        path: 'auth',  
        component: AuthComponent, 
        children: [
            { path: 'movies', component: MovieListComponent },
            { path: 'rentals', component: RentComponent, canActivate: [UserService] },
            { path: 'create', component: CreateMovieComponent, canActivate: [UserService] },
            { path: 'profile', component: ProfileComponent, canActivate: [UserService] },
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
        ProfileComponent,
        CreateMovieComponent,
        MovieListComponent,
        RentComponent,
        InfoDialog,
        rentInfoDialog
    ],
    entryComponents: [InfoDialog, rentInfoDialog],
    providers: [
        UserService,
        MovieService,
        RentService,
        WishListService,
        HistoryService
    ]
})
export class AuthModule {}

