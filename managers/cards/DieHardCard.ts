import Card from "../Card";
import { MapSchema } from "@colyseus/schema";
import Player from "../Player";

export default class DieHardCard extends Card {
    constructor(){
        super(10, true);
        this.name = "Légy jó mindhalálig";
    }

    use(players: Array<Player>){
        players.forEach(function(player){
            if(player.character.kispeti){
                player.health -= 10;
            }
        })
    }
}