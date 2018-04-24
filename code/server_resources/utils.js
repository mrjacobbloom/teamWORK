module.exports = {
  genContext: function(req, errors = []) {
    if(!Array.isArray(errors)) {
      errors = [errors];
    } else if(req.query && req.query.errors) {
      errors = errors.concat(JSON.parse(req.query.errors));
    }
    return {
      user: req.session.user || null,
      errors: errors
    };
  },
  timeSince: function(date) { // https://stackoverflow.com/a/3177838/1784306
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval + " year" + ((interval != 1) ? "s" : "") + " ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " month" + ((interval != 1) ? "s" : "") + " ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " day" + ((interval != 1) ? "s" : "") + " ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hour" + ((interval != 1) ? "s" : "") + " ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minute" + ((interval != 1) ? "s" : "") + " ago";
    }
    interval = Math.floor(seconds);
    return interval + " second" + ((interval != 1) ? "s" : "") + " ago";
  },
  getCurrentDateString: function() {
    function padLeft(str, len = 2) {
      str = str.toString();
      return "0".repeat(Math.min(0, len - str.len)) + str;
    }
    var now = new Date();
    return `${now.getFullYear()}-${padLeft(now.getMonth() + 1)}-${padLeft(now.getDate())} ${padLeft(now.getHours())}:${padLeft(now.getMinutes())}:${padLeft(now.getSeconds())}`;
  },
  passErrors: function(path, errors) {
    if(!Array.isArray(errors)) errors = [errors];
    for(let i in errors) {
      errors[i] = errors[i].msg || errors[i].toString();
    }
    errorsEncoded = encodeURIComponent(JSON.stringify(errors));
    return path + '?errors=' + errorsEncoded;
  },
  postQuery: function(username) {
    return `SELECT * FROM data ${(username !== undefined) ? `WHERE username = "${username}"` : ''} ORDER BY post_date DESC LIMIT 20`;
  }
}
