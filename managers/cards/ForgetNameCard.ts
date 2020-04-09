import Card from '../Card';
import Player from '../Player';
import { MapSchema } from '@colyseus/schema';

export default class ForgetNameCard extends Card {
    constructor(){
        super(1, true);
        this.targetPlayerNumber = 2;
        this.name = "Mindig összekeverem a neveket";
    }

    use(players: Array<Player>, first: Player, second: Player){
        var tmp = first.character;
        first.character = second.character;
        second.character = tmp;
    }
}