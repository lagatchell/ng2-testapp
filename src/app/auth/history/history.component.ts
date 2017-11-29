import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Sort } from '@angular/material';

import * as firebase from 'firebase';

import { UserService } from '../authShared/user.service';
import { HistoryService } from '../authShared/history.service';
import { MovieService } from '../authShared/movie.service';
import { Movie } from '../authShared/movie';
import { RentedMovie } from '../authShared/rentedMovie';
import { Observable } from 'rxjs';

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
            display: 'Returned Date'
        }
    ];
    dataSource: MatTableDataSource<RentedMovie>;
    movieIDs: any[];
    historyMovies: RentedMovie[];

    constructor(
        private userSVC: UserService, 
        public historySVC: HistoryService, 
        public movieSVC: MovieService
    ) {
        this.authUser = this.userSVC.authUser;
        this.historyMovies = new Array<RentedMovie>();
        this.movieIDs = new Array<any>();
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
        let sub = this.historySVC.getHistoryMovieIDs().subscribe(movieIDs => {
            if(movieIDs !== null) {
                self.movieIDs = movieIDs;
                self.getHistoryMovies(self)
                    .then(function(){
                        self.dataSource = new MatTableDataSource<RentedMovie>(self.historyMovies);
                        self.dataSource.sort = self.sort;
                        self.dataSource.paginator = self.paginator;
                        sub.unsubscribe();
                    });
            }
        });
    }

    getHistoryMovies(self) {
        return new Promise(function(resolve, reject) {
            for(let i=0, len=self.movieIDs.length; i<len; i++)
            {              
                let sub = self.movieSVC.getMovieById(self.movieIDs[i].movieId).subscribe(historyMovie => {

                    let rentedMovie: RentedMovie = {
                        title: historyMovie.title,
                        rentedDate: self.movieIDs[i].rentedDate,
                        returnDate: self.movieIDs[i].returnDate
                    };
                    self.historyMovies.push(rentedMovie);
                    sub.unsubscribe();
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
