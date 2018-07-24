/**
 * Created by 32842 on 2/27/2017.
 */

var should = require('should');
var request = require('supertest');
var expect = require('expect.js');

var config = require('../config');
var mongod = require('../model/mongodb');
mongod.setURI(config.test.db);


var app = require('../app');
var agent = request.agent(app);
var User = require("../model/users");
var async = require('async');
var Public_message = require('../model/messages')
suite('Unit Test: Chat Publicly', function () {
    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().

    var user = User.User;
    var public_message = Public_message.Messages;

    suiteSetup('Database Setup', function (done) {

        async.waterfall([
                function (callback) {
                    var data1 = {
                        username: 'David',
                        password: '123456',
                        email: '32@qwe',
                        online: true
                    }
                    var newUser1 = new user(data1);
                    newUser1.save(function (err, docs) {
                        // console.log(1);
                        callback(null);
                    });

                },
                function (callback) {
                    var data2 = {
                        username: 'Mike',
                        password: '123456',
                        email: '32@qwe',
                        online: true
                    }
                    var newUser2 = new user(data2);
                    newUser2.save(function (err, docs) {
                        // console.log(2);
                        callback(null);
                    });

                },
                function (callback) {

                    var data3 = {
                        username: 'Nancy',
                        password: '123456',
                        email: '32@qwe',
                        online: true
                    }
                    var newUser3 = new user(data3);
                    newUser3.save(function (err, docs) {
                        // console.log(3);
                        callback(null);
                    });
                },
                function (callback) {
                    var data = {
                        username: 'Nancy',
                        content: 'Hello',
                        timestamp:'123'

                    };
                    var newPublicMessage = new public_message(data);
                    newPublicMessage.save(function (err, docs) {
                        done();
                    });

                }
            ],
            function (err, results) {
                // results is now equal to ['one', 'two']
            });

    });


    test('Send Message with Wrong User', function (done) {
        var req = {
            body: {
                username: "Nancyy",
                content: "Hello"
            }
        }
        Public_message.Post(req, function (code) {
            expect(404).to.equal(code);
            done();
        })
    });

    test('Retrieve Message from User', function (done) {
        Public_message.RetrieveOne("Nancy", function (code, record) {
            console.log("123321");
            expect(200).to.equal(code);
            expect(1).to.equal(record.length);
            expect("Hello").to.equal(record[0].content);
            done();
        });
    });


    test('Retrieve Message from User not Exist', function (done) {
        Public_message.RetrieveOne("Mike", function (code, record) {
            expect(404).to.equal(code);
            done();
        });
    });

    test('Retrieve ALL Message', function (done) {
        Public_message.RetrieveAll(function (record) {
            expect(1).to.equal(record.length);
            expect("Hello").to.equal(record[0].content);
            done();
        })
    });

    test('Send Message', function (done) {
        var req = {
            body: {
                username: "Nancy",
                content: "HelloWorld"
            }
        }
        Public_message.Post(req, function (code) {
            expect(201).to.equal(code);
            done();
        })
    });

    test('Retrieve ALL Message', function (done) {
        Public_message.RetrieveAll(function (record) {
            expect(2).to.equal(record.length);
            expect("HelloWorld").to.equal(record[1].content);
            done();
        })
    });


    suiteTeardown('Database Delete', function (done) {
        mongod.remove();
        done();
    });

});