
var should = require('should');
var request = require('supertest');
var expect = require('expect.js');

var config = require('../config');
var mongod = require('../model/mongodb');
mongod.setURI(config.test.db);


var app = require('../app');
var agent = request.agent(app);
var User = require("../model/users");
var Help_provider = require("../model/helpprovider");

suite('Help Provider', function() {
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

        var data2 = {
            username: 'Mike',
            password: '123456',
            email: '32@qwe',
            online: true
        }
        var newUser2 = user(data2);

        var data3 = {
            username: 'Nancy',
            password: '123456',
            email: '32@qwe',
            online: false
        }
        var newUser3 = user(data3);

        newUser1.save(function (err, docs) {
            newUser2.save(function (err, docs) {
                newUser3.save(function (err, docs) {
                    // console.log(docs);
                    done();
                });

            });

        });
    });

    test('Register provider', function(done) {
        request(app)
            .post('/providers/registerhelp')
            .send({username:'Mike',Address:'street14',HelpType:'Shelter',Comments:'50 spaces available'})
            .end(function(err, res){
                expect(err).to.be.null;
                expect(201).to.equal(res.statusCode);
                done();
            });
    });

    test('Retrieve providers', function(done) {
        request(app)
            .get('/providers/gethelp')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(1).to.equal(res.body.length);
                done();
            });
    });


        suiteTeardown('Database Delete', function (done) {
            mongod.remove();
            done();
        });

});
