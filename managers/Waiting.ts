import { Schema } from "@colyseus/schema";
import { boolean } from "@colyseus/schema/lib/encoding/decode";

export default class Waiting extends Schema {
    username: string;
    roomOwner: boolean;
    sessionId: string;

    constructor(username: string, roomOwner: boolean = false, sessionId: string){
        super();
        this.username = username;
        this.roomOwner = roomOwner;
        this.sessionId = sessionId;
    }
}