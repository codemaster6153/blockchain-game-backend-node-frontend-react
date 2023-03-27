const ColorRings = require("@ravalmatic/color-rings-engine");
const Templok = require("@ravalmatic/templok-engine");
const EndlessSiege = require("@ravalmatic/endless-siege-engine-v2");
const Candy = require("@ravalmatic/candy-engine");
const PoolKings = require("@ravalmatic/pool-kings-engine");
const Maze = require("@ravalmatic/maze-engine");
const ludioDistribution = require("../routes/ludio-distribution");
const mazeserver = require("../routes/maze-server");

module.exports = class ClashDomeGameEngineRunner {

    constructor(gameID, actions, landID, duelID) {

        this.gameID = parseInt(gameID);
        this.actions = actions;
        this.duelID = duelID;
        this.landID = parseInt(landID);
        this.orcsKilled = 0;
        this.pocketedBalls = 0;
        this.eatenDots = 0;
    }

   async run() {

        let score = 0;

        switch (this.gameID) {

            case 1: 

                const candyEngine = new Candy.Engine();
                candyEngine.init();
                candyEngine.processActions(this.actions);
                score = candyEngine.score;

                break;

            case 2:
                
                const templokEngine = new Templok.Engine();
                templokEngine.init();
                templokEngine.processActions(this.actions);
                score = templokEngine.score;
                break;

            case 3:

                const ringyDingyEngine = new ColorRings.Engine();
                ringyDingyEngine.init();
                ringyDingyEngine.processActions(this.actions);
                score = ringyDingyEngine.score;
                break;

            case 4:

                const endlessSiegeEngine = new EndlessSiege.Engine();
                endlessSiegeEngine.init(this.landID);
                endlessSiegeEngine.processActions(this.actions);
                score = endlessSiegeEngine.score;

                this.orcsKilled = endlessSiegeEngine.orcsCounter;
                this.landID = endlessSiegeEngine.landID; // puede ser diferente si es una partida sin terreno asignado

                break;

            case 5:

                const rugPoolEngine = new PoolKings.Engine();
                rugPoolEngine.init(this.landID, true);
                rugPoolEngine.processActions(this.actions);
                score = rugPoolEngine.score;

                this.pocketedBalls = rugPoolEngine.pocketedBalls;
                
                break;

            case 6: 

                let levelData = await mazeserver.getLevelData(this.landID);
                levelData = JSON.parse(JSON.parse(levelData));

                const mazeEngine = new Maze.Engine();  
                mazeEngine.init(this.landID, levelData);               
                mazeEngine.processActions(this.actions);
                score = mazeEngine.score

                this.eatenDots = mazeEngine.levelManager.eatenDots;

            default:
                break;
        }

        return {score: score};
    }

    updateNFTs() {

        switch (this.gameID) {

            case 1: 

                break;

            case 2: 

                break;

            case 3: 

                break;

            case 4:       
                ludioDistribution.updateorcs(this.orcsKilled, this.landID);
                break;

            case 5:  
                ludioDistribution.updateBalls(this.pocketedBalls, this.landID || 1);
                break;

            case 6:  
                ludioDistribution.updateDots(this.eatenDots, this.landID, this.duelID);
                break;

            default:
                break;
        }
    }
}