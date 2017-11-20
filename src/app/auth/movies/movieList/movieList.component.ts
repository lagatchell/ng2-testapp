import { Component, OnInit, Inject } from '@angular/core';
import * as firebase from 'firebase';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MovieService } from '../../authShared/movie.service';
import { UserService } from '../../authShared/user.service';
import { RentService } from '../../authShared/rent.service';
import { WishListService } from '../../authShared/wishlist.service';
import { Movie } from '../../authShared/movie'; 

@Component({
    templateUrl: './movieList.component.html', 
    styleUrls: ['./movieList.component.css']
})

export class MovieListComponent {
    
    movies: Movie[];
    user: any;

    constructor(
        public movieSVC: MovieService,
        public userSVC: UserService,
        public rentSVC: RentService,
        public dialog: MatDialog
    ){}

    ngOnInit(){
        this.user = this.userSVC.authUser;
        this.getMovies();
    }

    getMovies() {
        let dbRef = firebase.database().ref('movies/');
        dbRef.once('value')
            .then((snapshot)=> {
                let tmp: string[] = snapshot.val();
                this.movies = Object.keys(tmp).map(key => tmp[key])
            });
    }

    rent(movie) {
        this.userSVC.verifyLogin();
        if(this.userSVC.loggedInUser)
        {
            this.rentSVC.rentMovie(this.user.uid, movie);
        } 
    }

    info(movie: Movie): void {
        let dialogRef = this.dialog.open(InfoDialog, {
            height: '400px',
            width: '600px',
            data: { 
                title: movie.title, 
                description: movie.shortDescription,
                duration: movie.duration,
                id: movie.id
            }
        });
    }
}

@Component({
    selector: 'info-dialog',
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
            <button mat-raised-button color="accent" (click)="addToFavorites(data);" tabindex="-1">Add to Favorites</button>
        </div>
    `,
  })


  export class InfoDialog {
  user: any;

    constructor(
        public dialogRef: MatDialogRef<InfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public wishlistSVC: WishListService,
        public userSVC: UserService,
    ) { }

    ngOnInit(){
        this.user = this.userSVC.authUser;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addToFavorites(movie) {
        this.wishlistSVC.addMovie(this.user.uid, movie);
    }
  
  }