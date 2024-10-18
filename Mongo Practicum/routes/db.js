var path = require('path');
const dbJsonFileName = path.join(__dirname, '../public/db/db.json');
const dbJsonData = require(dbJsonFileName);

const dbJsonFileNameFromNodeFSPerspective = 'db.json'
const fs = require("fs");
Log = require("../models/log");

module.exports = class DBWrapper
{    
    dbJsonData = null;

    constructor()
    {
        this.dbJsonData = dbJsonData;
    }

    getCourses()
    {
        return this.dbJsonData.courses;
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
        console.log("writting to file: " + dbJsonFileNameFromNodeFSPerspective);

        fs.writeFile(dbJsonFileName, newJson, err => {
            if (err) {
                console.error(err);
            } else {
                console.log("updated: " + dbJsonFileNameFromNodeFSPerspective)
            }
        });
    }
}