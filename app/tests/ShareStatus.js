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

suite('Share Status', function() {
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
                // results is now equal to ['one', 'two']
            });

    });

    test('Set Status', function(done) {
        request(app)
            .post('/users/Nancy/status/ok')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                done();
            });
    });

    test('Set Status not Exise', function(done) {
        request(app)
            .post('/users/NancyDeny/status/ok')
            .send({username : 'Nancy',password:'123456'})
            .end(function(err, res){
                expect(err).to.be.null;
                expect(404).to.equal(res.statusCode);
                done();
            });
    });

    test('Retireve Status', function(done) {
        request(app)
            .get('/users/Nancy/status')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(200).to.equal(res.statusCode);
                expect(1).to.equal(res.body.length);
                done();
            });
    });

    test('Retireve Status not Exise', function(done) {
        request(app)
            .get('/users/NancyDeny/status')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(404).to.equal(res.statusCode);
                done();
            });
    });

    suiteTeardown('Database Delete',function(done) {
        mongod.remove();
        done();
    });

});
