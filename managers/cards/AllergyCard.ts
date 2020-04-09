import Card from "../Card";
import { MapSchema } from "@colyseus/schema";
import Player from "../Player";

export default class AllergyCard extends Card {
    constructor(){
        super(11, true);
        this.name = "Csak allergia";
    }

    use(players: Array<Player>){
        players.forEach(function(player){
            if(player.location.id == 1 && player.canGetSick()){
                player.health -= 10;
            }
        })
    }
}