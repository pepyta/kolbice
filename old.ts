import { Room, Server, Delayed } from "colyseus";
import { Schema, MapSchema, type } from "@colyseus/schema";
import { createServer } from "http";
import express from "express";

const port = 3000;

class Card extends Schema {
	@type("number") id: number;
	@type("boolean") useable: boolean;
	@type("number") cardId: number;

	constructor(id: number, card: number) {
		super();

		// Cards that are just sitting in your inventory
		var unusables = [2, 18, 19, 20];

		this.id = id;
		this.cardId = card;
		this.useable = !unusables.includes(card);
	}
}

class AnnaCard extends Card {
	constructor(id){
		super(id, 4);
	}

	use(players: MapSchema<Player>){
		for(let id in players){
			if(players[id].character == 5){
				players[id].leftout++;
			}
		}
	}
}

class HepatitsCard extends Card {
	constructor(id){
		super(id, 5);
	}

	use(players: MapSchema<Player>){
		for(let id in players){
			players[id].health -= players[id].position == 1 ? 20 : 0;
		}
	}
}

class NameDayCard extends Card {
	constructor(id){
		super(id, 6);
	}
}

class Player extends Schema {
	@type("number") character: number;
	@type("string") username: string;
	@type("boolean") roomLeader: boolean;
	@type("number") leftout: number;
	@type("number") position: number;
	@type("number") health: number;
	@type({ map: Card }) cards = new MapSchema();

	setCharacter(characterId: number) {
		this.character = characterId;
		this.health = characterId == 5 ? 150: 100;
	}

	@type("boolean") canGetSick() {
		if (this.character == 3) return false;

		for (let id in this.cards) {
			if (this.cards[id].cardId == 18) {
				return false;
			}
		}

		return true;
	}

	@type("boolean") isCartellMember() {
		if ([2, 4].includes(this.character)) return true;

		for (let id in this.cards) {
			if (this.cards[id].cardId == 20) {
				return true;
			}
		}

		return false;
	}
}

class State extends Schema {
	@type("number") currentTurn: number;
	@type({ map: Player }) players = new MapSchema<Player>();
	@type({ map: Card }) deck = new MapSchema<Card>();
}

class GameRoom extends Room {
	autoStartTimeout: Delayed;

	onCreate() {
		this.setState(new State());
		this.autoStartTimeout = this.clock.setTimeout(() => this.start(), 10 * 1000);
	}

	onJoin(client) {
		this.state.players[client.sessionId] = new Player();
	}

	onLeave(client) {
		delete this.state.players[client.sessionId];
	}

	start() {
		let numberOfPlayers = 0;

		for (let id in this.state.players) {
			numberOfPlayers++;
		}

		var characters = [
			1,
			3,
			4,
			5
		];

		if (numberOfPlayers >= 4) {
			// Enable Bociszem
			characters.push(2);
		}

		for (let id in this.state.players) {
			let characterId = Math.floor(Math.random() * characters.length);
			this.state.players[id].setCharacter(characters[characterId]);
			characters.splice(characterId, 1);
		}

		var cards = [
			{
				cardId: 1,
				number: 2
			},
			{
				cardId: 2,
				number: numberOfPlayers + 1
			},
			{
				cardId: 3,
				number: 1
			}
		]

		if (numberOfPlayers >= 5) {
			cards.push({
				cardId: 20,
				number: 1
			})
		}

		var cardsGenerator = []
		cards.forEach(function (elem) {
			for (let i = 0; i < elem.number; i++) {
				cardsGenerator.push(elem.cardId);
			}
		})

		function shuffle(array) {
			var currentIndex = array.length, temporaryValue, randomIndex;
			while (0 !== currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
			return array;
		}
		shuffle(cardsGenerator);
		
		for(let i = 0; i < cardsGenerator.length; i++){
			this.state.deck[i] = cardsGenerator[i];
		}

		for(let id in this.state.players){
			for(var i = 0; i < 4; i++){
			}
		}
	}



	onMessage(client, data) {
		if (!this.state.players[client.sessionId]) return;
	}
}

const app = express();
app.use(express.json());

const gameServer = new Server({
	server: createServer(app),
});

gameServer.define("room", GameRoom)

gameServer.listen(port);