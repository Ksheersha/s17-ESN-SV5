/**
 * Created by Yuxin Wei on 2/27/2017.
 */


'use strict';
var mongoose = require('mongoose');
var sd = require('silly-datetime');

class UserClass {

    constructor() {
        var Schema = mongoose.Schema;
        var User_Schema = new Schema({
            username: String,
            password: String,
            email: String,
            status: String,
            online: Boolean,
            status_timestamp: Date,
            account_status: {type: String, default: "Active"},
            privilege_level: {type: String, default: "Citizen"},
            choice: {type: String, default: "none"}
        });
        var User = mongoose.model('User', User_Schema);
        this.mongoose = mongoose;
        this.Schema = Schema;
        this.User_Schema = User_Schema;
        this.User = User;
    }

    IfExist(username, callback) {
        this.User.find({username: username}, function (err, docs) {
            if (docs.length === 0) return callback(0);
            else return callback(1);
        });
    }

    SetStatus(username, statusCode, callback) {
        var User = this.User;
        var time = sd.format(new Date());
        this.IfExist(username, function (res) {
            if (res === 0) return callback(404);
            User.findOne({username: username}, function (err, docs) {

                var condition = {username: username},
                    update = {$set: {status: statusCode, status_timestamp: time}},
                    options = {multi: false};
                User.update(condition, update, options, function (err) {
                    console.log("err in update status:" + err);
                });
                if (err) return callback(err)
                else return callback(201);

            });
        });
    }

    GetStatus(username, callback) {
        var User = this.User;

        this.IfExist(username, function (res) {
            console.log("req.body.username model: " + username);
            if (res === 0) return callback(404)
            else {

                User.find({username: username}, function (err, docs) {
                    if (docs.length === 0) return callback(404, docs);
                    else return callback(200, docs);

                });
            }
        });
    }


    Login(req, callback) {
        var User = this.User;
        this.IfExist(req.body.username, function (res) {
            if (res === 0) return callback(202);
            User.findOne({username: req.body.username}, function (err, docs) {
                if (docs.account_status === 'Inactive') return callback(405);
                if (docs.password != req.body.password) return callback(201);
                if (docs.online) return callback(200);

                var condition = {username: req.body.username},
                    update = {$set: {online: true}},
                    options = {multi: true};
                User.update(condition, update, options, function (err) {
                });
                return callback(200);
            });
        })
    }

    Regist(req, callback) {
        var User = this.User;
        var stopwords = new Array("about", "access", "account", "accounts", "add", "address", "adm", "admin", "administration", "adult", "advertising", "affiliate", "affiliates", "ajax", "analytics", "android", "anon", "anonymous", "api", "app", "apps", "archive", "atom", "auth", "authentication", "avatar", "", "backup", "banner", "banners", "bin", "billing", "blog", "blogs", "board", "bot", "bots", "business", "", "chat", "cache", "cadastro", "calendar", "campaign", "careers", "cgi", "client", "cliente", "code", "comercial", "compare", "config", "connect", "contact", "contest", "create", "code", "compras", "css", "D", "dashboard", "data", "db", "design", "delete", "demo", "design", "designer", "dev", "devel", "dir", "directory", "doc", "docs", "domain", "download", "downloads", "E", "edit", "editor", "email", "ecommerce", "F", "forum", "forums", "faq", "favorite", "feed", "feedback", "flog", "follow", "file", "files", "free", "ftp", "G", "gadget", "gadgets", "games", "guest", "group", "groups", "H", "help", "home", "homepage", "host", "hosting", "hostname", "html", "http", "httpd", "https", "hpg", "I", "info", "information", "image", "img", "images", "imap", "index", "invite", "intranet", "indice", "ipad", "iphone", "irc", "J", "java", "javascript", "job", "jobs", "js", "K", "knowledgebase", "L", "log", "login", "logs", "logout", "list", "lists", "M", "mail", "mail1", "mail2", "mail3", "mail4", "mail5", "mailer", "mailing", "mx", "manager", "marketing", "master", "me", "media", "message", "microblog", "microblogs", "mine", "mp3", "msg", "msn", "mysql", "messenger", "mob", "mobile", "movie", "movies", "music", "musicas", "my", "N", "name", "named", "net", "network", "new", "news", "newsletter", "nick", "nickname", "notes", "noticias", "ns", "ns1", "ns2", "ns3", "ns4", "O", "old", "online", "operator", "order", "orders", "P", "page", "pager", "pages", "panel", "password", "perl", "pic", "pics", "photo", "photos", "photoalbum", "php", "plugin", "plugins", "pop", "pop3", "post", "postmaster", "postfix", "posts", "profile", "project", "projects", "promo", "pub", "public", "python", "R", "1", "Tweet", "(http://twitter.com/share)", "random", "register", "registration", "root", "ruby", "rss", "S", "sale", "sales", "sample", "samples", "script", "scripts", "secure", "send", "service", "shop", "sql", "signup", "signin", "search", "security", "settings", "setting", "setup", "site", "sites", "sitemap", "smtp", "soporte", "ssh", "stage", "staging", "start", "subscribe", "subdomain", "suporte", "support", "stat", "static", "stats", "status", "store", "stores", "system", "T", "tablet", "tablets", "tech", "telnet", "test", "test1", "test2", "test3", "teste", "tests", "theme", "themes", "tmp", "todo", "task", "tasks", "tools", "tv", "talk", "U", "update", "upload", "url", "user", "username", "usuario", "usage", "V", "vendas", "video", "videos", "visitor", "W", "win", "ww", "www", "www1", "www2", "www3", "www4", "www5", "www6", "www7", "wwww", "wws", "wwws", "web", "webmail", "website", "websites", "webmaster", "workshop", "X", "xxx", "xpg", "Y", "you", "yourname", "yourusername", "yoursite", "yourdomain");
        if (req.body.username.length < 3 || req.body.password.length < 4 || stopwords.indexOf(req.body.username) > -1) {
            return callback(405);
        }

        this.IfExist(req.body.username, function (res) {
            if (res === 0) {
                var data = {
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    status: req.body.status,
                    online: true
                }
                var newUser = User(data);
                newUser.save();
                return callback(201);
            }

            else {
                return callback(200);
            }
        });

    }


