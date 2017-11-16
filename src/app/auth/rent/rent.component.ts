import { Component, OnInit, Inject, Renderer } from '@angular/core';
import * as firebase from 'firebase';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Movie } from '../authShared/movie';
import { UserService } from '../authShared/user.service';
import { RentService } from '../authShared/rent.service';

@Component({
    templateUrl: './rent.component.html', 
    styleUrls: ['./rent.component.css']
})

export class RentComponent {
    movieIDs: any[];
    movies: Movie[];
    user: any;
    rentedMovieKey: any;
    noMovies: boolean = true;

    constructor(
        public userSVC: UserService,
        public rentSVC: RentService,
        public dialog: MatDialog
    ){
        this.movies = new Array<Movie>();
        this.rentedMovieKey = {};
    }

    ngOnInit(){
        this.user = this.userSVC.authUser;
        this.getRentedMovieIDs();
    }

    getRentedMovieIDs() {
        const self = this;
        let dbRef = firebase.database().ref('rented/'+ this.user.uid);
        dbRef.once('value')
            .then((snapshot)=> {
                let tmp: string[] = snapshot.val();
                self.movieIDs = Object.keys(tmp).map(key => tmp[key]);
            })
            .then(function(){
                if(self.movieIDs.length >0)
                {
                    self.getRentedMovies(self);
                }
            })
            .catch(function(){
                self.noMovies = false;
            });
    }

    getRentedMovies(self) {
        for(let i=0, len=self.movieIDs.length; i<len; i++)
        {
            let dbRef = firebase.database().ref('movies/' + self.movieIDs[i].movieId);
            dbRef.once('value')
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
                    self.movies.push(rentedMovie);
                    self.rentedMovieKey[id] = self.movieIDs[i].id;
                });
        }
    }

    info(movie: Movie): void {
        let dialogRef = this.dialog.open(rentInfoDialog, {
            height: '400px',
            width: '600px',
            data: { 
                title: movie.title, 
                description: movie.shortDescription,
                duration: movie.duration
            }
        });
    }

    return(movie: Movie) {
        let rentedKey = this.rentedMovieKey[movie.id];
        this.rentSVC.returnMovie(this.user.uid, rentedKey, movie);
        this.movies = [];
        this.movieIDs = [];
        this.rentedMovieKey = {};
        this.noMovies = true;
        this.ngOnInit();
    }
    
}

@Component({
    selector: 'rent-info-dialog',
    template: `
        <h1 mat-dialog-title>{{data.title}}</h1>
        <div mat-dialog-content>
            <label>Duration: {{data.duration}} minutes</label>
            <br />
            <label>Description:</label>
            <br />
            <p>
                {{data.description}}
            </p>
        </div>
        <div mat-dialog-actions>
            <button mat-raised-button (click)="onNoClick()" tabindex="-1">Close</button>
        </div>
    `,
  })
  export class rentInfoDialog {
  
    constructor(
        public dialogRef: MatDialogRef<rentInfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
  
  }