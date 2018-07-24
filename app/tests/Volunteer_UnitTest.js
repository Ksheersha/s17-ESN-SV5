/**
 * Created by sheersha on 4/19/17.
 */
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

suite('Volunteer', function() {
    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    var user = User.User;
    suiteSetup('Database Setup',function(done) {

        async.waterfall([
                function(callback){
                    var data1 = {
                        username: 'David',
                        password: '123456',
                        email: '32@qwe',
                        status: '1',
                        online: true,
                        choice:'none'
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
                        status: '2',
                        online: true,
                        choice:'Money'
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
                        status: '3',
                        online: true,
                        choice:'Food'
                    }
                    var newUser3 = new user(data3);
                    newUser3.save(function (err,docs) {
                        // console.log(3);
                        done();
                    });

                }
            ],
            function(err, results){
                // results is now equal to ['one', 'two']
            });

    });

    test('Get Choice', function(done) {
        async.waterfall([
            function (cb) {
                User.GetChoice('Nancy',function(cb,docs){
                    expect(200).to.be.equal(cb);
                    expect('3').to.be.equal(docs[0].status);
                    done();
                })
            }
        ]);
    });

    test('Get Choice User Does not Exist', function(done) {
        async.waterfall([
            function (cb) {
                User.GetChoice('Nancy1',function(cb,docs){
                    expect(404).to.be.equal(cb);
                      done();
                })
            }
        ]);
    });

    test('Set Choice User does not Exist', function(done) {
        async.waterfall([
            function (cb) {
                User.SetChoice('Nancy1','2',function(cb,docs){
                    expect(404).to.be.equal(cb);
                    // expect('3').to.be.equal(docs[0].status);
                    done();
                })
            }
        ]);
    });

    test('Set Choice', function(done) {
        async.waterfall([
            function (callback) {
                User.SetChoice('Nancy','Medicines',function(cb){
                    expect(201).to.be.equal(cb);
                    // expect('3').to.be.equal(docs[0].status);
                    callback(null);
                })
            },
            function (cb) {
                User.GetChoice('Nancy',function (cb,docs) {
                    expect(200).to.be.equal(cb);
                    expect('Medicines').to.be.equal(docs[0].choice);
                    done();
                })
            }
        ]);
    });


    suiteTeardown('Database Delete',function(done) {
        mongod.remove();
        done();
    });

});
