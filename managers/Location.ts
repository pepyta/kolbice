import { Schema, type } from "@colyseus/schema";

export default class Location extends Schema {
    @type("number") id: number;
    @type("number") onJoinMoney: number = 0;
    @type("number") onJoinHunger: number = 0;
    @type("number") onJoinHealth: number = 0; 
    @type("boolean") villageHouse: boolean = false;
    @type("boolean") onJoinMarciHealth: number = 0;

    constructor(id){
        super();
        this.id = id;
    }
}