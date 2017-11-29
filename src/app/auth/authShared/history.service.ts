import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import {MatSnackBar} from '@angular/material';

import { RentedMovie } from './rentedMovie';
import { UserService } from './user.service';
import { MovieService } from './movie.service';
import { Movie } from './movie';
import { Observable } from 'rxjs';

@Injectable()
export class HistoryService {

    constructor(
        public snackBar: MatSnackBar,
        public movieSVC: MovieService,
        public userSVC: UserService
    ) {}

    getHistoryMovieIDs() {
        const self = this;
        return Observable.fromPromise(firebase.database().ref('history/'+ self.userSVC.authUser.uid).once('value')
            .then((snapshot)=> {
                if(snapshot.val() !== null) {
                    let tmp: string[] = snapshot.val();
                    return Object.keys(tmp).map(key => tmp[key]);
                }
                else {
                    return null;
                }
            }));
    }

    addMovie(userID, movie, rentedMovieID) {
        const self = this;

        let rentedDate = this.getCurrentDate();
        
        let dbRef = firebase.database().ref('history/'+ userID);
        let rentedMovie = dbRef.push();
        rentedMovie.set ({
            movieId: movie.id,
            rentedDate: rentedDate,
            returnDate: "",
            id: rentedMovieID
        });

        self.openSnackBar(movie.title + ' been added to your history','');
    }

    updateMovieHistory(userID, rentedMovieID) {
        
    }

    // Not sure if this should be implemented
    /* removeMovie(userID, movieID) {
        const self = this;

        let dbRef = firebase.database().ref('history/'+userID).child(movieID).remove();

        self.openSnackBar('Movie has been removed from history','');
    } */

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    getCurrentDate(): string
    {
        let today = new Date();
        let dd = (today.getDate()).toString();
        let mm = (today.getMonth()+1).toString(); //January is 0!
        let yyyy = today.getFullYear();
        
        if(parseInt(dd,10)<10) {
            dd = '0'+dd;
        }
        
        if(parseInt(mm, 10)<10) {
            mm = '0'+mm;
        } 
        
        return mm + '/' + dd + '/' + yyyy;
    }
}