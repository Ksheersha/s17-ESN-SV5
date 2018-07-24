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

suite('Post Announcement', function() {
    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    suiteSetup('Database Setup',function(done) {
        var user = User.User;
        var data1 = {
            username: 'David',
            password: '123456',
            email: '32@qwe',
            online: true
        }
        var newUser1 = user(data1);
        newUser1.save(function (err,docs) {
        });
        var data2 = {
            username: 'Mike',
            password: '123456',
            email: '32@qwe',
            online: true
        }
        var newUser2 = user(data2);
        newUser2.save(function (err,docs) {

            done();
        });
        var data3 = {
            username: 'Nancy',
            password: '123456',
            email: '32@qwe',
            online: true
        }
        var newUser3 = user(data3);
        newUser3.save(function (err,docs) {
            // console.log(docs);
        });

    });

    test('No Annoucement in DB', function(done) {
        var waitTill = new Date(new Date().getTime() + 200);
        while(waitTill > new Date()){}
        request(app)
            .get('/messages/announcements')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(200).to.equal(res.statusCode);
                expect(0).to.equal(res.body.length);
                done();
            });
    });
    test('Send Annoucement1', function(done) {
        request(app)
            .post('/messages/announcements')
            .send({username:'Nancy',content:'Helloworld!'})
            .end(function(err, res){
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                done();
            });
    });


    test('Send Annoucement2', function(done) {
        request(app)
            .post('/messages/announcements')
            .send({username:'Nancy',content:'Helloworld!'})
            .end(function(err, res){
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                done();
            });
    });

    test('Send Annoucement3', function(done) {
        request(app)
            .post('/messages/announcements')
            .send({username:'Nancy',content:'Helloworld!'})
            .end(function(err, res){
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                done();
            });
    });

    test('Retrieve Annoucement', function(done) {
        var waitTill = new Date(new Date().getTime() + 200);
        while(waitTill > new Date()){}
        request(app)
            .get('/messages/announcements')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(200).to.equal(res.statusCode);
                expect(3).to.equal(res.body.length);
                done();
            });
    });

    suiteTeardown('Database Delete',function(done) {
        mongod.remove();
        done();
    });

});
