import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import {MatSnackBar} from '@angular/material';

@Injectable()
export class WishListService {

    constructor(
        public snackBar: MatSnackBar
    ){}

    addMovie(userID, movie) {
        const self = this;
        
        let dbRef = firebase.database().ref('wishlist/'+ userID);
        let rentedMovie = dbRef.push();
        rentedMovie.set ({
            movieId: movie.id
        });

        self.openSnackBar(movie.title + ' has been added to your wish list','');
    }

    removeMovie(userID, movieID) {
        const self = this;

        let dbRef = firebase.database().ref('wishlist/'+userID).child(movieID).remove();

        self.openSnackBar('Movie has been removed from wish list','');
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}