# teamWORK

[![Build Status](https://travis-ci.org/mrjacobbloom/teamWORK.svg?branch=master)](https://travis-ci.org/mrjacobbloom/teamWORK) [![Heroku](http://heroku-badge.herokuapp.com/?app=natural-neighbors&style=flat&svg=1)](https://natural-neighbors.herokuapp.com/)

Natural Neighbors is a social network where wildlife enthusiasts can post about
what animals they've seen. Think iNaturalist but tiny and not intended for
the advancement of science.

[Try it out](https://natural-neighbors.herokuapp.com/) our watch a walkthrough below:

[![walk-through video](http://img.youtube.com/vi/MBrT0ZcP6OE/0.jpg)](http://www.youtube.com/watch?v=MBrT0ZcP6OE)

Note that this site is missing a number of features necessary for a full-scale
social network. We'll probably take it off Heroku after the class ends
(or at least downscale), but I
encourage you to clone it and run locally because it's freakin' cool

## Who are we?

Hi! We're teamWORK, a collective of enterprising, industry-disrupting young
students in CSCI 3308 (section 104, group 2). Our incredible code and great
ideas live in this repository!

- **Joy Mace ([@JoyMace](https://github.com/JoyMace))** - SCRUM master
- **Jacob Bloom ([@mrjacobbloom](https://github.com/mrjacobbloom))** - server and testing
- **Robert Rosetti ([@RobertRossetti](https://github.com/RobertRossetti))** - database
- **Eliott Ishak ([@elis7999](https://github.com/elis7999))** - maps and Google APIs
- **Tuqa Alaithan ([@Totoistough](https://github.com/Totoistough))** - front-end design
- **Jun Sheng ([@sntst](https://github.com/sntst))** - front-end design

## Navigating this repository

Here's a breakdown of what you'll find in this repo:

- `code/` - the code for the social network itself
  - `sass/` - stylesheets that will be compiled to CSS files ([learn more](https://sass-lang.com/))
  - `server_resources/` - a couple utility JS files used by the server
  - `sql/` - code for setting up the database locally and on Travis
  - `static/` - non-HTML files used by the website, like scripts, styles, and images. Includes the site's logo
  - `views/` - HTML-like files used by [Nunjucks](https://mozilla.github.io/nunjucks/) used by the server to generate HTML files
    - `templates/` - files used by many Nunjucks files, like the navigation links
  - `index.js` - the code for the server. It uses [Express](http://expressjs.com/) to handle HTTP requests
  - `package.json` - tells [Node](https://nodejs.org/en/) how to run the server, how to run tests on it, how to set up the database, and what modules it needs to install the server
  - `test.js` - our test suite (see below)
- `meeting_notes/` - word documents containing the notes from our weekly meetings
- `milestones/` - word documents marking our progress at certain points throughout the development process
- `travis.yml` - configuration for our Travis CI testing ([look at it go!](https://travis-ci.org/mrjacobbloom/teamWORK))
- `package.json` - a dummy manifest file, which directs Heroku to run the server in the `code/` folder

There is no documentation beyond this README file, but feel free to [open an issue](https://github.com/mrjacobbloom/teamWORK/issues) if you have any questions or need assistance with anything.

## Installing the server

Before you do this: Note that there have been issues installing Nunjucks
on the VM. I recommend doing this on your main operating system since it'll
run just as well there.

1. Clone the repository:

```shell
cd folder/where/I/want/the/repo
git clone https://github.com/mrjacobbloom/teamWORK.git
```

2. [Install NodeJS](https://nodejs.org/en/download/package-manager/)
3. [Install npm](https://docs.npmjs.com/getting-started/installing-node)
4. Navigate into the `code` folder:

```shell
cd code
```

5. Install the dependencies:

```shell
npm install
```

6. [Make sure mysql is running.](https://coolestguidesontheplanet.com/start-stop-mysql-from-the-command-line-terminal-osx-linux/)

7. Set up the database locally:

```shell
npm run-script database
```

## Running the server

1. Navigate into the `code` folder:

```shell
cd code
```

2. [Make sure mysql is running.](https://coolestguidesontheplanet.com/start-stop-mysql-from-the-command-line-terminal-osx-linux/)

3. Start the server:

```shell
npm start
```

## Testing

[![Build Status](https://travis-ci.org/mrjacobbloom/teamWORK.svg?branch=master)](https://travis-ci.org/mrjacobbloom/teamWORK)

Our test suite automatically runs on every push to this repo. You can see the
results of those tests on our [Travis CI page](https://travis-ci.org/mrjacobbloom/teamWORK).

The suite works by running the server in a new process and directing it to use a specific port.
Then, it runs a series of tests by sending HTTP requests to that port.
It verifies that things like logging in and posting work as expected. It uses a
little Promise noodlery to look synchronous.

### Running the test suite

Make sure the server is installed before you try running the test suite.

Note: the test suite uses some newer JS features. If you get errors like
"unexpected token function" then you'll need to run the test suite on a newer
version of Node.js (7.6 or newer).

```shell
cd code
npm test
```
