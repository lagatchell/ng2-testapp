import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import {MatSnackBar} from '@angular/material';
import { HistoryService } from './history.service';

@Injectable()
export class RentService {

    constructor(
        public snackBar: MatSnackBar,
        public historySVC: HistoryService
    ){}

    rentMovie(userID, movie) {
        const self = this;
        let uniqueId = firebase.database().ref().child('rented/'+ userID).push().key;

        let rentMovieData = {
            movieId: movie.id,
            id: uniqueId
        };

        let historyMovieData = {
            movieId: movie.id,
            rentedDate: self.getCurrentDate(),
            returnDate: "",
            id: uniqueId
        }

        let newRecord = {};

        newRecord['/rented/'+ userID +'/'+ uniqueId] = rentMovieData;
        newRecord['/history/'+ userID + '/' + uniqueId] = historyMovieData;

        firebase.database().ref().update(newRecord);

        self.openSnackBar(movie.title + ' has been added to your rentals','');
    }

    returnMovie(userID, rentedKey, movie) {
        const self = this;

        let dbRef = firebase.database().ref('rented/'+userID).child(rentedKey).remove();

        let dbRef2 = firebase.database().ref('history/'+userID).child(rentedKey)
        .update({
            returnDate: self.getCurrentDate()
        });

        self.openSnackBar(movie.title + ' has been returned','');
    }

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
