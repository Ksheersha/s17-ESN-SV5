/**
 * Created by 32842 on 4/27/2017.
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
var Private_Messages = require("../model/private_messages");
var async = require('async');

suite('Unit Test:　Admin Profile', function() {

    var user = User.User;
    var private_messages = Private_Messages.PrivateMessages;
    suiteSetup('Database Setup',function(done) {

        async.waterfall([
                function(callback){
                    var data1 = {
                        username: 'David',
                        password: '123456',
                        email: '32@qwe',
                        account_status : "active",
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
                        account_status : "active",
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
                        account_status : "active",
                        online: true
                    }
                    var newUser3 = new user(data3);
                    newUser3.save(function (err,docs) {
                        // console.log(3);
                        callback(null);
                    });

                },
            ],
            function(err, results){
                done();
                // results is now equal to ['one', 'two']
            });

    });

    test('Retrieve Active Users', function(done) {
       User.GetActive(function(callback){
            expect(3).to.equal(callback.length)
            done();
        });
    });

    test('Retrieve inActive Users', function(done) {
        User.GetInactive(function(callback){
            expect(0).to.equal(callback.length)
            done();
        });
    });

    test('Deactivate A User not Exist', function(done) {
        User.Deactive("Nancyy",function(callback){
            expect(404).to.equal(callback)
            done();
        });
    });

    test('Deactivate A User', function(done) {
        User.Deactive("Nancy",function(callback){
            expect(200).to.equal(callback)
            User.GetInactive(function(callback){
                expect(1).to.equal(callback.length);
                expect("Nancy").to.equal(callback[0].username);
                done();
            });
        });
    });

    test('Activate A User not Exist', function(done) {
        User.Active("Nancyy",function(callback){
            expect(404).to.equal(callback)
            done();
        });
    });

    test('Activate A User', function(done) {
        User.Active("Nancy",function(callback){
            expect(200).to.equal(callback)
            User.GetInactive(function(callback){
                expect(0).to.equal(callback.length);

                done();
            });
        });
    });

    test('Update a User not exist', function(done) {
        var req={
            body:
                {"username":112321,"password":"1234","privilege_level":"Admin","account_status":"inactive"}
        }
        User.Update("Nancyyy",req,function(callback){
            expect(404).to.equal(callback)
            done();
        });
    });


    test('Update a User to exist', function(done) {
        var req={
            body:
                {"username":"Mike","password":"1234","privilege_level":"Admin","account_status":"inactive"}
        }
        User.Update("Nancy",req,function(callback){
            expect(403).to.equal(callback)
            done();
        });
    });


    test('Update a User', function(done) {
        var req={
            body:
                {"username":"Miky","password":"1234","privilege_level":"Admin","account_status":"inactive"}
        }
        User.Update("Nancy",req,function(callback){
            expect(200).to.equal(callback)
            done();
        });
    });

    suiteTeardown('Database Delete',function(done) {
        //console.log("outt");
        mongod.remove();
        done();
    });

});