import State from './State';
import { Room, Delayed } from 'colyseus';
import Player from './Player';
import Waiting from './Waiting';
import MarcellCharacter from './characters/Marcell';
import KisPeti from './characters/KisPeti';
import Peter from './characters/Peter';
import Patrick from './characters/Patrick';
import Robert from './characters/Robert';

import DeckGenerator, { defaultCardSet } from './DeckGenerator';
import Card from './Card';
import CharacterCard from './Character';
import VillageHouse from './locations/VillageHouse';
import Theatre from './locations/Theatre';
import Grillo from './locations/Grillo';
import School from './locations/School';
import Celi from './characters/Celi';
import LastUsed from './LastUsed';
import { ArraySchema } from '@colyseus/schema';

export default class GameRoom extends Room {
    waiting: Array<Waiting> = new Array<Waiting>();
    autoStartTimeout: Delayed;

    onCreate() {
        this.setState(new State());
    }

    onJoin(client, data) {
        var numberOfPlayers = 0;
        console.log(data)
        Object.keys(this.waiting).forEach((key) => {
            numberOfPlayers++;
        })
        console.log("Join!: " + numberOfPlayers);

        this.waiting.push(new Waiting(data.username, numberOfPlayers == 0, client.sessionId));
    }

    onLeave(client) {
        this.setState(new State());
        this.start();
    }

    start() {
        console.log("Start");
        this.lock();
        var numberOfPlayers = 0;
        var state = this.state;

        this.waiting.forEach(function () {
            numberOfPlayers++;
        })

        var characters = [
            1,
            3,
            4,
            5,
            6
        ];
        console.log(numberOfPlayers)
        if (numberOfPlayers >= 4) {
            characters.push(2);
        }


        this.waiting.forEach(function (waiter) {
            var rng: number = Math.floor(Math.random() * characters.length);
            if (waiter.roomOwner) {
                for (let i = 0; i < characters.length; i++) {
                    if (characters[i] == 4) {
                        rng = i;
                    }
                }
            }

            var characterId = characters[rng];
            characters.splice(rng, 1);
            var character: CharacterCard;
            console.log(characterId)
            console.log(characters)
            if (characterId == 1) {
                character = new MarcellCharacter();
            } else if (characterId == 2) {
                character = new KisPeti();
            } else if (characterId == 3) {
                character = new Peter();
            } else if (characterId == 4) {
                character = new Patrick();
            } else if (characterId == 5) {
                character = new Robert();
            } else if (characterId == 6) {
                character = new Celi();
            }

            state.players.push(new Player(waiter.username, character, waiter.roomOwner, waiter.sessionId));
        })

        state.deck = new DeckGenerator().generate(defaultCardSet, false, state.players.length);
        console.log(state.deck);
        state.players.forEach(function (player: Player) {
            for (let i = 0; i < 4; i++) {
                player.cards.push(state.deck[0]);
                state.deck.splice(0, 1);
            }
        })

        this.gameState(0, 0);
    }

    gameState(position: number, player: number) {
        this.state.currentPlayer = player;
        this.state.currentTurn = position;

        console.log(`Player: ${player}, position: ${position}`)

        if (position == 0) {
            // Húzás
            let thisPlayer: Player = this.state.players[player];
            if (thisPlayer.leftout > 0) {
                thisPlayer.leftout--;
                this.gameState(0, player + 1 >= this.state.players.length ? 0 : player + 1);
            } else {
                this.state.players[player].cards.push(this.state.deck[0]);
                this.state.deck.splice(0, 1);
                this.gameState(1, player);
            }
        } else if (position == 1) {
            // Bemenni valahova
            this.state.showLocations = true;
        } else if (position == 2) {
            // Kijátszani valamit
            this.state.showLocations = false;
            this.state.showCards = true;
        } else if (position == 3) {
            // Választani embert
            this.state.showCards = false;
            this.state.showPlayers = true;
        }
    }

    onMessage(client, data) {
        var found = false
        this.waiting.forEach(function (elem) {
            if (elem.sessionId == client.sessionId) {
                found = true;
                return;
            }
        })

        if (!found) return;

        var thisUserId;
        var thisUser: Player;
        this.state.players.forEach(function (player: Player, index) {
            if (player.sessionId == client.sessionId) {
                thisUserId = index;
                thisUser = player;
            }
        })

        console.log(thisUser)
        if (thisUserId != this.state.currentPlayer && thisUser) return;
        console.log(data);
        if (data.action == 3) {
            // Lobby
            if (this.waiting.length > 1) {
                this.start();
            }
        } else if (data.action == 1 && this.state.currentTurn == 2) {
            // Kártya kiválasztva
            console.log(data);
            let id = data.input.cardId;
            this.state.selectedCard = thisUser.cards[id];
            if (thisUser.cards[id].useable) {
                if (thisUser.cards[id].targetPlayerNumber == 0) {
                    if (thisUser.cards[id].selfUseCard) {
                        thisUser.cards[id].use(this.state.players, thisUser);
                    } else {
                        thisUser.cards[id].use(this.state.players);
                    }
                    this.state.lastUsed = new LastUsed(thisUser, new ArraySchema<Player>(), thisUser.cards[id]);
                    this.gameState(0, (thisUserId + 1 == this.state.players.length ? 0 : thisUserId + 1));
                } else {
                    this.state.targetPlayerNumber = thisUser.cards[id].targetPlayerNumber;
                    this.gameState(3, thisUserId);
                }
                //this.gameState(thisUser.cards[id].targetPlayerNumber > 0 ? 3 : 0, thisUser.cards[id].targetPlayerNumber > 0 ? thisUserId : (thisUserId + 1 == this.state.players.length ? 0 : thisUserId + 1));
                thisUser.cards.splice(id, 1);
            }
        } else if (data.action == 2 && this.state.currentTurn == 3) {
            // Emberek kiválasztva            
            let selectedPlayers: ArraySchema<Player> = new ArraySchema<Player>();
            var tmp2 = this.state.players;
            data.input.players.forEach(function(tmp){
                selectedPlayers.push(tmp2[tmp]);
            })

            var card: Card = this.state.selectedCard;
            this.state.lastUsed = new LastUsed(thisUser, selectedPlayers, card);

            if (card.selfUseCard) {
                card.use(this.state.players, thisUser, ...selectedPlayers);
            } else {
                card.use(this.state.players, ...selectedPlayers);
            }

            this.gameState(0, thisUserId + 1 == this.state.players.length ? 0 : thisUserId + 1);
            console.log("Következő játékos")

        } else if (data.action == 4 && this.state.currentTurn == 1) {
            // Location selected
            let location = new VillageHouse();
            if (data.input == 2) {
                location = new Theatre();
            } else if (data.input == 3) {
                location = new Grillo();
            } else if (data.input == 3) {
                location = new School();
            }
            this.gameState(2, thisUserId);
            thisUser.enterLocation(location);
        }
    }
}