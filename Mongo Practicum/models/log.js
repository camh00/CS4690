const mongoose = require('mongoose');
  
module.exports = class Log
{
    courseId = null;
    uvuId = null;
    date = new Date().toLocaleString();
    text = null;

    constructor(courseId, uvuId, msg)
    {
        this.courseId = courseId;
        this.uvuId = uvuId;
        this.text = msg;
    }
}