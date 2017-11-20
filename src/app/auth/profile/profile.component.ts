import { Component, ViewChild, OnInit } from '@angular/core';
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
    userDisplayName: string;
    userEmail: string;
    userPassword: string;
    profilePicTitle: string;
    profilePic: any;
    invalidUpload: boolean;

    constructor(private userSVC: UserService)
    {
        this.authUser = userSVC.authUser;
        this.userDisplayName = this.authUser.displayName;
        this.userEmail = this.authUser.email;
        this.profilePic = this.authUser.photoURL;
        console.log(this.profilePic);
    }

    fileLoad($event: any) {
        let myReader:FileReader = new FileReader();
        let file:File = $event.target.files[0];
        let fileType = file.name.split('.')[1];

        if(fileType.toLowerCase() == "png" || fileType.toLowerCase() == "jpg")
        {
            this.invalidUpload = false;
            this.profilePicTitle = file.name; 
            myReader.readAsDataURL(file);

            myReader.onload = (e: any) => {
                this.profilePic = e.target.result;
            }
        }
        else {
            this.invalidUpload = true;
            $event.target.value = "";
        }
    }
    

    updateUser() {

        let updatedUser: User = {
            displayName: this.userDisplayName,
            email: this.userEmail,
            photoURL: this.profilePic,
            id: this.authUser.uid
        }

        this.userSVC.updateUser(updatedUser, this.userPassword);
    }
}
