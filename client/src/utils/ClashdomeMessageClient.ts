export class ClashdomeMessageClient {
    private _callbacks: { onStartGame: any; onLoginSuccess: any; };
    private _customEventListeners: { id: string, callback: any, context: any }[];

    constructor(callbacks: {
        onStartGame: any,
        onLoginSuccess: any
    }) {
        console.log("ClashdomeMessageClient:", "started");

        this._callbacks = callbacks;

        this._onStartGame = this._onStartGame.bind(this);
        this._onLoginSuccess = this._onLoginSuccess.bind(this);
        this._onCustomEvent = this._onCustomEvent.bind(this);
        this._onDisposeGame = this._onDisposeGame.bind(this);

        this._customEventListeners = [];

        window.addEventListener("start-game", this._onStartGame);
        window.addEventListener("login-success", this._onLoginSuccess);
        window.addEventListener("clashdome-server-event", this._onCustomEvent);
        window.addEventListener("dispose-game", this._onDisposeGame);
    }

    dispatchGameStarted(gameInstance: any) {
        console.log("ClashdomeMessageClient:", "dispatchGameStarted");
        const e = new Event("game-started");
        //@ts-ignore
        e.game = gameInstance;
        window.dispatchEvent(e);
    }

    dispatchMessageToWeb(data: { id: string, payload: any }) {
        console.log("ClashdomeMessageClient:", "dispatchMessageToWeb", data);
        var e = new Event("clashdome-client-event");
        //@ts-ignore
        e.data = data;
        window.dispatchEvent(e);
    }

    private _onStartGame(e: any) {
        console.log("ClashdomeMessageClient:", "_onStartGame", e);
        this._callbacks.onStartGame(e.reactClass);
        window.removeEventListener("start-game", this._onStartGame);
    }

    private _onDisposeGame() {
        window.removeEventListener("start-game", this._onStartGame);
        window.removeEventListener("login-success", this._onLoginSuccess);
        window.removeEventListener("clashdome-server-event", this._onCustomEvent);
        window.removeEventListener("dispose-game", this._onDisposeGame);
    }

    private _onLoginSuccess() {
        console.log("ClashdomeMessageClient:", "_onLoginSuccess");
        this._callbacks.onLoginSuccess();
        window.removeEventListener("login-success", this._onLoginSuccess);
    }
    private _onCustomEvent(e: any) {
        console.log("ClashdomeMessageClient:", "custom-event:", e);
        this._customEventListeners.forEach(l => {
            if (l.id === e.data.id) {
                l.callback.call(l.context, e.data.payload);
            }
        });
    }

    addCustomEventListener(id: string, callback: any, context: any) {
        this._customEventListeners.push({ id, callback, context });
    }

    removeCustomEventListener(id: string) {
        const index = this._customEventListeners.findIndex(e => e.id === id);
        this._customEventListeners.splice(index, 1);
    }

    removeCustomEventListeners() {
        this._customEventListeners = [];
    }

}
