const fs = require("fs");
const { connect } = require("http2");
Log = require("../models/log");
Course = require("../models/courses");
User = require("../models/user");

const mongoose = require('mongoose');

connection = mongoose.connect(process.env.DBLOGIN).
    then(
        () => { console.log('Connected!'); },
        err => { console.log('Err: ' + err); }
    );

const LogSchema = mongoose.Schema(
    {
        courseId : { type: String, required : true },
        username : { type: String, required : true },
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

    async getUser(username)
    {
        try {
            const user = await
                User.findOne({ username
                });
            return user;
        }
        catch (err) {
            console.error('Error fetching user:', err);
            throw err;
        }
    }

    async getAllUsers()
    {
        try {
            const users = await User.find({}, 'username role courses').populate('courses', 'display');
            return users;
        }
        catch (err) {
            console.error('Error fetching users:', err);
            throw err;
        }
    }

    async getAllStudents() {
        try {
          const students = await User.find({ role: 3 }, 'username role courses').populate('courses', 'display');
          return students;
        } catch (err) {
          console.error('Error fetching students:', err);
          throw err;
        }
      }

    async createUser(user)
    {
        const newUser = new User(user);
        await newUser.save();

        user._id = newUser._id;
        return newUser;
    }

    async getCourses() {
        try {
            // Fetch all courses from the database
            const courses = await Course.find({}, 'display id users').populate('users', 'username');
            return courses;
        } catch (err) {
            console.error('Error fetching courses:', err);
            throw err;
        }
    }

    async getCurrentUserCourses(username) {
        try {
          const user = await User.findOne({ username }).populate('courses', 'display');
          return user.courses;
        } catch (err) {
          console.error('Error fetching user courses:', err);
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
            const logs = await Log.find().exec();
            return logs;
        } catch (err) {
            console.error('Error fetching logs:', err);
            throw err;
        }
    }

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

    async enrollUserInCourse(username, courseDisplay) {
        try {
          const user = await User.findOne({ username });
          const course = await Course.findOne({ display: courseDisplay });
    
          if (!user || !course) {
            throw new Error('User or Course not found');
          }
    
          // Add course to user's courses list
          if (!user.courses.includes(course._id)) {
            user.courses.push(course._id);
          }
    
          // Add user to course's users list
          if (!course.users.includes(user._id)) {
            course.users.push(user._id);
          }
    
          await user.save();
          await course.save();
    
          return { user, course };
        } catch (err) {
          console.error('Error enrolling user in course:', err);
          throw err;
        }
      }
}