import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Sort } from '@angular/material';

import * as firebase from 'firebase';

import { UserService } from '../authShared/user.service';
import { HistoryService } from '../authShared/history.service';
import { Movie } from '../authShared/movie';
import { RentedMovie } from '../authShared/rentedMovie';

@Component({
    templateUrl: './history.component.html', 
    styleUrls: ['./history.component.css']
})

export class HistoryComponent {
    authUser: any;
    displayName: string;
    displayedColumnKeys = ['title', 'rentedDate', 'returnDate'];
    displayedColumns = [
        {
            id: 'title',
            display: 'Title'
        },
        {
            id: 'rentedDate',
            display: 'Rented Date'
        },
        {
            id: 'returnDate',
            display: 'Return Date'
        }
    ];
    dataSource: MatTableDataSource<RentedMovie>;
    movieIDs: any[];
    historyMovies: RentedMovie[];

    constructor(private userSVC: UserService, public historySVC: HistoryService)
    { 
        this.authUser = this.userSVC.authUser;
        this.historyMovies = new Array<RentedMovie>();
    }

    ngOnInit() {
        this.getHistoryMovieIDs();
    }

    ngAfterViewInit() {
        if(this.dataSource != undefined)
        {
            this.dataSource.sort = this.sort;
        }
    }
    
    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    getHistoryMovieIDs() {
        const self = this;
        let dbRef = firebase.database().ref('history/'+ this.authUser.uid);
        dbRef.once('value')
            .then((snapshot)=> {
                let tmp: string[] = snapshot.val();
                self.movieIDs = Object.keys(tmp).map(key => tmp[key]);
            })
            .then(function(){
                if(self.movieIDs.length >0)
                {
                    self.getHistoryMovies(self)
                        .then(function() {
                            self.dataSource = new MatTableDataSource<RentedMovie>(self.historyMovies);
                            self.dataSource.sort = self.sort;
                            self.dataSource.paginator = self.paginator;
                        });
                }
            })
            .catch(function(error){
                console.log(error.message);
            });
    }

    getHistoryMovies(self) {
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
                        let rentedMovie: RentedMovie = {
                            title: title,
                            rentedDate: self.movieIDs[i].rentedDate,
                            returnDate: self.movieIDs[i].returnDate
                        };
                        self.historyMovies.push(rentedMovie);
                        
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
