const fs = require("fs");
const { connect } = require("http2");
Log = require("../models/log");
Course = require("../models/courses");

const mongoose = require('mongoose');

connection = mongoose.connect(process.env.DBLOGIN).
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

const CourseSchema = mongoose.Schema(
    {
        id : { type: String, required : true },
        display : { type: String, required : true },
    });

const LogModel = mongoose.model("logs", LogSchema);
const CourseModel = mongoose.model("courses", CourseSchema);

module.exports = class DBWrapper
{    
    constructor()
    {
    }

    async getCourses() {
        try {
            // Fetch all courses from the database
            const courses = await CourseModel.find().exec();
            return courses;
        } catch (err) {
            console.error('Error fetching courses:', err);
            throw err;
        }
    }

    async addCourse(course)
    {
        const mongoDBcourse = new CourseModel(course);

        await mongoDBcourse.save();

        console.log("mongoDBcourse:" + mongoDBcourse)

        course._id = mongoDBcourse._id;
        return course;
    }

    // option 1, using exec, preferred
    // note: you only need to use cursor or exec, but not both
    async getLogs() {
        try {
            // Fetch all courses from the database
            const logs = await LogModel.find().exec();
            return logs;
        } catch (err) {
            console.error('Error fetching logs:', err);
            throw err;
        }
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