var config = {
 database: {
 host: 'localhost', // database host
 user: 'root', // your database username -- eventually set it thru Heroku env variables
 password: '', // your database password -- eventually set it thru Heroku env variables
 port: 3306, // default MySQL port
 db: 'naturalneighbors' // your database name
 },
};
module.exports = config; //Expose the current config as a module
