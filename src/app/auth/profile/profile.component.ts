import { Component, ViewChild } from '@angular/core';
import { UserService } from '../authShared/user.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Sort } from '@angular/material';

import { User } from '../authShared/user';

@Component({
    templateUrl: './profile.component.html', 
    styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
    authUser: any;
    displayName: string;
    displayedColumnKeys = ['uid', 'name', 'email'];
    displayedColumns = [
        {
            id: 'uid',
            display: 'User ID'
        }, 
        {
            id: 'name',
            display: 'Name'
        }, 
        {
            id: 'email',
            display: 'Email'
        }
    ];
    dataSource: MatTableDataSource<sortableUser>;
    sortedData: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    constructor(private userSVC: UserService)
    {
        this.authUser = userSVC.authUser;
        this.dataSource = new MatTableDataSource<sortableUser>(
            [
                { 
                    uid: userSVC.authUser.uid,
                    name: userSVC.authUser.displayName,
                    email: userSVC.authUser.email
                }
            ]
        );
        this.sortedData = this.dataSource.data.slice();
    }

    applyFilter(filterValue: string)
    {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    sortData(sort: Sort) {
        const data = this.dataSource.data.slice();
        const self = this;

        if (!sort.active || sort.direction == '') {
            this.sortedData = data;
            return;
          }
      
          this.sortedData = data.sort((a, b) => {
            let isAsc = sort.direction == 'asc';
            switch (sort.active) {
              case 'uid': return self.compare(a.uid, b.uid, isAsc);
              case 'name': return self.compare(+a.name, +b.name, isAsc);
              case 'email': return self.compare(+a.email, +b.email, isAsc);
              default: return 0;
            }
          });
    }

    compare(a, b, isAsc)
    {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    updateUser(){
        //this.userSVC.updateUser();
    }
}

export interface sortableUser {
    uid: any;
    name: string;
    email: string;
}