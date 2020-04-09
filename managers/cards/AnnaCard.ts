import Card from "../Card";
import Player from "../Player";
import { MapSchema } from "@colyseus/schema";

export default class AnnaCard extends Card {
    constructor(){
        super(4, true);
        this.name = "Anna hisztizik";
    }

    use(players: Array<Player>){
        players.forEach(function(player){
            if(player.character.robert){
                player.leftout++;
            }
        })
    }
}