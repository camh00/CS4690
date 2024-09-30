const { 
    v4: Guid,
  } = require('uuid');
  
  module.exports = class Log
{
    courseId = null;
    uvuId = null;
    date = new Date().toLocaleString();
    text = null;
    id = Guid();

    constructor(courseId, uvuId, msg)
    {
        this.courseId = courseId;
        this.uvuId = uvuId;
        this.text = msg;
    }
}