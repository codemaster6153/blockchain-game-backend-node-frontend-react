const mysql = require("mysql");
const config = require("../config/database.json"); 

class Database {
    constructor() {
        if (!process.env.DEV_MODE) {
            this.connection = this.createConnection();
            this.handleDisconnect();
        }
    }

    createConnection() {

        return mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        });
    }

    handleDisconnect() {

        this.connection = this.createConnection();

        this.connection.connect(function(err) {   
                    
            if(err) {                                   
                console.log('error when connecting to db:', err);
                setTimeout(handleDisconnect, 2000); 
            }                                       
        });                                     
                                                
        this.connection.on('error', function(err) {
            console.log('db error', err);
            if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
                this.handleDisconnect();                        
            } else {                                      
                throw err;                                  
            }
        });
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

}

let database = new Database();

module.exports = database;
