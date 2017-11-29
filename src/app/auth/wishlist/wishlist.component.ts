import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { 
    MatPaginator, 
    MatTableDataSource, 
    MatSort, 
    MatDialog, 
    MatDialogRef, 
    MAT_DIALOG_DATA, 
    Sort 
} from '@angular/material';

import * as firebase from 'firebase';

import { UserService } from '../authShared/user.service';
import { WishListService } from '../authShared/wishlist.service';
import { RentService } from '../authShared/rent.service';
import { MovieService } from '../authShared/movie.service';
import { Movie } from '../authShared/movie';
import { Observable } from 'rxjs';

@Component({
    templateUrl: './wishlist.component.html', 
    styleUrls: ['./wishlist.component.css']
})

export class WishListComponent {

    authUser: any;
    displayedColumnKeys = ['title'];
    displayedColumns = [
        {
            id: 'title',
            display: 'Title'
        }
    ];
    dataSource: MatTableDataSource<any>;
    movieIDs: any[];
    wishlistMovies: any[];

    constructor(
        private userSVC: UserService, 
        public wishlistSVC: WishListService, 
        public dialog: MatDialog, 
        public movieSVC: MovieService)
    { 
        this.authUser = this.userSVC.authUser;
        this.wishlistMovies = new Array<any>();
        this.movieIDs = new Array<any>();
    }

    ngOnInit() {
        this.getWishlistMovieIDs();
    }

    ngAfterViewInit() {
        if(this.dataSource != undefined)
        {
            this.dataSource.sort = this.sort;
        }
    }
    
    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    getWishlistMovieIDs() {
        const self = this;
        let sub = this.wishlistSVC.getWishlistMovieIDs().subscribe(wishlistMovieIDs => {
            if (wishlistMovieIDs !== null) {
                self.movieIDs = wishlistMovieIDs;
                self.getWishlist(self)
                    .then(function() {
                        self.dataSource = new MatTableDataSource<any>(self.wishlistMovies);
                        self.dataSource.sort = self.sort;
                        self.dataSource.paginator = self.paginator;
                        sub.unsubscribe();
                    });
            }
        });
    }

    getWishlist(self) {
        return new Promise(function(resolve, reject) {
            for(let i=0, len=self.movieIDs.length; i<len; i++)
            {       
                let sub = self.movieSVC.getMovieById(self.movieIDs[i].movieId).subscribe(movie => {
                    let wishlistMovie: any = {
                        title: movie.title,
                        movieId: movie.id,
                        id: self.movieIDs[i].id
                    };
                    self.wishlistMovies.push(wishlistMovie);
                    sub.unsubscribe();
                    if(i == (self.movieIDs.length -1))
                    {
                        resolve();
                    }
                })
            }
        });
    }

    edit(row) {
        const self = this;
        let dialogRef = this.dialog.open(EditDialog, {
            height: '150px',
            width: '350px',
            data: { 
                title: row.title,
                movieId: row.movieId,
                id: row.id,
                remove: function(){
                    for(var i=0, len=self.dataSource.data.length; i<len; i++)
                    {
                        if(self.dataSource.data[i].id === row.id)
                        {
                            self.dataSource.data.splice(i, 1);
                            let newDataSource = self.dataSource.data;
                            self.dataSource = new MatTableDataSource<any>(newDataSource);
                        }
                    }
                }
            }
        });
    }

    applyFilter(filterValue: string)
    {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
}

@Component({
    selector: 'edit-dialog',
    template: `
        <h1 mat-dialog-title>{{data.title}}</h1>
        <div mat-dialog-content>
        </div>
        <div mat-dialog-actions>
            <button type="button" mat-raised-button (click)="onNoClick()" tabindex="-1">Close</button>
            <button type="button" mat-raised-button color="accent" (click)="rent(data)" tabindex="-1">Rent</button>
            <button type="button" mat-raised-button color="primary" (click)="remove(data)" tabindex="-1">Remove</button>
        </div>
    `,
  })


  export class EditDialog {
  user: any;

    constructor(
        public dialogRef: MatDialogRef<EditDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public userSVC: UserService,
        public wishlistSVC: WishListService,
        public rentSVC: RentService
    ) { }

    ngOnInit(){
        this.user = this.userSVC.authUser;
    }

    remove(data) {
        this.wishlistSVC.removeMovie(this.user.uid, data.id, data.title);
        this.onNoClick();
        data.remove();
    }

    rent(data) {
        this.rentSVC.rentMovie(this.user.uid, 
        {
            title: data.title,
            id: data.movieId
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
  
  }
