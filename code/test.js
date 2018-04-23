async function run_tests() {
  await get('/abcde', $ => {
    // test the 404 page
    let title = $('title').text();
    assert(title.includes("Page Not Found"), "/abcde doesn't give 404 page");
  });
  await get('/', $ => {
    // make sure we start out logged out by testing for the login button
    let loginButton = $('#navbar a[href="/login"]')
    assert_exists(loginButton, "No login button on first load");
  });
  // try invalid login
  await post('/login', {
    username: 'robert',
    password: 'fitfullsOfSpaghettiThrownViolentlyAtMyFriends'
  });
  await get('/', $ => {
    // make sure we're still logged out by testing for the login button
    let loginButton = $('#navbar a[href="/login"]')
    assert_exists(loginButton, "Logged in after bad login");
  });
  // try valid login
  await post('/login', {
    username: 'robert',
    password: '1234'
  });
  await get('/', $ => {
    // now that we're logged in, check that the login button is gone
    let loginButton = $('#navbar a[href="/login"]');
    assert_not_exists(loginButton, "Login button exists after login");
    
    // confirm that the user dropdown exists
    let userDropdown = $('#navbar .dropdown');
    assert_exists(userDropdown, "User dropdown not found after login");
    
    // confirm that new post prompt exists
    let newPost = $('#new-post');
    assert_exists(newPost, "New post prompt doesn't exist after login");
    
    // confirm that new post prompt exists
    let prevPost = $('.post:not(#new-post)');
    assert_exists(prevPost, "No previous posts on journal page after login");
  });
  // try posting to journal
  let randTitle = 'test post ' + Math.random();
  await post('/', {
      post_title: randTitle,
      post_desc: 'test post description',
      latitude: 0,
      longitude: 0
  });
  // try invalid post
  let randTitle2 = 'test post ' + Math.random();
  await post('/', {
      post_title: randTitle2
  });
  await get('/', $ => {
    // see if our valid post is in the list thing
    let myPost = $(`.post-title:contains(${randTitle})`);
    assert_exists(myPost, "Post not added to post list");
    
    let myPost2 = $(`.post-title:contains(${randTitle2})`);
    assert_not_exists(myPost2, "Invalid post added to post list");
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
var cookie;
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
function assert_exists(node, err) {
  assert(node.length >= 1, err);
}
function assert_not_exists(node, err) {
  assert(node.length == 0, err);
} 
function get(path, callback) {
  return new Promise(resolve => {
    var options = {
      hostname: 'localhost',
      port: _port,
      path: path,
      agent: agent
    };
    if(cookie) options.headers = {'Cookie': cookie};
    http.get(options, res => {
      if(res.headers['set-cookie']) cookie = res.headers['set-cookie'][0];
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
    if(cookie) options.headers['Cookie'] = cookie;
    var request = http.request(options, res => {
      if(res.headers['set-cookie']) cookie = res.headers['set-cookie'][0];
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
  if(errs.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
