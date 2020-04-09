import Card from "../Card";
import { MapSchema } from "@colyseus/schema";
import Player from "../Player";
import VillageHouse from "../locations/VillageHouse";

export default class NameDayCard extends Card {
    constructor(){
        super(6, true);
        this.name = "Névnap";
    }

    use(players: Array<Player>){
        players.forEach(function(player){
            player.location = new VillageHouse();
            if(player.character.peter){
                player.money -= 40;
            }
        });
    }
}