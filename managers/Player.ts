import { Room, Server, Delayed } from "colyseus";
import { Schema, MapSchema, type, ArraySchema, filter } from "@colyseus/schema";
import Card from './Card';
import CharacterCard from './Character';
import Location from "./Location";
import { Client } from "@colyseus/schema/lib/annotations";
import VillageHouse from "./locations/VillageHouse";

export default class Player extends Schema {
    @type("string") username: string;
    @type("number") health: number;
    @type("number") hunger: number = 100;
    @type("number") leftout: number;
    @type("boolean") roomOwner: boolean;
    @type("number") money: number = 100;
    @type("string") sessionId: string;
    @filter(function (
        this: Player,
        client: Client,
        value?: Player['cards'],
        root?: Schema
    ) {
        return this.sessionId == client.sessionId;
    })
    @type([Card]) cards:ArraySchema<Card> = new ArraySchema<Card>();
    @type(Location) location: Location = new VillageHouse();
    @type(CharacterCard) character: CharacterCard;
    @type("boolean") syncedIsCartellMember: boolean;
    @type("boolean") syncedCanGetSick: boolean;
    @type("boolean") syncedWonGame: boolean;

    constructor(username: string, character: CharacterCard, roomOwner: boolean = false, sessionId: string) {
        super();
        this.username = username;
        this.character = character;
        this.health = character.startHP;
        this.leftout = character.leftout;
        this.roomOwner = roomOwner;
        this.sessionId = sessionId;

        var obj = this;
        setInterval(function(){
            obj.syncedCanGetSick = obj.canGetSick();
            obj.syncedIsCartellMember = obj.isCartellMember();
            obj.syncedWonGame = obj.wonGame();
        }, 500)
    }

    isCartellMember():boolean {
        if (this.character.cartell) return true;

        this.cards.forEach(function(card){
            if(card.cartellPass){
                return true;
            }
        });

        return false;
    }

    canGetSick():boolean {
        if(!this.character.canGetSick) return false;
        
        this.cards.forEach(function(card){
            if(card.noziCard){
                return false;
            }
        });

        return true;
    }

    wonGame():boolean {
        let counter = 0;
        this.cards.forEach(function(card){
            if(card.kolbiceCard){
                counter++;
            }
        });

        return counter > 1;
    }

    enterLocation(location:Location){
        this.location = location;
        this.hunger += location.onJoinHunger;
        if(this.character.marcell){
            this.health += location.onJoinMarciHealth;
        } else {    
            this.health += location.onJoinHealth;
        }
    }
}