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
        let wishlistMovie = dbRef.push();
        wishlistMovie.set ({
            movieId: movie.id,
            id: wishlistMovie.key
        })
        .then(function(){
            self.openSnackBar(movie.title + ' has been added to your wish list','');
        })
        .catch(function(error){
            console.log(error.message);
        });
    }

    removeMovie(userID, wishlistKey, movieTitle) {
        const self = this;

        let dbRef = firebase.database().ref('wishlist/'+userID).child(wishlistKey).remove()
            .then(function(){
                self.openSnackBar(movieTitle + ' has been removed from your wish list','');
            })
            .catch(function(error){
                console.log(error.message);
            });
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}