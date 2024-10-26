const fs = require("fs");
const { connect } = require("http2");
Log = require("../models/log");
Course = require("../models/courses");

const mongoose = require('mongoose');

connection = mongoose.connect('mongodb+srv://' + process.env.UNAME + ':' + process.env.PWORD + '@cs4690.4o3ur.mongodb.net/CS4690?retryWrites=true&w=majority&appName=CS4690').
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

const CollectionSchema = mongoose.Schema({
    courses: { type: Array, required: true },
});
const TestLogSchema = mongoose.Schema({
    logs: { type: Array, required: true },
});

// const LogModel = mongoose.model("logs", LogSchema);
// const CourseModel = mongoose.model("courses", CourseSchema);
const CollectionModel = mongoose.model('courses', CollectionSchema);
const TestLogModel = mongoose.model('logs', TestLogSchema);

module.exports = class DBWrapper
{    
    constructor()
    {
    }

    async getCourses()
    {
        const collections = await CollectionModel.find().exec();
        const coursesArray = collections.map(course => course.courses);
        return coursesArray[0];
        // using exec
        // const courses = await CourseModel.find().exec();
        // const coursesArray = courses.map(course => course.courses);
        // console.log(courses);
        // return courses;
    }

    async addCourse(course)
    {
        try {
            // Find the document containing the courses array
            const document = await CollectionModel.findOne().exec();
            
            if (document) {
                // Append the new course to the courses array
                document.courses.push(course);
                
                // Save the updated document
                await document.save();
                console.log("Updated document with new course:", document);
                return course;
            } /* else {
                // If no document exists, create a new one with the course
                const newDocument = new CollectionModel({ courses: [course] });
                await newDocument.save();
                console.log("Created new document with course:", newDocument);
                return course;
            } */
        } catch (err) {
            console.error('Error adding course:', err);
            throw err;
        }
    }

    // option 1, using exec, preferred
    // note: you only need to use cursor or exec, but not both
    async getLogs()
    {
        // using exec
        const logs = await TestLogModel.find().exec();
        const logsArray = logs.map(logs => logs.logs);
        return logsArray[0];
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

    // async addLog(log)
    // {
    //     const mongoDBLog = new LogModel(log);

    //     await mongoDBLog.save();

    //     console.log("mongoDBLog:" + mongoDBLog)

    //     log._id = mongoDBLog._id;
    //     return log;
    // }
    async addLog(log) {
        try {
            // Find the document containing the logs array
            const document = await TestLogModel.findOne().exec();
            
            if (document) {
                // Append the new log to the logs array
                document.logs.push(log);
                
                // Save the updated document
                await document.save();
                console.log("Updated document with new log:", document);
                return log;
            } /* else {
                // If no document exists, create a new one with the log
                const newDocument = new TestLogModel({ logs: [log] });
                await newDocument.save();
                console.log("Created new document with log:", newDocument);
                return log;
            }*/
        } catch (err) {
            console.error('Error adding log:', err);
            throw err;
        }
    }

    async deleteLog(_id)
    {
        const result = await LogModel.findByIdAndDelete(_id);
        return result;
    }
}