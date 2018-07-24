/**
 * Created by skandwal on 3/20/2017.
 */
'use strict';
var sd = require('silly-datetime');
var mongoose = require('mongoose');
var User = require("./users");
class AnnouncementClass {
    constructor() {
        var Schema = mongoose.Schema;
        var Announcement_Schema = new Schema({
            username: {type: String, required: true},
            content: {type: String, required: true},
            timestamp: {type: Date, required: true},
            status: {type: String},
            location: {type: String},
            isPicture: {type: Boolean}
        });
        var Announcements = mongoose.model('Announcements', Announcement_Schema);
        this.Announcements = Announcements;
    }

    Post(req, callback) {
        var Announcements = this.Announcements;
        var time = sd.format(new Date());
        var data = {
            username: req.body.username,
            content: req.body.content,
            timestamp: time,
            isPicture: req.body.isPicture
        };
        var newAnnouncement = new Announcements(data);
        newAnnouncement.save();
 
        callback(201);
    }

    RetrieveAll(callback) {
        this.Announcements.find({},null,{'timestamp':-1}, function (err, docs) {
 
            callback(docs);
        })
    }

    RetrieveOne(name, callback) {
        this.Announcements.find({username: name}, function (err, docs) {
  
            if (docs.length === 0) callback(404, docs);
            else callback(200, docs);
        })
    }
}

module.exports = new AnnouncementClass();
