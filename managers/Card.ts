import { Schema, MapSchema, type, filter } from "@colyseus/schema";
import Player from "./Player";
import { Client } from "colyseus";

export default abstract class Card extends Schema {
	@type("number") cardId: number;
    @type("boolean") useable: boolean;
    @type("string") name: string;
    @type("boolean") kolbiceCard: boolean = false;
    @type("boolean") cartellPass: boolean = false;
    @type("boolean") noziCard: boolean = false;
    @type("boolean") selfUseCard: boolean = false;
    @type("number") targetPlayerNumber: number = 0;

    constructor(cardId, useable){
        super();
        this.cardId = cardId;
        this.useable = useable;
    }

    abstract use(players: Array<Player>, firstPlayer?: Player, secondPlayer?: Player);
}