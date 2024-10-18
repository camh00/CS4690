
var path = require('path');

const dbJsonFileName = path.join(__dirname, '../db.json');
const dbJsonData = require(dbJsonFileName);

const fs = require("fs");
Log = require("../models/log");

console.log(dbJsonData);

module.exports = class DBWrapper
{    
    dbJsonData = null;

    constructor()
    {
        this.dbJsonData = dbJsonData;
    }

    getLogs()
    {
        return this.dbJsonData.logs;
    }

    addLog(log)
    {
        this.dbJsonData.logs.push(log);
        this.save()
    }

    save()
    {
        const newJson = JSON.stringify(this.dbJsonData);
        console.log("writting:  " + newJson);
        console.log("to file: " + dbJsonFileName);

        fs.writeFile(dbJsonFileName, newJson, err => {
            if (err) {
                console.error(err);
            } else {
                console.log("updated: " + dbJsonFileName)
            }
        });
    }
}