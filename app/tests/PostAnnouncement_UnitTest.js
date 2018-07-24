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
var Announcement = require("../model/announcements");
var async = require('async');
suite('Post Announcement', function() {
    var user = User.User;
    var announcement = Announcement.Announcements;
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
                        callback();
                        // console.log(3);

                    });

                },
                function (callback) {
                    var data = {
                        username:'Nancy',
                        content:'helloworld',
                        timestamp:'123'
                    }
                    var newAnnoucement = new announcement(data);
                    newAnnoucement.save(function () {

                        done();
                    });
                }
            ],
            function(err, results){
                // results is now equal to ['one', 'two']
            });

    });
    test('Send Annoucement', function(done) {
        req = {
            body:
                {
                    username:'Nancy',
                    content:'hello~'
                }
        }
        Announcement.Post(req,function (back) {
            expect(201).to.be.equal(back)
            done();
        })
    });


    test('Retrieve Annoucement', function(done) {
        Announcement.RetrieveAll(function (back) {
            expect(2).to.be.equal(back.length);
            expect('hello~').to.be.equal(back[1].content);
            done();
        })
    });

    test('Retrieve Annoucement from Single User', function(done) {
        Announcement.RetrieveOne('Nancy',function (code,back) {
            expect(2).to.be.equal(back.length);
            expect(200).to.be.equal(code);
            expect('hello~').to.be.equal(back[1].content);
            done();
        })
    });


    test('Retrieve Annoucement from non-Exist User', function(done) {
        Announcement.RetrieveOne('Nancyy',function (code,back) {
            expect(404).to.be.equal(code);
            done();
        })
    });

    suiteTeardown('Database Delete',function(done) {
        mongod.remove();
        done();
    });

});
