import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import {MatSnackBar} from '@angular/material';

@Injectable()
export class HistoryService {

    history: any[];

    constructor(
        public snackBar: MatSnackBar
    ){}

    addMovie(userID, movieID) {
        const self = this;
        
        let dbRef = firebase.database().ref('history/'+ userID);
        let rentedMovie = dbRef.push();
        rentedMovie.set ({
            movieId: movieID
        });
    }

    removeMovie(userID, movieID) {
        const self = this;

        let dbRef = firebase.database().ref('history/'+userID).child(movieID).remove();

        self.openSnackBar('Movie has been removed from history','');
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    getHistory(userID) {
        let dbRef = firebase.database().ref('history/' + userID);
        dbRef.once('value')
            .then((snapshot)=> {
                let tmp: string[] = snapshot.val();
                this.history = Object.keys(tmp).map(key => tmp[key])
            });
    }
}