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
var Public_message = require('../model/messages')
var Help_provider = require('../model/helpprovider')
suite('Unit Test: Help Provider', function () {
    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().

    var user = User.User;
    var public_message = Public_message.Messages;
    var help_provider = Help_provider.HelpProviders;

    suiteSetup('Database Setup', function (done) {

        async.waterfall([
                function (callback) {
                    var data1 = {
                        username: 'David',
                        password: '123456',
                        email: '32@qwe',
                        online: true
                    }
                    var newUser1 = new user(data1);
                    newUser1.save(function (err, docs) {
                        // console.log(1);
                        callback(null);
                    });

                },
                function (callback) {
                    var data2 = {
                        username: 'Mike',
                        password: '123456',
                        email: '32@qwe',
                        online: true
                    }
                    var newUser2 = new user(data2);
                    newUser2.save(function (err, docs) {
                        // console.log(2);
                        callback(null);
                    });

                },
                function (callback) {

                    var data3 = {
                        username: 'Nancy',
                        password: '123456',
                        email: '32@qwe',
                        online: true
                    }
                    var newUser3 = new user(data3);
                    newUser3.save(function (err, docs) {
                        // console.log(3);
                        callback(null);
                    });
                },
                function (callback) {
                    var data = {
                        username: 'Nancy',
                        Address: 'street1',
                        HelpType:'Blankets/Clothes',
                        Comments: 'blankets'

                    };
                    var newHelpProvider = new help_provider(data);
                    newHelpProvider.save(function (err, docs) {
                        done();
                    });

                },
                function (callback) {
                    var data = {
                        username: 'Mike',
                        Address: 'street13',
                        HelpType:'Physician/Medicine',
                        Comments: 'First-aid kits available'

                    };
                    var newHelpProvider = new help_provider(data);
                    newHelpProvider.save(function (err, docs) {
                        done();
                    });

                },
                function (callback) {
                    var data = {
                        username: 'Mike',
                        Address: 'street14',
                        HelpType:'Shelter',
                        Comments: '50 spaces available'

                    };
                    var newHelpProvider = new help_provider(data);
                    newHelpProvider.save(function (err, docs) {
                        done();
                    });

                }
            ],
            function (err, results) {
                // results is now equal to ['one', 'two']
            });

    });
/*

    test('Register User', function (done) {
        var req = {
            body: {
                username: "New provider",
                Address: "door2",
                HelpType:"Others",
                Comments: "vehicle available"
            }
        }
        Help_provider.Post(req, function (code) {
            expect(201).to.equal(code);
            done();
        })
    }); */

  /*  test('Retrieve Message from User', function (done) {
        Public_message.RetrieveOne("Nancy", function (code, record) {
            console.log("123321");
            expect(200).to.equal(code);
            expect(1).to.equal(record.length);
            expect("Hello").to.equal(record[0].content);
            done();
        });
    });
*/
/*
    test('Retrieve Message from User not Exist', function (done) {
        Public_message.RetrieveOne("Mike", function (code, record) {
            expect(404).to.equal(code);
            done();
        });
    });
*/
    test('Retrieve ALL Message - address', function (done) {
        Help_provider.RetrieveAll(function (record) {
            expect(1).to.equal(record.length);
            expect("street1").to.equal(record[0].Address);
            done();
        })
    });

    test('Retrieve ALL Message - comments', function (done) {
        Help_provider.RetrieveAll(function (record) {
            expect(1).to.equal(record.length);
            expect("blankets").to.equal(record[0].Comments);
            done();
        })
    });
    test('Retrieve ALL Message - HelpType ', function (done) {
        Help_provider.RetrieveAll(function (record) {
            expect(1).to.equal(record.length);
            expect("Blankets/Clothes").to.equal(record[0].HelpType);
            done();
        })
    });

    test('Retrieve ALL Message - comments unavailable', function (done) {
        Help_provider.RetrieveAll(function (record) {
            expect(1).to.equal(record.length);
            expect("unavailable").to.not.equal(record[0].Comments);
            done();
        })
    });

  /*  test('Send Message', function (done) {
        var req = {
            body: {
                username: "Nancy",
                content: "HelloWorld"
            }
        }
        Public_message.Post(req, function (code) {
            expect(201).to.equal(code);
            done();
        })
    });
*/
/*
    test('Retrieve ALL Message', function (done) {
        Public_message.RetrieveAll(function (record) {
            expect(2).to.equal(record.length);
            expect("HelloWorld").to.equal(record[1].content);
            done();
        })
    });
*/
test('Register User', function (done) {
    var req = {
        body: {
            username: 'New provider',
            Address: 'door2',
            HelpType:'Others',
            Comments: 'vehicle available'
        }
    }
    Help_provider.Post(req, function (code) {
        expect(201).to.equal(code);
        done();
    })
});

test('Invalid data - no address', function (done) {
    var req = {
        body: {
            username: 'New provider',
            HelpType:'Others',
            Comments: 'vehicle available'
        }
    }
    Help_provider.Post(req, function (code) {
        expect(404).to.equal(code);
        done();
    })
});

test('Invalid data - no name', function (done) {
    var req = {
        body: {
            Address: 'door2',
            HelpType:'Others',
            Comments: 'vehicle available'
        }
    }
    Help_provider.Post(req, function (code) {
        expect(404).to.equal(code);
        done();
    })
});

test('Invalid data - no HelpType', function (done) {
    var req = {
        body: {
            username: 'New provider',
            Address: 'door2',
            Comments: 'vehicle available'
        }
    }
    Help_provider.Post(req, function (code) {
        expect(404).to.equal(code);
        done();
    })
});

test('Invalid data - no Comments', function (done) {
    var req = {
        body: {
            username: 'New provider',
            Address: 'door2',
              HelpType:'Others'
        }
    }
    Help_provider.Post(req, function (code) {
        expect(404).to.equal(code);
        done();
    })
});
    suiteTeardown('Database Delete', function (done) {
        mongod.remove();
        done();
    });

});
