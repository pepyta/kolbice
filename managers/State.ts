import { Schema, type, ArraySchema } from "@colyseus/schema";
import Card from "./Card";
import Player from "./Player";
import LastUsed from "./LastUsed";

export default class State extends Schema {
	@type("number") currentPlayer: number = 0;
	@type("number") currentTurn: number = 0;
	@type("boolean") showCards: boolean = false;
	@type("boolean") showPlayers: boolean = false;
	@type("boolean") showLocations: boolean = false;
	@type("number") targetPlayerNumber: number = 0;
	@type(LastUsed) lastUsed: LastUsed;
	selectedCard: Card;
	deck: Array<Card> = new Array<Card>();
	@type([ Player ]) players = new ArraySchema<Player>();
}
