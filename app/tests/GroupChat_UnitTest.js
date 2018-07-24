/**
 * Created by 32842 on 2/27/2017.
 */

var should = require('should');
var request = require('supertest');
var expect = require('expect.js');

var config = require('../config');
var mongod = require('../model/mongodb');
var Groupmessages = require('../model/groupchat_messages');

var Groups = require('../model/chatgroup');
mongod.setURI(config.test.db);


var app = require('../app');
var agent = request.agent(app);
var User = require("../model/users");
var async = require('async');

suite('Unit Test: Group Chat', function() {

    var user = User.User;
    // var Groupmessages = Groupmessages.groupchat_message;
    var groups = Groups.chatgroup;
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
                    var data = {
                        groupname: 'Hello',
                        users: 'Nancy',
                    }
                    var newGroup = new groups(data);
                    newGroup.save(function (err,docs) {
                        // console.log(2);
                        // callback(null);
                        done();

                    });

                }],
            function(err, results){
            });

    });

    test('Create New Group', function(done) {
        var req =
            {
                body:
                    {
                        groupname:"doit",
                        users:"Mike",
                        description:"1"
                    }
            }
        Groups.create(req,function (callback) {
            expect(200).to.be.equal(callback);
            done();
        })
    });

    test('Create New Group with Same Group Name', function(done) {
        var req ={
                body:{
                        groupname:"doit",
                        users:"Mike",
                        description:"1"
                    }
            }
        Groups.create(req,function (callback) {
            expect(201).to.be.equal(callback);
            done();
        })
    });

    test('Create New Group with not valid user', function(done) {
        var req =
            {
                body:
                    {
                        groupname:"doitAgain",
                        users:"Mike,dAVID",
                        description:"1"
                    }
            }
        Groups.create(req,function (callback) {
            expect(202).to.be.equal(callback);
            done();
        })
    });

    test('List All Groups', function(done) {
        Groups.list(function (docs) {
            // expect(200).to.be.equal(callback);
            expect(2).to.be.equal(docs.length);
            expect("Hello").to.be.equal(docs[0].groupname);
            expect("doit").to.be.equal(docs[1].groupname);
            done();
        })
        User.RetrieveOne('David',function(code,docs){

        });
    });


    test('Enter One Group', function(done) {
        var req=
            {
                body:
                    {
                        groupname:"Hello",
                        username:"David"
                    }
            }
        Groups.enter(req,function (callback) {
            // expect(200).to.be.equal(callback);
            expect(200).to.be.equal(callback);
            Groups.list(function (docs) {
                expect("Hello").to.be.equal(docs[0].groupname);
                expect("doit").to.be.equal(docs[1].groupname);
                expect("Nancy,David").to.be.equal(docs[0].users);
                done();
            })


        })
    });


    test('Leave One Group', function(done) {
        var req=
            {
                body:
                    {
                        groupname:"Hello",
                        username:"David"
                    }
            }
        Groups.leave(req,function (callback) {
            // expect(200).to.be.equal(callback);
            expect(200).to.be.equal(callback);
            Groups.list(function (docs) {
                expect("Hello").to.be.equal(docs[0].groupname);
                expect("doit").to.be.equal(docs[1].groupname);
                expect("Nancy").to.be.equal(docs[0].users);
                done();
            })


        })
    });


    test('Leave One Group with only one member', function(done) {
        var req=
            {
                body:
                    {
                        groupname:"Hello",
                        username:"Nancy"
                    }
            }
        Groups.leave(req,function (callback) {
            // expect(200).to.be.equal(callback);
            expect(201).to.be.equal(callback);
            Groups.list(function (docs) {
                expect(1).to.be.equal(docs.length);
                // expect("Hello").to.be.equal(docs[0].groupname);
                expect("doit").to.be.equal(docs[0].groupname);
                // expect("Nancy").to.be.equal(docs[0].users);
                done();
            })


        })
    });

    test('Check exist Group', function(done) {
        Groupmessages.IfExist("doit",function (cb) {
            // expect(200).to.be.equal(callback);
            expect(1).to.be.equal(cb);
            done();
        })
    });

    test('Check not exist Group', function(done) {
        Groupmessages.IfExist("Hello",function (cb) {
            // expect(200).to.be.equal(callback);
            expect(0).to.be.equal(cb);
            done();
        })
    });



    test('Post Message', function(done) {
        var req =
            {
                body:
                    {
                        groupname:"doit",
                        username:"Mike",
                        content:"asddsa"
                    }
            };
        Groupmessages.Send(req,function (cb) {
            expect(201).to.be.equal(cb);
            done();
        })
    });

    test('Post Message to unvalid group', function(done) {
        var req =
            {
                body:
                    {
                        groupname:"Hello",
                        username:"Mike",
                        content:"asddsa"
                    }
            };
        Groupmessages.Send(req,function (cb) {
            expect(404).to.be.equal(cb);
            done();
        })
    });

    test('Retrieve from unvalid group', function(done) {
        var req =
            {
                params:
                    {
                        groupname:"Hello"
                    },
                body:
                    {
                        groupname:"Hello",
                        username:"Mike",
                        content:"asddsa"
                    }
            };
        Groupmessages.RetrieveMessages(req,function (cb) {
            expect(404).to.be.equal(cb);
            done();
        })
    });


    test('Retrieve groupmessages', function(done) {
        var req =
            {
                params:
                    {
                        groupname:"doit"
                    },
                body:
                    {
                        groupname:"Hello",
                        username:"Mike",
                        content:"asddsa"
                    }
            };
        Groupmessages.RetrieveMessages(req,function (cb,docs) {
            expect(200).to.be.equal(cb);
            expect(1).to.be.equal(docs.length);

            expect("asddsa").to.be.equal(docs[0].content);
            done();
        })
    });


    suiteTeardown('Database Delete',function(done) {
        mongod.remove();
        done();
    });

});
