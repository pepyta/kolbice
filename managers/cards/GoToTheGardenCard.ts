import Card from "../Card";
import { MapSchema } from "@colyseus/schema";
import Player from "../Player";

export default class GoToTheGarden extends Card {
    constructor(){
        super(15, true);
        this.targetPlayerNumber = 1;
        this.name = "Megyek a szomszéd kertjébe gagilni";
    }

    use(players: Array<Player>, target: Player){
        target.leftout++;
    }
}