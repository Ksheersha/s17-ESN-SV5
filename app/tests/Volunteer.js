/**
 * Created by sheersha on 4/20/17.
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

    test('Set Choice', function(done) {
        request(app)
            .post('/users/Nancy/choice/Medicines')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                done();
            });
    });

    test('Set Choice User does not Exist', function(done) {
        request(app)
            .post('/users/NancyDeny/choice/Others')
            .send({username : 'NancyDeny',password:'123456'})
            .end(function(err, res){
                expect(err).to.be.null;
                expect(404).to.equal(res.statusCode);
                done();
            });
    });

    test('Get Choice', function(done) {
        request(app)
            .get('/users/Nancy/choice')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(200).to.equal(res.statusCode);
                expect(1).to.equal(res.body.length);
                done();
            });
    });

    test('Get Choice User does not Exist', function(done) {
        request(app)
            .get('/users/NancyDeny/choice')
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
