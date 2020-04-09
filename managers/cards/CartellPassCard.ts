import Card from "../Card";
import { MapSchema } from "@colyseus/schema";
import Player from "../Player";

export default class CartellPassCard extends Card {
    constructor(){
        super(20, false);
        this.cartellPass = true;
        this.name = "Kartell tagság";
    }

    use(){}
}