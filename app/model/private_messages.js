/**
 * Created by Yuxin Wei on 3/16/2017.
 */

'use strict';
var sd = require('silly-datetime');
var mongoose = require('mongoose');
var User = require("./users");
class PrivateMessageClass {
    constructor() {
        var Schema = mongoose.Schema;
        var PrivateMessages_Schema = new Schema({
            sendingUserName: { type: String, required: true },
            receivingUserName: { type: String, required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, required: true },
            status: { type: String },
            Location: { type: String },
            isPicture: { type: Boolean }
        });
        var PrivateMessages = mongoose.model('PrivateMessages', PrivateMessages_Schema);
        this.PrivateMessages = PrivateMessages;
    }

    SendPrivate(req, callback) {
        var PrivateMessages = this.PrivateMessages;
        User.IfExist(req.body.sendingUserName, function (res) {
            if (res) {
                User.IfExist(req.body.receivingUserName,function(ress){
                    if (ress)
                    {
                        var time = sd.format(new Date());
                        var data;
                        if (req.body.Location!=undefined)
                        {
                            data = {
                                sendingUserName: req.body.sendingUserName,
                                receivingUserName: req.body.receivingUserName,
                                content: req.body.content,
                                timestamp: time,
                                status: req.body.status,
                                Location: req.body.Location,
                                isPicture: req.body.isPicture
                            }
                        }
                        else data = {
                            sendingUserName: req.body.sendingUserName,
                            receivingUserName: req.body.receivingUserName,
                            content: req.body.content,
                            timestamp: time,
                            status: req.body.status,
                            isPicture: req.body.isPicture
                        };
                        var newPrivateMessage = new PrivateMessages(data);
                        newPrivateMessage.save();
                        callback(201);
                    }
                    else return callback(404);
                })

            }
            else {
                return callback(404);
            }
        });

    }

    RetrieveMessages(req, callback) {
        var PrivateMessages = this.PrivateMessages;
        var name1 = req.params.userName1;
        var name2 = req.params.userName2;
        User.IfExist(name1, function (res) {
            if (res) {
                User.IfExist(name2,function(ress){
                    if (ress)
                    {
                        PrivateMessages.find({$or:[{sendingUserName:name1,receivingUserName:name2},{sendingUserName:name2,receivingUserName:name1}]},null,{'timestamp':-1},function(err,docs){
                            return callback(201,docs);
                        });
                    }
                    else return callback(404,null);
                })

            }
            else {
                return callback(404,null);
            }
        });
    }



}

module.exports = new PrivateMessageClass();
