
var should = require('should');
var request = require('supertest');
var expect = require('expect.js');

var config = require('../config');
var mongod = require('../model/mongodb');
mongod.setURI(config.test.db);


var app = require('../app');
var agent = request.agent(app);
var User = require("../model/users");


suite('Join Community', function() {
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

        // use describe to give a title to your test suite, in this case the tile is "Account"
        // and then specify a function in which we are going to declare all the tests
        // we want to run. Each test starts with the function it() and as a first argument
        // we have to provide a meaningful title for it, whereas as the second argument we
        // specify a function that takes a single parameter, "done", that we will use
        // to specify when our test is completed, and that's what makes easy
        // to perform async test!

        test('Retrieve All existing Users', function (done) {
            request(app)
                .get('/users')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(200).to.equal(res.statusCode);
                    expect(3).to.equal(res.body.length);
                    done();
                });
        });

        test('New User Log in', function (done) {
            request(app)
                .get('/users/Miky')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(404).to.equal(res.statusCode);
                    done();
                });
        });

        test('Existing User Log In', function (done) {
            request(app)
                .post('/users/login')
                .send({username: 'Nancy', password: '123456'})
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(200).to.equal(res.statusCode);
                    done();
                });
        });
        test('Get Status history', function(done) {
            request(app)
               .get('/users/Nancy/statuscrumbs')
               .end(function(err, res){
                  expect(err).to.be.null;
                  expect(404).to.equal(res.statusCode);
                  done();
             });
       });
        test('User Log Out', function (done) {
            request(app)
                .post('/users/logout')
                .send({username: 'Nancy'})
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(200).to.equal(res.statusCode);
                    done();
                });
        });


        test('User Not Exist Log Out', function (done) {
            request(app)
                .post('/users/logout')
                .send({username: 'Sher'})
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(404).to.equal(res.statusCode);
                    done();
                });
        });


        test('User Not Online Log Out', function (done) {
            request(app)
                .post('/users/logout')
                .send({username: 'Nancy'})
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(201).to.equal(res.statusCode);
                    done();
                });
        });

        test('User Register', function (done) {
            request(app)
                .post('/users')
                .send({username: 'Macree', password: '123456'})
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(201).to.equal(res.statusCode);
                    done();
                });
        });

        test('User Exist Register', function (done) {
            request(app)
                .post('/users')
                .send({username: 'Macree', password: '123456'})
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(200).to.equal(res.statusCode);
                    done();
                });
        });

        test('Existing User Login incorrect password', function (done) {
            request(app)
                .post('/users/login')
                .send({username: 'Nancy', password: '1235'})
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(201).to.equal(res.statusCode);
                    done();
                });
        });

        test('User Login blank details', function (done) {
            request(app)
                .post('/users/login')
                .send({username: '', password: '12345'})
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(202).to.equal(res.statusCode);
                    request(app)
                        .post('/users/login')
                        .send({username: 'Nancy', password: ''})
                        .end(function (err, res) {
                            expect(err).to.be.null;
                            expect(201).to.equal(res.statusCode);
                            request(app)
                                .post('/users/login')
                                .send({username: '', password: ''})
                                .end(function (err, res) {
                                    expect(err).to.be.null;
                                    expect(202).to.equal(res.statusCode);
                                    done();
                                });
                        });
                });
        });

        // test('Check Logged In User in Directory', function (done) {
        //     request(app)
        //         .get('/users/:username')
        //         .end(function (err, res) {
        //             expect(err).to.be.null;
        //             expect("Nancy").part(res.body);
        //             expect("online").to.equal(res.body.online);
        //             done();
        //         });
        // });

        suiteTeardown('Database Delete', function (done) {
            mongod.remove();
            done();
        });

});
