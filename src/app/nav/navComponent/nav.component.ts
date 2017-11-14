import { Component, OnInit } from '@angular/core';
import {UserService} from '../../auth/authShared/user.service';

@Component({
    selector: 'navi-bar',
    templateUrl: './nav.component.html', 
    styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {

    currentUser: string;


    constructor(private userSVC: UserService){
        this.currentUser = userSVC.loggedInUser;
    }

    ngOnInit(){
        this.currentUser = this.userSVC.loggedInUser;
    }

    logout()
    {
        this.userSVC.logout();
    }

}