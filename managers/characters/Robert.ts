import CharacterCard from "../Character";

export default class Robert extends CharacterCard {
    constructor(){
        super(5);
        this.robert = true;
        this.startHP = 150;
        this.leftout = 1;
    }
}