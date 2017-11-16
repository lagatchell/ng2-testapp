import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import {MatSnackBar} from '@angular/material';

@Injectable()
export class RentService {

    constructor(
        public snackBar: MatSnackBar
    ){}

    rentMovie(userID, movie) {
        const self = this;
        
        let dbRef = firebase.database().ref('rented/'+ userID);
        let rentedMovie = dbRef.push();
        rentedMovie.set ({
            movieId: movie.id,
            id: rentedMovie.key
        });

        self.openSnackBar(movie.title + ' has been added to your rentals','');
    }

    returnMovie(userID, rentedKey, movie) {
        const self = this;

        let dbRef = firebase.database().ref('rented/'+userID).child(rentedKey).remove();

        self.openSnackBar(movie.title + ' has been returned','');
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
