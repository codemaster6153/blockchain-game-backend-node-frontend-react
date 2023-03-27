CREATE DATABASE clashdome;

USE clashdome;

CREATE TABLE ludio_nfts_ratio(   
    day INT NOT NULL,
    game VARCHAR(100) NOT NULL,
    total_counter INT NOT NULL,
    ludio_ratio FLOAT NOT NULL,
    PRIMARY KEY (day, game)
);

CREATE TABLE ludio_nfts(   
    asset_id BIGINT NOT NULL,
    game VARCHAR(100) NOT NULL,
    id INT NOT NULL,
    games_played INT NOT NULL,
    total_counter DOUBLE NOT NULL,
    partial_counter DOUBLE NOT NULL,
    last_claim INT NOT NULL,
    PRIMARY KEY (asset_id)
);

CREATE TABLE free_duels (
    id INT AUTO_INCREMENT,
    seedsId VARCHAR(30),
    roomId VARCHAR(30),
    player1logs JSON,
    player2logs JSON,
    is_private BOOLEAN,
    PRIMARY KEY(id)
);

CREATE TABLE avatars (
    template_id INT,
    creator_name VARCHAR(30),
    data VARCHAR(3000),
    PRIMARY KEY(template_id)
);

CREATE TABLE fees_data (
    day INT NOT NULL,
    fees JSON,
    PRIMARY KEY(day)
);

CREATE TABLE ongoing_games (
    player_name VARCHAR(12) NOT NULL,
    game_id INT NOT NULL,
    duel_id INT NOT NULL,
    land_id INT NOT NULL DEFAULT 0,
    adversary VARCHAR(100),
    is_private BOOLEAN NOT NULL DEFAULT 0,
    fee VARCHAR(30),
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actions JSON NOT NULL DEFAULT (JSON_ARRAY()),
    seeds_counter INT DEFAULT 0,
    seed INT,
    MMR INT,
    validating BOOLEAN NOT NULL DEFAULT 0,
    credential INT,
    PRIMARY KEY(player_name, game_id)
);

CREATE TABLE payments (
    username VARCHAR(30) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    wax FLOAT,
    PRIMARY KEY(username, date)
);

CREATE TABLE countries (
    username VARCHAR(30) NOT NULL,
    country VARCHAR(30) NOT NULL,
    PRIMARY KEY(username)
);

CREATE TABLE games_data (
    player_name VARCHAR(30) NOT NULL,
    game_id INT NOT NULL,
    data_type VARCHAR(30),
    g_data JSON NOT NULL DEFAULT (JSON_ARRAY()),
    t TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(player_name, game_id, data_type)
);

