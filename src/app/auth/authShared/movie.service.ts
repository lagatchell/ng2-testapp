import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { Movie } from './movie';
import {MatSnackBar} from '@angular/material';
import { Observable } from 'rxjs';

@Injectable()
export class MovieService {

    constructor(
        public snackBar: MatSnackBar
    ){}

    getMovies() {
        return Observable.fromPromise(firebase.database().ref('movies/').once('value').then((snapshot) => { 
            let tmp: string[] = snapshot.val();
            return Object.keys(tmp).map(key => tmp[key])
        }));
    }

    getMovieById(movieID) {
        return Observable.fromPromise(firebase.database().ref('movies/' + movieID).once('value')
            .then((snapshot)=> {
                let tmp = snapshot.val();
                let transform = Object.keys(tmp).map(key => tmp[key]);
                let title = transform[5];
                let desc = transform[4];
                let duration = transform[0];
                let imgTitle = transform[2];
                let img = transform[3];
                let id = transform[1];
                let rentedMovie = new Movie (title, desc, duration, imgTitle, img, id);
                return rentedMovie;         
            }));
    }

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
                    duration: movie.duration,
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
