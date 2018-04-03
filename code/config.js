var config = {
 database: {
 host: 'localhost', // database host
 user: 'root', // your database username -- eventually set it thru Heroku env variables
 password: '', // your database password -- eventually set it thru Heroku env variables
 port: 3306, // default MySQL port
 db: 'lab6' // your database name
 },
 server: {
 host: '127.0.0.1',
 port: '4000'
 }
};
module.exports = config; //Expose the current config as a module
