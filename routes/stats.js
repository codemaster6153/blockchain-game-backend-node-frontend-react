const express = require('express');
const router = express.Router();
const database = require("../database/database");

require('dotenv').config();

router.get('/get-stats/', async (req, res) => {

    try {

        // determinar el dia de ayer
        let yesterday = new Date(Date.now() - 86400000);
        yesterday = yesterday.toISOString().slice(0, 10).replace(/-/g, '');;

        const query = `SELECT (SELECT killed_orcs FROM stats WHERE day = ?) as killedOrcs, (SELECT pocketed_balls FROM stats WHERE day = ?) as pocketedBalls, 
                        SUM(CASE WHEN is_private = 1 THEN 1 ELSE 0 END) as privateDuels,
                        SUM(CASE WHEN is_private = 0 THEN 1 ELSE 0 END) as freeDuels
                        FROM duels WHERE date >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 30 DAY))`;

        const [row] = await database.query(query, [yesterday, yesterday]);

        if (row) {
            const { killedOrcs, pocketedBalls, privateDuels, freeDuels } = row;
            res.json({ killedOrcs, pocketedBalls, privateDuels, freeDuels });
        } else {
            res.status(400).json({ error: "Stats can't be retrieved"});
        }
    
    } catch (e) {

        res.status(400).json({ error: "" + e.message});
    }
});

module.exports = router;
