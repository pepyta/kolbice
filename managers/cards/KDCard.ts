import Card from '../Card';
import Player from '../Player';
import { MapSchema } from '@colyseus/schema';

export default class KDCard extends Card {
    constructor(){
        super(3, true);
        this.name = "Kovács Dávid féle edzőterv";
    }

    use(players: Array<Player>){
        players.forEach(function(player){
            if(player.character.marcell || player.character.kispeti){
                player.leftout++;
            }
        })
    }
}