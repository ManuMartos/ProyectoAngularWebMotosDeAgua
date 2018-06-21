export class Pilot {

    constructor(
        public name:string,
        public description:string,
        public year:number,
        public image:string,
        public team:string  // este campo es el que hace referencia al equipo que pertenece el piloto
    ){}
}