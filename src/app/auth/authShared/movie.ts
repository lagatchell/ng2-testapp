export class Movie {
    constructor(
        public title: string,
        public shortDescription: string,
        public duration: string,
        public imgTitle?: string,
        public imgURL?: any,
        public id?: string
    ){}
}