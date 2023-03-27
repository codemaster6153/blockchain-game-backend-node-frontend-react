const colyseus = require('colyseus');


class LoobyRoom extends colyseus.Room {
    // this room supports only 2 clients connected
    // maxClients = 2;

    onCreate (options) {
        console.log("LoobyRoom created!", options);

        this.roomId = options.roomId;

        this.onMessage("score", (client, message) => {
            console.log("LoobyRoom SCORE received message from", client.sessionId, ":", message);
            this.broadcast("score", message);
        });

        this.onMessage("game_over", (client, message) => {
            console.log("LoobyRoom  GAME OVER received message from", client.sessionId, ":", message);
            this.broadcast("game_over", message);
        });
    }

    onJoin (client, options) {
        console.log("ROOM " + this.roomId);
        console.log("JOINED " + client.id);
        this.broadcast("joined", options.username);
    }

    onLeave (client) {
        console.log("LEAVE " + client.id);
        this.broadcast("messages", `${ client.sessionId } left.`);
    }

    onDispose () {
        console.log("Dispose LoobyRoom");
    }
}

module.exports = {LoobyRoom};
