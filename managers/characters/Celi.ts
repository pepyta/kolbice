import CharacterCard from "../Character";

export default class Celi extends CharacterCard {
    constructor(){
        super(6);
        this.startHP = 80;
        this.canEnterVillageHouse = true;
        this.canGetSick = false;
        this.celi = true;
    }
}