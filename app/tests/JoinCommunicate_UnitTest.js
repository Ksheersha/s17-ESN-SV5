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

suite('Unit Test: Join Community', function() {

    var user = User.User;
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
                        done();
                    });

                }
            ],
            function(err, results){
            });

    });

    test('User Retrieve All', function(done) {
        User.RetrieveAll(function(callback){
            expect(3).to.be.equal(callback.length);

            done();
        });
    });

    test('User Retrieve One', function(done) {
        User.RetrieveOne('David',function(code,docs){
            expect(200).to.be.equal(code);
            expect(1).to.be.equal(docs.length);
            expect("David").to.be.equal(docs[0].username);
            expect("32@qwe").to.be.equal(docs[0].email);
            done();
        });
    });

    test('User Retrieve One not Exist', function(done) {
        User.RetrieveOne('Davidd',function(code,docs){
            expect(404).to.be.equal(code);
            expect(0).to.be.equal(docs.length);
            done();
        });
    });


    test('User Not Exist Log in', function(done) {
        req = {
          body:{
              username:'Davidd',
              password:'19931225'
          }
        };
        User.Login(req,function (callback) {
            expect(202).to.be.equal(callback);
            done();
        })
    });

    test('User Log in', function(done) {
        req = {
            body:{
                username:'David',
                password:'123456'
            }
        };
        User.Login(req,function (callback) {
            expect(200).to.be.equal(callback);
            done();
        })
    });

    test('User Log out', function(done) {
        req = {
            body:{
                username:'David',
                password:'123456'
            }
        };
        User.Logout(req.body.username,function (callback) {
            expect(200).to.be.equal(callback);
            User.RetrieveOne('David',function(code,cb)
            {
                expect(200).to.be.equal(code);
                expect(false).to.be.equal(cb[0].online);
                done();
            });
        })
    });

    test('User not Exist Log out', function(done) {
        User.Logout('Davvd',function (callback) {
            expect(404).to.be.equal(callback);
            done();
        });
    });

    test('User already offline Log out', function(done) {
        User.Logout('David',function (callback) {
            expect(201).to.be.equal(callback);
            done();
        });
    });

    suiteTeardown('Database Delete',function(done) {
        mongod.remove();
        done();
    });

});