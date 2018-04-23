# teamWORK

Hi, we're teamWORK, a collective of enterprising, industry-disrupting young
students in CSCI 3308 (section 104, group 2). Our incredible code and great
ideas will go in this repository!

- Jacob Bloom ([@mrjacobbloom](https://github.com/mrjacobbloom))
- Joy Mace ([@JoyMace](https://github.com/JoyMace))
- Robert Rosetti ([@RobertRossetti](https://github.com/RobertRossetti))
- Eliott Ishak ([@elis7999](https://github.com/elis7999))
- Tuqa Alaithan ([@Totoistough](https://github.com/Totoistough))
- Jun Sheng ([@sntst](https://github.com/sntst))

# How to install the server

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
4. [Make sure mysql is running.](https://coolestguidesontheplanet.com/start-stop-mysql-from-the-command-line-terminal-osx-linux/)
5. Navigate into the `code` folder:

```shell
cd code
```

6. Install the dependencies:

```shell
npm install
```

# How to run the server

1. Navigate into the `code` folder:

```shell
cd code
```

2. [Make sure mysql is running.](https://coolestguidesontheplanet.com/start-stop-mysql-from-the-command-line-terminal-osx-linux/)

3. Start the server:

```shell
npm start
```

# Run the test suite

Note: the test suite uses some newer JS features. if you get errors like
"unexpected token function" then you'll need to run the test suite on a newer
version of Node.js (7.6 or newer).

1. If this is your first time running the tests, make sure to install the
test-specific dependencies:

```shell
npm install --dev
```

2. Now you can run the tests:

```shell
npm test
```
