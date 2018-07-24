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
var async = require("async");

suite('Chat Privately', function() {

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



    test('User1', function(done) {
        request(app)
            .get('/users/Mike')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(200).to.equal(res.statusCode);
                done();
            });
    });


    test('User2', function(done) {

        request(app)
            .get('/users/Nancy')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(200).to.equal(res.statusCode);
                done();
            });
    });

    test('User not exists', function(done) {

        request(app)
            .get('/users/sdfdsfadsf')
            .end(function(err, res){
                expect(err).to.exist;
                expect(404).to.equal(res.statusCode);
                done();
            });
    });

    test('Send a Message', function(done) {
        var chatContent = {
            sendingUserName:"Nancy",
            content:"Hello",
            receivingUserName:"Mike"
        };
        request(app)
            .post('/messages/private')
            .send(chatContent)
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                chatContent.Location = 'test location';
                request(app)
                    .post('/messages/private')
                    .send(chatContent)
                    .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(201).to.equal(res.statusCode);
                        chatContent.receivingUserName = 'ETC';
                        request(app)
                            .post('/messages/private')
                            .send(chatContent)

                            .end(function (err, res) {
                                expect(err).to.be.null;
                                expect(404).to.equal(res.statusCode);
                                chatContent.receivingUserName = 'Mike';
                                chatContent.sendingUserName = 'ETC';
                                request(app)
                                    .post('/messages/private')
                                    .send(chatContent)
                                    .end(function (err, res) {
                                        expect(err).to.be.null;
                                        expect(404).to.equal(res.statusCode);
                                        done();
                                    });
                            });
                    });
            });
    });

    test('Retrieve Message', function(done) {
        request(app)
            .get('/messages/private/Nancy/Mike')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                expect('Hello').to.equal(res.body[0].content);
                // console.log(res);
                request(app)
                    .get('/messages/private/adfafasdf/Mike')
                    .end(function(err, res) {
                        expect(err).to.be.null;
                        expect(404).to.equal(res.statusCode);
                        request(app)
                            .get('/messages/private/Nancy/asdfsadfasfd')
                            .end(function(err, res) {
                                expect(err).to.be.null;
                                expect(404).to.equal(res.statusCode);
                                done();
                            });
                    });

            });
    });

    // test('Retrieve All Messages',function(done){
    //     request(app)
    //         .get('/users/Nancy/private')
    //         .end(function(err, res){
    //             expect(err).to.be.null;
    //             expect(201).to.equal(res.statusCode);
    //             expect(1).to.equal(res.body.length);
    //             //console.log(res);
    //             expect('Mike').to.equal(res.body[0]);
    //             request(app)
    //                 .get('/users/Mike/private')
    //                 .end(function(err, res){
    //                     expect(err).to.be.null;
    //                     expect(201).to.equal(res.statusCode);
    //                     expect(1).to.equal(res.body.length);
    //                     //console.log(res);
    //                     expect('Nancy').to.equal(res.body[0]);
    //                     request(app)
    //                         .get('/users/Mack/private')
    //                         .end(function(err, res){
    //                             expect(err).to.be.null;
    //                             expect(404).to.equal(res.statusCode);
    //                             done();
    //                         });
    //                 });
    //         });
    // });
    suiteTeardown('Database Delete',function(done) {
        mongod.remove();
        done();
    });

});