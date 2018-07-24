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

suite('Chat Publicly', function() {
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
    // use describe to give a title to your test suite, in this case the tile is "Account"
    // and then specify a function in which we are going to declare all the tests
    // we want to run. Each test starts with the function it() and as a first argument
    // we have to provide a meaningful title for it, whereas as the second argument we
    // specify a function that takes a single parameter, "done", that we will use
    // to specify when our test is completed, and that's what makes easy
    // to perform async test!


    test('Send Message1', function(done) {
        request(app)
            .post('/messages/public')
            .send({username:'Nancy',content:'Helloworld!'})
            .end(function(err, res){
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                done();
            });
    });


    test('Send Message2', function(done) {
        request(app)
            .post('/messages/public')
            .send({username:'Nancy',content:'Helloworld!'})
            .end(function(err, res){
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                done();
            });
    });

    test('Send Message3', function(done) {
        request(app)
            .post('/messages/public')
            .send({username:'Nancy',content:'Helloworld!'})
            .end(function(err, res){
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                done();
            });
    });

    test('Send Message4', function(done) {
        request(app)
            .post('/messages/public')
            .send({username:'Nancy',content:'Helloworld!'})
            .end(function(err, res){
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                done();
            });
    });


    test('Send Message with Wrong User', function(done) {
        request(app)
            .post('/messages/public')
            .send({username:'Nancyy',content:'Helloworld!'})
            .end(function(err, res){
                expect(err).to.be.null;
                expect(404).to.equal(res.statusCode);
                done();
            });
    });


    test('Retrieve All Messages', function(done) {
        request(app)
            .get('/messages/public')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(4).to.equal(res.body.length);
                done();
            });
    });

    test('Retrieve Messages by User', function(done) {
        request(app)
            .get('/messages/public/Nancy')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(200).to.equal(res.statusCode);
                expect(4).to.equal(res.body.length);
                done();
            });
    });

    test('Retrieve Messages by User not Exist', function(done) {
        request(app)
            .get('/messages/public/Nancydeny')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(404).to.equal(res.statusCode);
                expect(0).to.equal(res.body.length);
                done();
            });
    });

    suiteTeardown('Database Delete',function(done) {
        mongod.remove();
        done();
    });

});
