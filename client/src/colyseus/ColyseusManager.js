import * as Colyseus from "colyseus.js";
import store from "../store";

class ColyseusManager {

    constructor() {

        let endpoint;

        if (window.location.hostname.indexOf("localhost") !== -1 || window.location.hostname.indexOf("127") !== -1) {
            endpoint = "ws://localhost:3001";
        } else {
            endpoint = "wss://" + window.location.hostname + ":443";
        }

        this.client = new Colyseus.Client(endpoint);
        this.players = {};
    }

    async enterConnectionRoom(username) {

        const ROOM_ID = "clashconn"

        try {
            this.room = await this.client.joinById(ROOM_ID, {roomId: ROOM_ID, username: username});
        } catch (e) {
            console.log(e);
            this.room = await this.client.create("connection", {roomId: ROOM_ID, username: username});
        }

        this.room.onMessage("PLAYERS_LIST", (players) => {

            this.players = players;

            store.dispatch({
                type: "SET_ROOM",
                payload: {
                    players
                }
            })
        });

        this.sendMessage("SET_PLAYER_STATE", "ONLINE")
    }

    async sendMessage(type, message) {

        if (this.room) {
            this.room.send(type, message);
        }
        
    }
}

export default ColyseusManager;