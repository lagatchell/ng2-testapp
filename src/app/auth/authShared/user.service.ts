import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import {MatSnackBar} from '@angular/material';

import * as firebase from 'firebase';

@Injectable()
export class UserService implements CanActivate {
    userLoggedIn: boolean = false;
    loggedInUser: string;
    authUser: any;

    constructor( private router: Router, private snackBar: MatSnackBar ) {
        firebase.initializeApp({
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: ""
        });
     }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.verifyLogin(url);
    }

    verifyLogin(url: string): boolean {
        if (this.userLoggedIn) { return true; }

        this.router.navigate(['/auth/login']);
        return false;
    }

    register(email: string, password: string) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error){
                alert(`${error.message} Please Try Again!`);
            });
    }

    verifyUser() {
        this.authUser = firebase.auth().currentUser;
        if(this.authUser)
        {
            this.loggedInUser = this.authUser.email;
            this.userLoggedIn = true;
            this.router.navigate(['']);
        }    
    }

    login(loginEmail: string, loginPassword: string) {
        firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
        .catch(function(error){
            alert(`${error.message} Unable to login. Try again!`);
        });
    }

    logout() {
        this.userLoggedIn = false;
        this.loggedInUser = '';
        this.authUser = {};
        let self = this;
        firebase.auth().signOut().then(function(){
            self.router.navigate(['home']);
        }),
        function(error){
            alert(`${error.message} Unable to logout. Try again!`);
        }
        this.openSnackBar('You have successfuly logged out', '');
    }

    updateUser(displayName) {
        firebase.auth().currentUser.updateProfile({ 
            displayName: displayName,
            photoURL: ''
         });
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
