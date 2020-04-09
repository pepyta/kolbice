import Location from "../Location";

export default class School extends Location {
    constructor(){
        super(4);
        this.onJoinHealth = -5;
        this.onJoinMarciHealth = -15;
    }
}