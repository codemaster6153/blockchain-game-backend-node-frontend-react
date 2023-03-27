const express = require('express');
const router = express.Router();
const joi = require('joi');

const dbGame = [
    {
        _id: 1,
        name: 'Endless Siege',
        url: '/endless-siege',
        name_id: "endless-siege",
        video: 'https://www.youtube.com/embed/HU_6ANaOlOM',
        wiki: 'https://endless-siege.fandom.com/wiki/Endless_Siege_Wiki',
    },
    {
        _id: 2,
        name: 'Candy Fiesta',
        url: '/candy-fiesta',
        name_id: "candy-fiesta",
        video: 'https://www.youtube.com/embed/HU_6ANaOlOM',
        wiki: 'https://candy-fiesta.fandom.com/wiki/Candy_Fiesta_Wiki',
    },
    {
        _id: 3,
        name: 'Templok',
        url: '/templok',
        name_id: "templok",
        video: 'https://www.youtube.com/embed/HU_6ANaOlOM',
        wiki: 'https://templok.fandom.com/wiki/Templok_Wiki',
    },
    {
        _id: 4,
        name: 'Ringy Dingy',
        url: '/ringy-dingy',
        name_id: "ringy-dingy",
        video: 'https://www.youtube.com/embed/HU_6ANaOlOM',
        wiki: 'https://templok.fandom.com/wiki/Templok_Wiki',
    },
    {
        _id: 5,
        name: 'Endless Siege 2',
        url: '/endless-siege-2',
        name_id: "endless-siege-2",
        video: 'https://www.youtube.com/embed/HU_6ANaOlOM',
        wiki: 'https://endless-siege.fandom.com/wiki/Endless_Siege_Wiki',
    },
    {
        _id: 7,
        name: 'Pac Man',
        url: '/maze',
        name_id: "maze",
        video: 'https://www.youtube.com/embed/HU_6ANaOlOM',
        wiki: 'https://endless-siege.fandom.com/wiki/Endless_Siege_Wiki',
    }
];

function validateId(id) {
    return joi.validate(id, { id: joi.string().isNumber() })
}

/**
 * Get the current list of games
 */
router.get('/', function (req, res) {
    res.send(dbGame);
});

/**
 * Get the requested game
 */
router.get('/:id', function (req, res) {
    const { error } = validateId(req.param.id)
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    // find game and send
    const game = dbGame.find(g => g._id === parseInt(req.params.id));
    if (!game) {
        res.status(404).send('The game with the given id could not be found.');
    }
    res.send(game)
});

module.exports = router;
