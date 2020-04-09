import { Schema, type } from "@colyseus/schema";

export default class CharacterCard extends Schema {
    @type("number") characterId: number;
    @type("number") leftout: number = 0;
    @type("number") perRoundHP: number = 0;
    @type("boolean") cartell: boolean = false;
    @type("boolean") canEnterVillageHouse: boolean = false;
    @type("boolean") canGetSick: boolean = true;
    @type("number") startHP: number = 100;
    @type("boolean") marcell: boolean = false;
    @type("boolean") kispeti: boolean = false;
    @type("boolean") peter: boolean = false;
    @type("boolean") patrick: boolean = false;
    @type("boolean") robert: boolean = false;
    @type("boolean") celi: boolean = false;

    constructor(characterId: number){
        super();
        this.characterId = characterId;
    }
}