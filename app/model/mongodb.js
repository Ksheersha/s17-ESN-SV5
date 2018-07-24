/**
 * Created by Yuxin Wei on 2/27/2017.
 */



var mongoose = require('mongoose');
var config = require('../config');
// Build the connection string
var dbURI = config.development.db;
// Create the database connection
module.exports.setURI = function (URI) {
    dbURI = URI;
}

module.exports.remove = function () {
    mongoose.connection.db.dropDatabase(function (err, result) {
        console.log(dbURI + ' removed!');
    });
}

module.exports.setup = function () {
    mongoose.connect(dbURI);

    mongoose.connection.on('connected', function () {
        console.log('Mongoose connected to ' + dbURI);
    });
    mongoose.connection.on('error', function (err) {
        console.log('Mongoose connection error: ' + err);
    });
    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose disconnected');
    });
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose disconnected through app termination');
            process.exit(0);
        });
    });
}



