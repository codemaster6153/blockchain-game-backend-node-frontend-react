const colyseus = require('colyseus');


class ConnectionRoom extends colyseus.Room {
    // this room supports only 2 clients connected
    // maxClients = 2;

    onCreate (options) {
        console.log("ConnectionRoom created!", options);

        this.roomId = options.roomId;

        this.onMessage("SET_PLAYER_STATE", (client, message) => {
            client.state = message;
            this.sendPlayerList(client);
        });
    }

    onJoin (client, options) {
        client.username = options.username;
        client.state = "ONLINE";
        console.log("JOINED " + client.username);
    }

    onLeave (client) {
        console.log("LEAVE " + client.username);
        this.sendPlayerList();
    }

    onDispose () {
        console.log("Dispose ConnectionRoom");
    }

    async sendPlayerList() {

        this.sleep(500);

        let clients = {};

        for (let i = 0; i < this.clients.length; i++) {
            clients[this.clients[i].username] = this.clients[i].state;
        }

        this.broadcast("PLAYERS_LIST", clients);
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

module.exports = {ConnectionRoom};
