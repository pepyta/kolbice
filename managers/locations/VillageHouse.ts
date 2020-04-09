import Location from "../Location";

export default class VillageHouse extends Location {
    constructor(){
        super(1);
        this.villageHouse = true;
    }
}