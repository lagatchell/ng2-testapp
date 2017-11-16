import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import * as firebase from 'firebase';

import { User } from './user';

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
        return this.verifyLogin();
    }

    verifyLogin(): boolean {
        if (this.userLoggedIn) { return true; }

        this.router.navigate(['/auth/login']);
        return false;
    }

    register(email: string, password: string) {
        let self = this;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(){
                self.verifyUser();
                
                if(self.authUser)
                {
                    firebase.database().ref('users/'+ self.authUser.uid).set ({
                        name: self.authUser.displayName,
                        email: self.authUser.email,
                        photoURL: self.authUser.photoURL
                    });
                }
            })
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
        const self = this;
        firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
        .catch(function(error){
            self.openSnackBar('Unable to login. Try again!', '');
        });
    }

    logout() {
        this.userLoggedIn = false;
        this.loggedInUser = '';
        const self = this;
        firebase.auth().signOut().then(function(){
            self.authUser = {};
            self.router.navigate(['home']);
        }),
        function(error) {
            self.openSnackBar('Unable to logout. Try again!', '');
        }
        this.openSnackBar('Logged out', '');
    }

    updateUser(user: User) {

        firebase.auth().currentUser.updateProfile({ 
            displayName: user.displayName,
            photoURL: user.photoURL
         });
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
