import { Schema, type, ArraySchema } from "@colyseus/schema";
import Player from "./Player";
import Card from "./Card";

export default class LastUsed extends Schema {
    @type(Player) player:Player;
    @type([ Player ]) targets: ArraySchema<Player>;
    @type(Card) card:Card;

    constructor(player: Player, targets: ArraySchema<Player>, card: Card){
        super();

        this.player = player;
        this.targets = targets;
        this.card = card;
    }
}