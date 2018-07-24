/**
 * Created by Yuxin Wei on 4/17/2017.
 */

'use strict';
var sd = require('silly-datetime');
var mongoose = require('mongoose');
var User = require("./users");
var async = require("async");

class Chatgroup {
    constructor() {
        var Schema = mongoose.Schema;
        var chatgroup_Schema = new Schema({
            groupname: {type: String, required: true},
            users: String,
            description: String
        });
        var chatgroup = mongoose.model('chatgroup', chatgroup_Schema);
        this.chatgroup = chatgroup;
    }

    list(callback) {
        this.chatgroup.find({}, null, {}, function (err, docs) {
            return callback(docs);
        })
    }

    enter(req, callback) {
        var chatgroup = this.chatgroup;
        this.chatgroup.findOne({groupname: req.body.groupname}, function (err, docs) {
            var str = docs.users;
            var pd = true;
            str.split(",").forEach(function (a) {
                if (a == req.body.username) {
                    pd = false;
                    return;
                }
            })
            if (pd) str = str + "," + req.body.username;
            var condition = {groupname: req.body.groupname},
                update = {$set: {users: str}},
                options = {multi: false};
            chatgroup.update(condition, update, options, function (err, cb) {
                if (err) console.log("err in update status-chat group:" + err);
                return callback(200);
            });

        });
    }


    leave(req, callback) {
        var chatgroup = this.chatgroup;
        this.chatgroup.findOne({groupname: req.body.groupname}, function (err, docs) {
            var UserArray = docs.users.split(",");
            if (UserArray.length == 1) {
                chatgroup.remove({groupname: req.body.groupname}, function (cb) {
                    return callback(201);
                });
            }
            else {
                var str = docs.users;
                while (str != str.replace(',' + req.body.username, "")) str = str.replace(',' + req.body.username, "");

                while (str != str.replace(req.body.username + ',', "")) str = str.replace(req.body.username + ',', "");

                if (str == req.body.username) {
                    chatgroup.remove({groupname: req.body.groupname}, function (cb) {
                        return callback(201);
                    });
                }
                var condition = {groupname: req.body.groupname},
                    update = {$set: {users: str}},
                    options = {multi: false};
                chatgroup.update(condition, update, options, function (err, cb) {
                    if (err) console.log("err in update status-leave:" + err);
                    return callback(200);
                });
            }
        });
    }

    create(req, callback) {
        var chatgroup = this.chatgroup;
        this.chatgroup.find({groupname: req.body.groupname}, function (err, docs) {
            if (docs.length != 0) return callback(201); // group name already exist
            else {
                var data = {
                    groupname: req.body.groupname,
                    users: req.body.users,
                    description: req.body.description
                }
                var UserArray = data.users.split(",");
                var pd = 200;
                async.waterfall([
                        function (callback1) {
                            var i = 0;
                            UserArray.forEach(function (cur) {
                                User.IfExist(cur, function (res) {
                                    if (res == 0) {
                                        pd = 202;

                                        return callback1(null, 202);
                                    }
                                    else if (i == UserArray.length - 1 && pd == 200) {

                                        return callback1(null, 200);
                                    }
                                    i++;
                                });
                            })

                        },
                        function (callback1, callback2) {

                            // console.log("function2");
                            if (callback1 == 202) {
                                // console.log("get 202 in callback 2");
                                return callback2(null, 202);
                            }
                            else {

                                var newGroup = chatgroup(data);
                                newGroup.save(function (err) {
                                    if (err) {

                                        return callback2(null, 203);
                                    }
                                    else {

                                        return callback2(null, 200);
                                    }
                                })

                            }
                        }

                    ],
                    function (err, results) {
                        return callback(results);
                    });
            }


        });
    }


}

module.exports = new Chatgroup();
