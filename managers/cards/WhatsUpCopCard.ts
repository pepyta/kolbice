import Card from "../Card";
import { MapSchema } from "@colyseus/schema";
import Player from "../Player";

export default class WhatsUpCopCard extends Card {
    constructor(){
        super(14, true);
        this.name = "Mi van fakabát?";
    }

    use(players: Array<Player>){
        players.forEach(function(player){
            if(player.isCartellMember()){
                player.money -= 15;
                player.health -= 20;
            }
        })
    }
}