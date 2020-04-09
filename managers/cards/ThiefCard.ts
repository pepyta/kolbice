import Card from "../Card";
import { MapSchema } from "@colyseus/schema";
import Player from "../Player";

export default class ThiefCard extends Card {
    constructor(){
        super(13, true);
        this.selfUseCard = true;
        this.targetPlayerNumber = 1;
        this.name = "Csapd ki a kolbászod";
    }

    use(players: Array<Player>, me: Player, target: Player){
        var found = false;
        target.cards.forEach(function(elem, index){
            if(found) return; // Csak egyet lehessen elvenni
            if(elem.kolbiceCard){
                found = true;
                me.cards.push(elem);
                target.cards.splice(index, 1);
                return;
            }
        })
    }
}