    Logout(name, callback) {

        var User = this.User;

        User.findOne({username: name}, function (err, docs) {
            if (docs === null) return callback(404);
            if (docs.online === false) return callback(201);
            var condition = {username: name},
                update = {$set: {online: false}},
                options = {multi: true};
            User.update(condition, update, options, function (err) {
                return callback(200);
            });
        });
    }


    RetrieveAll(callback) {
        this.User.find({}, null, {sort: {'online': -1, "username": 1}}, function (err, docs) {
            callback(docs);
        })
    }


    RetrieveOne(name, callback) {
        this.User.find({username: name}, function (err, docs) {
            if (docs.length === 0) return callback(404, docs);
            else return callback(200, docs);
        })
    }


    SetChoice(username, choice, callback) {
        var User = this.User;
        this.IfExist(username, function (res) {
            if (res === 0) return callback(404);
            User.findOne({username: username}, function (err, docs) {

                var condition = {username: username},
                    update = {$set: {choice: choice}},
                    options = {multi: false};
                User.update(condition, update, options, function (err) {
                    console.log("err in update choice:" + err);
                });
                if (err) return callback(err)
                else return callback(201);

            });
        });
    }
    GetChoice(username, callback) {
        var User = this.User;

        this.IfExist(username, function (res) {
            console.log("get choice req: " + username);
            if (res === 0) return callback(404)
            else {

                User.find({username: username}, function (err, docs) {
                    console.log("get choice find: " + username);
                    if (docs.length === 0) return callback(404, docs);
                    else return callback(200, docs);

                });
            }
        });
    }
    

    GetActive(callback) {
        this.User.find({account_status: 'active'}, function (err, docs) {
            return callback(docs)
        })
    }


    GetInactive(callback) {
        this.User.find({account_status: 'inactive'}, function (err, docs) {
            return callback(docs)
        })
    }


    Active(name, callback) {
        var User = this.User;
        this.IfExist(name, function (res) {
            if (res === 0) return callback(404)
            else {
                var condition = {username: name},
                    update = {$set: {account_status: 'active'}},
                    options = {multi: true};
                User.update(condition, update, options, function (err) {
                    return callback(200);

                });
            }
        });
    }


    Deactive(name, callback) {
        var User = this.User;
        this.IfExist(name, function (res) {
            if (res === 0) return callback(404)
            else {
                var condition = {username: name},
                    update = {$set: {account_status: 'inactive'}},
                    options = {multi: true};
                User.update(condition, update, options, function (err) {
                    return callback(200);

                });
            }
        });
    }


    Update(name, req, callback) {
        console.log("enter");
        var User = this.User;
        var that = this;
        var newName = req.body.username;

        var announcement = require('./announcements');
        var messages = require('./messages');
        var privatemessages = require('./private_messages');
        var groupchat = require('./groupchat_messages');
        this.IfExist(name, function (res) {
            if (res === 0) return callback(404)
            else {
                that.IfExist(newName, function (res) {
                    if (res == 1 && newName != name) return callback(403)
                    else {
                        var condition = {username: name},
                            update = {
                                $set: {
                                    account_status: req.body.account_status,
                                    username: req.body.username,
                                    password: req.body.password,
                                    privilege_level: req.body.privilege_level
                                }
                            },
                            options = {multi: true};

                        User.update(condition, update, options, function (err) {

                        });
                        var update1 = {$set: {username: newName}};
                        announcement.Announcements.update(condition, update1, options, function (err) {
                        })

                        messages.Messages.update(condition, update1, options, function (err) {
                        })

                        groupchat.groupchat_message.update(condition, update1, options, function (err) {
                        })

                        var update2 = {$set: {sendingUserName: newName}};
                        var condition2 = {sendingUserName: name};
                        privatemessages.PrivateMessages.update(condition2, update2, options, function (err) {
                        })

                        var update3 = {$set: {receivingUserName: newName}};
                        var condition3 = {receivingUserName: name};
                        privatemessages.PrivateMessages.update(condition3, update3, options, function (err) {
                        })
                        return callback(200);
                        //update other table!!
                    }
                })

            }
        })
    }

}


module.exports = new UserClass();
