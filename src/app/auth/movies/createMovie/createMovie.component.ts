import { Component } from '@angular/core';

import { MovieService } from '../../authShared/movie.service';
import { Movie } from '../../authShared/movie';

@Component({
    templateUrl: './createMovie.component.html', 
    styleUrls: ['./createMovie.component.css']
})

export class CreateMovieComponent {

    movieTitle: string;
    movieDescription: string;
    movieDuration: number;
    movieImgTitle: string;
    movieImg: any;
    invalidUpload: boolean;

    constructor(
        public movieSVC: MovieService
    ){}

    fileLoad($event: any) {
        let myReader:FileReader = new FileReader();
        let file:File = $event.target.files[0];
        let fileType = file.name.split('.')[1];

        if(fileType.toLowerCase() == "png" || fileType.toLowerCase() == "jpg")
        {
            this.invalidUpload = false;
            this.movieImgTitle = file.name; 
            myReader.readAsDataURL(file);

            myReader.onload = (e: any) => {
                console.log(e.target);
                this.movieImg = e.target.result;
            }
        }
        else {
            this.invalidUpload = true;
            $event.target.value = "";
        }
    }

    create() {
        let newMovie: Movie = new Movie(
            this.movieTitle, 
            this.movieDescription, 
            this.movieDuration, 
            this.movieTitle, 
            this.movieImg
        );

        try {
            this.movieSVC.createMovie(newMovie);
        } catch(e)
        {
            console.log(e.message);
        }
        
    }

}