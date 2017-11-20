import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Sort } from '@angular/material';

import * as firebase from 'firebase';

import { UserService } from '../authShared/user.service';
import { WishListService } from '../authShared/wishlist.service';
import { Movie } from '../authShared/movie';

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

    constructor(private userSVC: UserService, public wishlistSVC: WishListService)
    { 
        this.authUser = this.userSVC.authUser;
        this.wishlistMovies = new Array<any>();
    }

    ngOnInit() {
        //get data
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
        let dbRef = firebase.database().ref('wishlist/'+ this.authUser.uid);
        dbRef.once('value')
            .then((snapshot)=> {
                let tmp: string[] = snapshot.val();
                self.movieIDs = Object.keys(tmp).map(key => tmp[key]);
            })
            .then(function(){
                if(self.movieIDs.length >0)
                {
                    self.getWishlist(self)
                        .then(function() {
                            self.dataSource = new MatTableDataSource<any>(self.wishlistMovies);
                            self.dataSource.sort = self.sort;
                            self.dataSource.paginator = self.paginator;
                        });
                }
            })
            .catch(function(error){
                console.log(error.message);
            });
    }

    getWishlist(self) {
        return new Promise(function(resolve, reject) {
            let index;

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
                        let wishlistMovie: any = {
                            title: title
                        };
                        self.wishlistMovies.push(wishlistMovie);
                        
                        if(i == (self.movieIDs.length -1))
                        {
                            resolve();
                        }
                        
                    });
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