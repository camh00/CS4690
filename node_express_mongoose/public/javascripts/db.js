const fs = require("fs");
const { connect } = require("http2");
Log = require("../../models/log");

const mongoose = require('mongoose');

connection = mongoose.connect('mongodb+srv://chancock:yPF2UssGDKt40v@cs4690.4o3ur.mongodb.net/?retryWrites=true&w=majority&appName=CS4690').
    then(
        () => { console.log('Connected!'); },
        err => { console.log('Err: ' + err); }
    );

const LogSchema = mongoose.Schema(
    {
        courseId : { type: String, required : true },
        uvuId : { type: Number, required : true },
        date : Date,
        text : { type: String, required : true },
        id : mongoose.Schema.ObjectId
    });

const LogModel = mongoose.model("logs", LogSchema);

module.exports = class DBWrapper
{    
    constructor()
    {
    }

    // option 1, using exec, preferred
    // note: you only need to use cursor or exec, but not both
    async getLogs()
    {
        // using exec
        const logs = await LogModel.find().exec();
        return logs;
    }

    /*
    // option 2, using cursor
    // note: you only need to use cursor or exec, but not both
    async getLogs()
    {
        const logs = [];
        const cursor = await LogModel.find().cursor();
        for await (const log of cursor) {
            // Process each document
            console.log("db log:  " + log);
            logs.push(log);
        }

        console.log("Logs:  " + logs);
        return logs;
    }
    */

    async addLog(log)
    {
        const mongoDBLog = new LogModel(log);

        await mongoDBLog.save();

        console.log("mongoDBLog:" + mongoDBLog)

        log._id = mongoDBLog._id;
        return log;
    }

    async deleteLog(_id)
    {
        const result = await LogModel.findByIdAndDelete(_id);
        return result;
    }
}