class _ClashdomeMessageServer {
    game: any;
    private _customEventListeners: { id: string, callback: any, context: any }[];

    constructor() {
        console.log("ClashdomeMessageServer:", "started");
        this._gameStarted = this._gameStarted.bind(this);
        this._onCustomEvent = this._onCustomEvent.bind(this);
        this._customEventListeners = [];
    }
    startGame(reactClass: any) {
        console.log("ClashdomeMessageServer:", "startGame");

        window.addEventListener("game-started", this._gameStarted);
        window.addEventListener("clashdome-client-event", this._onCustomEvent);

        const e = new Event("start-game");
        //@ts-ignore
        e.reactClass = reactClass;
        window.dispatchEvent(e);
    }

    disposeGame() {
        window.dispatchEvent(new Event("dispose-game"));
        this.game.onBlur();
        this.game.destroy(true, false);
        this.game = null;
    }

    loginSuccess() {
        console.log("ClashdomeMessageServer:", "loginSuccess");
        window.dispatchEvent(new Event("login-success"));
    }

    dispatchMessageToGame(data: { id: string, payload: any }) {
        console.log("ClashdomeMessageServer:", "dispatchMessageToGame", data);
        var e = new Event("clashdome-server-event");
        //@ts-ignore
        e.data = data;
        window.dispatchEvent(e);
    }

    private _gameStarted(e: any) {
        console.log("ClashdomeMessageServer:", "game started", e);
        this.game = e.game;
        window.removeEventListener("game-started", this._gameStarted);
    }

    private _onCustomEvent(e: any) {
        console.log("ClashdomeMessageServer:", "custom-event:", e);
        this._customEventListeners.forEach(l => {
            if (l.id === e.data.id) {
                l.callback.call(l.context, e.data.payload);
            }
        });
    }

    addCustomEventListener(id: string, callback: any, context: any) {
        this._customEventListeners.push({ id, callback, context });
    }
    removeCustomEventListener(id: string, callback: any, context: any) {
        const index = this._customEventListeners.findIndex(e => e.id === id);
        this._customEventListeners.splice(index, 1);
    }
}

export const ClashdomeMessageServer = new _ClashdomeMessageServer();