import Card from "../Card";
import Player from "../Player";
import { MapSchema } from "@colyseus/schema";

export default class HepatitisCard extends Card {
    constructor(){
        super(5, true);
        this.name = "Hepatitis járvány";
    }

    use(players: Array<Player>){
        players.forEach(function(player){
            if(player.location.villageHouse && player.canGetSick()){
                player.health -= 20;
            }
        })
    }
}