import CharacterCard from '../Character';

export default class MarcellCharacter extends CharacterCard {
    constructor(){
        super(1);
        this.marcell = true;
        this.leftout = 2;
        this.perRoundHP = 5;
    }
}