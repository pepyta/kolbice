import Card from "../Card";
import { MapSchema } from "@colyseus/schema";
import Player from "../Player";

export default class FactoryCard extends Card {
    constructor(){
        super(9, true);
        this.selfUseCard = true;
        this.name = "Vár a gyár";
    }

    use(players: Array<Player>, target: Player){
        target.leftout++;
        target.money += 20;
    }
}