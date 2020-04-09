import Card from "../Card";
import Player from "../Player";

export default class NotYouCard extends Card {
    constructor(){
        super(16, true);
        this.name = "Peti, nem te, a másik";
    }

    use(players: Array<Player>){
        players.forEach(function(player){
            if(player.character.kispeti || player.character.peter){
                player.health -= 15;
            }
        })
    }
}