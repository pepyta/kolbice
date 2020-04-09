import { Room, Server, Delayed } from "colyseus";
import { Schema, MapSchema, type } from "@colyseus/schema";
import { createServer } from "http";
import express from "express";
import GameRoom from './managers/Room';

const port = 3000;

const app = express();
app.use(express.json());

const gameServer = new Server({
	server: createServer(app),
});

for(let i = 1000; i < 10000; i++){
	gameServer.define(i+"", GameRoom);
}

gameServer.define("room", GameRoom)

gameServer.listen(port);