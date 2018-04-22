async function run_tests() {
  
  await get('/', $ => {
    // make sure we start out logged out by testing for the login button
    let loginButtons = $('#navbar a[href="/login"]')
    assert(loginButtons.length == 1, "No login button on first load");
  });
  await post('/login', {
    username: 'robert',
    password: '1234'
  });
  await get('/', $ => {
    // make sure we start out logged out by testing for the login button
    let loginButtons = $('#navbar a[href="/login"]')
    assert(loginButtons.length == 0, "Login button after login");
  });
  
}







/********* SET UP TESTING ENVIRONMENT *********/
const vm = require('vm');
const fs = require('fs');
const http = require('http');
const querystring = require('querystring');
const cheerio = require('cheerio');
const agent = new http.Agent({ keepAlive: true });
const _port = 3001;
function execfile(path) { // adapted from https://stackoverflow.com/a/8808328/1784306
  var data = fs.readFileSync(path);
  var script = vm.createScript(data, path);
  (async function (script) {
    await script.runInNewContext({
      require: require,
      process: {env: {PORT: _port}},
      __dirname: __dirname,
      console: {log: () => null}
    });
  })(script)
  return script;
}

var errs = [];
function assert(bool, err) { // usage: assert(output == 1, "Output is not 1");
  if(!bool) {
    console.log("ERROR: " + err);
    errs.push(err);
  }
}
function get(path, callback) {
  return new Promise(resolve => {
    http.get({hostname: 'localhost', port: _port, path: path, agent: agent}, res => {
      res.setEncoding('utf8');
      var body = '';
      res.on('data', data => {
        body += data;
      });
      res.on('end', () => {
        const $ = cheerio.load(body);
        callback($);
        resolve();
      });
    });
  })
}
function post(path, data) {
  return new Promise(resolve => {
    var data_string = querystring.stringify(data);
    var options = {
      hostname: 'localhost',
      port: _port,
      path: path,
      method: 'POST',
      agent: agent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data_string)
      }
    };
    var request = http.request(options, res => {
      res.on('data', () => {
        resolve();
      });
    });
    
    request.write(data_string);
    request.end();
  });
}

(async function() {
  var script = execfile('index.js');
  await run_tests();
  agent.destroy();
  console.log(`Testing completed with ${errs.length} errors.`);
  process.exit(0);
})();
