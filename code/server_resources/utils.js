module.exports = {
  genContext: function(req) {
    var errors = null;
    if(req.query && req.query.errors) {
      errors = JSON.parse(req.query.errors);
    }
    return {
      user: req.session.user || null,
      errors: errors
    };
  },
  timeSince: function(date) { // https://stackoverflow.com/a/3177838/1784306
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  },
  getCurrentDateString: function() {
    function padLeft(str, len) {
      str = str.toString();
      return "0".repeat(Math.min(0, len - str.len)) + str;
    }
    var now = new Date();
    return `${now.getFullYear()}-${padLeft(now.getMonth() + 1)}-${padLeft(now.getDate())}`;
  },
  passErrors: function(path, errors) {
    if(!Array.isArray(errors)) errors = [errors];
    for(let i in errors) {
      errors[i] = errors[i].msg || errors[i].toString();
    }
    errorsEncoded = encodeURIComponent(JSON.stringify(errors));
    return path + '?errors=' + errorsEncoded;
  }
}
