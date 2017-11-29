import { Component, OnInit, Inject } from '@angular/core';
import * as firebase from 'firebase';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MovieService } from '../../authShared/movie.service';
import { UserService } from '../../authShared/user.service';
import { RentService } from '../../authShared/rent.service';
import { WishListService } from '../../authShared/wishlist.service';
import { Movie } from '../../authShared/movie';

import { Observable } from 'rxjs';

@Component({
    templateUrl: './movieList.component.html', 
    styleUrls: ['./movieList.component.css']
})

export class MovieListComponent {
    
    movies: Movie[];
    user: any;
    loading: boolean = true;

    constructor(
        public movieSVC: MovieService,
        public userSVC: UserService,
        public dialog: MatDialog
    ){
        this.movies = new Array<Movie>();
    }

    ngOnInit(){
        this.user = this.userSVC.authUser;
        this.getMovies();
    }

    getMovies() {
        const self = this;
        let sub = this.movieSVC.getMovies().subscribe(movies => {
            self.movies = movies;
            self.loading = false;
            sub.unsubscribe();
        });
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
            <button mat-raised-button color="primary" (click)="rent(data)" tabindex="-1" >Rent</button>
            <button mat-raised-button color="accent" (click)="addToFavorites(data);" tabindex="-1">Add to Wishlist</button>
        </div>
    `,
  })


  export class InfoDialog {
  user: any;

    constructor(
        public dialogRef: MatDialogRef<InfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public wishlistSVC: WishListService,
        public rentSVC: RentService,
        public userSVC: UserService,
    ) { }

    ngOnInit(){
        this.user = this.userSVC.authUser;
    }

    rent(movie) {
        this.userSVC.verifyLogin();
        if(this.userSVC.loggedInUser)
        {
            this.rentSVC.rentMovie(this.user.uid, movie);
        } 
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addToFavorites(movie) {
        this.wishlistSVC.addMovie(this.user.uid, movie);
    }
  
  }