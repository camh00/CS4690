class Log {
  constructor(courseId, uvuId, text) {
    this.courseId = courseId;
    this.uvuId = uvuId;
    this.text = text;
    this.date = new Date().toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  }
}

module.exports = Log;