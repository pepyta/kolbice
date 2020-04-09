import CharacterCard from "../Character";

export default class Peter extends CharacterCard {
    constructor(){
        super(3);
        this.peter = true;
        this.canEnterVillageHouse = true;
    }
}