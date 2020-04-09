import Location from "../Location";

export default class Grillo extends Location {
    constructor(){
        super(3);
        this.onJoinHealth = 10;
        this.onJoinMoney = -5;
    }
}