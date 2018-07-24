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
var Private_Messages = require("../model/private_messages");
var async = require('async');

suite('Unit Test:　Chat Privately', function() {

    var user = User.User;
    var private_messages = Private_Messages.PrivateMessages;
    suiteSetup('Database Setup',function(done) {

        async.waterfall([
                function(callback){
                    var data1 = {
                        username: 'David',
                        password: '123456',
                        email: '32@qwe',
                        online: true
                    }
                    var newUser1 = new user(data1);
                    newUser1.save(function (err,docs) {
                        // console.log(1);
                        callback(null);
                    });

                },
                function(callback){
                    var data2 = {
                        username: 'Mike',
                        password: '123456',
                        email: '32@qwe',
                        online: true
                    }
                    var newUser2 = new user(data2);
                    newUser2.save(function (err,docs) {
                        // console.log(2);
                        callback(null);
                    });

                },
                function(callback){

                    var data3 = {
                        username: 'Nancy',
                        password: '123456',
                        email: '32@qwe',
                        online: true
                    }
                    var newUser3 = new user(data3);
                    newUser3.save(function (err,docs) {
                        // console.log(3);
                        callback(null);
                    });

                },
                function(callback){
                    var chatContent = {
                        sendingUserName:"Nancy",
                        content:"Hello",
                        receivingUserName:"Mike",
                        timestamp:"1"
                    };
                    var newPrivateMessage = new private_messages(chatContent);
                    newPrivateMessage.save(function (err,docs) {
                        done()
                    });
                }
            ],
            function(err, results){
                // results is now equal to ['one', 'two']
            });

    });

    test('Retrieve Message from two User', function(done) {
        var req = {
            params:{
                userName1 : "Nancy",
                userName2 : "Mike"
            }
        };
        Private_Messages.RetrieveMessages(req, function(code, record){
            expect(201).to.equal(code);
            expect(1).to.equal(record.length);
            expect("Hello").to.equal(record[0].content);
            done();
        });
    });


    test('Retrieve Message from User1 not Exist', function(done) {
        var req = {
            params:{
                userName1 : "Nancyy",
                userName2 : "Mike"
            }
        };
        Private_Messages.RetrieveMessages(req, function(code, record){
            expect(404).to.equal(code);
            expect(null).to.equal(record);
            done();
        });
    });

    test('Retrieve Message from User2 not Exist', function(done) {
        var req = {
            params:{
                userName1 : "Nancy",
                userName2 : "Mikee"
            }
        };
        Private_Messages.RetrieveMessages(req, function(code, record){
            expect(404).to.equal(code);
            expect(null).to.equal(record);
            done();
        });
    });

    test('Send Message', function(done) {
        var req = {
            body : {
                sendingUserName: "Nancy",
                receivingUserName: "Mike",
                content: "HelloWorld",
                status: "true",
                Location: "SV"
            }
        };
        Private_Messages.SendPrivate(req, function(code, record){
            expect(201).to.equal(code);
            done();
        });
    });

    suiteTeardown('Database Delete',function(done) {
        //console.log("outt");
        mongod.remove();
        done();
    });

});