CREATE TABLE level_data (
    id INT AUTO_INCREMENT,
    nft_id BIGINT NOT NULL DEFAULT 0,
    game_id INT NOT NULL,
    lvl_data JSON,
    author VARCHAR(12) NOT NULL,
    votes FLOAT NOT NULL DEFAULT 0, 
    n_votes INT NOT NULL DEFAULT 0, 
    total_collected_items INT NOT NULL DEFAULT 0,
    partial_collected_items INT NOT NULL DEFAULT 0,
    n_games INT NOT NULL DEFAULT 0,
    latest_game_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    latest_duels_ids JSON NOT NULL DEFAULT (JSON_ARRAY()),
    staked BOOLEAN NOT NULL DEFAULT 0,
    staker VARCHAR(12) DEFAULT NULL,
    cancelled BOOLEAN NOT NULL DEFAULT 0,
    rarity VARCHAR(12) DEFAULT '',
    claim_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

--  SELECT id, nft_id, game_id, author, votes, n_votes, total_collected_items, partial_collected_items, n_games, latest_game_time, latest_duels_ids, staked, staker, cancelled, rarity, claim_time FROM level_data;


-- DE MOMENTO PARA GUARDAR INFORMACION RELATIVA A LOS VOTOS
-- POSTERIORMENTE SE PUEDEN METER MAS COSAS
CREATE TABLE player_info (
    username VARCHAR(12),
    first_log_timestamp INT,
    voted_level_ids TEXT,
    PRIMARY KEY(username)
);

CREATE TABLE credentials (
    username VARCHAR(12),
    credential INT,
    PRIMARY KEY(username)
);

CREATE TABLE stats (
    day INT NOT NULL,
    killed_orcs INT NOT NULL DEFAULT 0,
    pocketed_balls INT NOT NULL DEFAULT 0,
    PRIMARY KEY(day)
);

-- COMANDOS LINEA TERMINAL

-- mysql -u root -p // PARA CONECTARSE
-- mysql -u root -h 164.90.215.132 -p // PARA CONECTARSE EN TESTNET password: clashdome_test
-- use clashdome;   // PARA SELECCIONAR LA BDD
-- show tables;     // PARA MOSTRAR LAS TABLAS
-- describe ongoing_games;    // PARA MOSTRAR LAS COLUMNAS 
-- select * from ongoing_games; // PARA MOSTRAR LA TABLA
-- DROP TABLE ongoing_games; // PARA ELIMINAR LA TABLA
-- DELETE FROM ongoing_games; // PARA VACIAR LA TABLA
-- ALTER TABLE ongoing_games RENAME COLUMN username TO user_name; // renombrar columnas
-- ALTER TABLE ongoing_games ADD credential INT; // añadir una columna
-- ALTER TABLE ongoing_games ADD validating BOOLEAN NOT NULL DEFAULT 0;
-- ALTER TABLE ongoing_games ADD is_private BOOLEAN NOT NULL DEFAULT 0;
-- ALTER TABLE free_duels ADD is_private BOOLEAN NOT NULL DEFAULT 0;
-- ALTER TABLE duels ADD is_private BOOLEAN NOT NULL DEFAULT 0;
-- ALTER TABLE ongoing_games ADD seed INT;
-- ALTER TABLE free_duels ADD seedsId VARCHAR(30);
-- ALTER TABLE free_duels ADD roomId VARCHAR(30);
-- ALTER TABLE free_duels AUTO_INCREMENT = 5;
-- ALTER TABLE duels ADD whitelist JSON;
-- ALTER TABLE duels ADD rejections JSON;

-- ALTER TABLE level_data MODIFY COLUMN rarity VARCHAR(12) DEFAULT '';

-- INSERT INTO free_duels (player1logs, seedsId) VALUES ('[]', '12345');

-- SELECT player1logs FROM free_duels WHERE id = 60699;
-- SELECT player_name FROM ongoing_games WHERE duel_id = 74015;
-- DELETE FROM ongoing_games WHERE player_name = "t1wqw.wam" AND game_id = 5;
-- SELECT player_name FROM ongoing_games WHERE duel_id = 74016 AND game_id = 2;


-- PARA SABER CUANDO FUERO USADAS LAS TABLAS POR ULTIMA VEZ

-- SELECT TABLE_NAME, UPDATE_TIME FROM information_schema.tables WHERE TABLE_SCHEMA = ‘clashdome’;

-- PARA SABER EL ID POR EL CUAL VA LA TABLA
-- SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = 'level_data' AND table_schema = DATABASE( ) ;


INSERT INTO 
	endless_siege_lands(land_id, last_claim, killed_orcs)
VALUES
	(1,0,0),

INSERT INTO 
	rug_pool_halls(hall_id, last_claim, pocketed_balls)
VALUES
	(1,0,0),
	(2,0,0),
    (3,0,0),
    (4,0,0),
    (5,0,0),
    (6,0,0),
    (7,0,0),
    (8,0,0),
    (9,0,0),
    (10,0,0);

/*tables for weekly tournament*/
CREATE TABLE weekly_ladeboard
(
    week INT NOT NULL,
    username VARCHAR(100) NOT NULL,
    game VARCHAR(100) NOT NULL,
    game_wins int,
    game_losses int,
    PRIMARY KEY
    (week, username, game)
);

--wax game fee for weekly tournament update 
ALTER TABLE weekly_ladeboard ADD wax_played_flag int DEFAULT 0;

CREATE TABLE mmr_table
(
    username VARCHAR(100) NOT NULL,
    game VARCHAR(100) NOT NULL,
    mmrFree int,
    mmrPaid int,
    PRIMARY KEY
    (username, game)
);

ALTER TABLE mmr_table ADD multiplier float  NOT NULL DEFAULT 1.0;

--players2 update 
ALTER TABLE mmr_table RENAME players;

ALTER TABLE players ADD TOTAL_DUELS_FREE int DEFAULT 0;
ALTER TABLE players ADD TOTAL_DUELS_PAID int DEFAULT 0;

--free
ALTER TABLE players ADD WINS_FREE int DEFAULT 0;
ALTER TABLE players ADD WINNING_STREAK_FREE int DEFAULT 0;
ALTER TABLE players ADD LONGEST_WINNING_STREAK_FREE int DEFAULT 0;
ALTER TABLE players ADD LOSING_STREAK_FREE int DEFAULT 0;

--paid
ALTER TABLE players ADD WINS_PAID int DEFAULT 0;
ALTER TABLE players ADD WINNING_STREAK_PAID int DEFAULT 0;
ALTER TABLE players ADD LONGEST_WINNING_STREAK_PAID int DEFAULT 0;
ALTER TABLE players ADD LOSING_STREAK_PAID int DEFAULT 0;

--High scores 
ALTER TABLE players ADD ALL_TIME_HIGH_SCORE int DEFAULT 0;
ALTER TABLE players ADD WEEK_HIGH_SCORE int DEFAULT 0;


CREATE TABLE duels
(
    id int NOT NULL ,
    date int NOT NULL DEFAULT (UNIX_TIMESTAMP()),
    type int,
    state int,
    game VARCHAR(100),
    fee VARCHAR(100),
    player1Account VARCHAR(100),
    player1Duration int,
    player1Score int, 
    player1MMR int,
    player2Account VARCHAR(100),
    player2Duration int,
    player2Score int, 

    PRIMARY KEY (id)
);

ALTER TABLE duels ADD multiplierP1 float  NOT NULL DEFAULT 1.0;
ALTER TABLE duels ADD multiplierP2 float  NOT NULL DEFAULT 1.0;

CREATE TABLE errors

(   id INT AUTO_INCREMENT,
    fn VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    game VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    error TINYTEXT,

    PRIMARY KEY
    (id)
);

create table unclaimed_duels
(
    username varchar(100) NOT NULL,
    id int NOT NULL,
    PRIMARY KEY
    (username,id)
);

CREATE TABLE rooms (
    id INT NOT NULL, 
    password VARCHAR(30) NOT NULL, 
    state VARCHAR(30) NOT NULL,
    seed INT NOT NULL,
    fee INT NOT NULL,
    bet INT NOT NULL,
    players JSON NOT NULL DEFAULT (JSON_ARRAY()),
    whitelist JSON NOT NULL DEFAULT (JSON_ARRAY()),
    blacklist JSON NOT NULL DEFAULT (JSON_ARRAY()),
    PRIMARY KEY(id)
);