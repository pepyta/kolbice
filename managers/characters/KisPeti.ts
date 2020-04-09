import CharacterCard from "../Character";

export default class KisPeti extends CharacterCard {
    constructor(){
        super(2);
        this.kispeti = true;
        this.cartell = true;
    }
}