import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { Movie } from './movie';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class MovieService {

    constructor(
        public snackBar: MatSnackBar
    ){}

    createMovie(movie: Movie) {
        const self = this;
        let storageRef = firebase.storage().ref();
        storageRef.child(`images/${movie.imgTitle}`).putString(movie.imgURL, 'data_url')
            .then((snapshot) => {
                let url = snapshot.metadata.downloadURLs[0];
                let dbRef = firebase.database().ref('movies/');
                let newMovie = dbRef.push();
                newMovie.set ({
                    title: movie.title,
                    shortDescription: movie.shortDescription,
                    imgTitle: movie.imgTitle,
                    imgURL: url,
                    id: newMovie.key
                });

                self.openSnackBar(movie.title + ' has been created','');
            })
            .catch ((error)=>{
                this.openSnackBar(error.message, '');
            });
    }

    editMovie(update: Movie) {
        let dbRef = firebase.database().ref('movies/').child(update.id)
            .update({
                title: update.title,
                shortDescription: update.shortDescription,
                duration: update.duration
            });
        this.openSnackBar(update.title + ' has been updated', '');
    }

    removeMovie(deleteMovie: Movie){
        const self = this;
        let movieTitle = deleteMovie.title;
        let dbRef = firebase.database().ref('blogPosts/').child(deleteMovie.id).remove();
        let imageRef = firebase.storage().ref().child(`images/${deleteMovie.imgTitle}`)
            .delete()
                .then(function() {
                    alert(`${deleteMovie.imgTitle} was deleted from Storage`);
                }).catch(function(error) {
                    alert(`Error - Unable to delete ${deleteMovie.imgTitle}`);
                });

        self.openSnackBar(movieTitle + ' has been deleted','');
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
