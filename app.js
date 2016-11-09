var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var readline = require('readline');
var _ = require('lodash');
var routes = require('./routes/index');
var users = require('./routes/users');
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var request = require('request');
// var cheerio = require('cheerio');
var jsdom = require('jsdom');
// var populateFrame = require('populateFrame');
var bygones = require('./data/bygones.js');
var sounds = require('./data/sounds.js');
var frame = require('./data/sample_report.js');
var moment = require('moment');
var bg = bygones();
var app = express();
// var baseSounds = sounds.baseSounds();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var filebase = "./data/raw_html/";

var jsonBygones = function() {
    _.forEachRight(bg, function(value, key) {
        setTimeout(function() {
            populateFrame(value.id);
        }, 100 * key);
        // populateFrame(value.id);
    });
};

var url = 'mongodb://localhost:27017';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    // db.collection('documents').find({loc: {
    //      $geoWithin: {
    //           $centerSphere: [[-122.598970, 45.537148], 10 / 3963.2]
    //      }
    // }}).toArray(function(err,r) {
    //      if (err) {
    //           console.log('error', err);
    //      } else {
    //           console.log(r.length);
    //      }
    // });
    // db.collection('documents').createIndex({loc: "2dsphere"}, function() {
    //      getDbStats(db, function() {
    //           db.close();
    //      });
    // });
    // insertDocuments(db, function() {
    //      getDbStats(db, function() {
    //         db.close();
    //     });
    // });
    getDbStats(db, function() {
        db.close();
    });
    // findDocuments(db, function() {
    //     getDbStats(db, function() {
    //         db.close();
    //     });
    // });
    // delAll(db, function() {
    //     db.close();
    // });

});

var delAll = function(db, callback) {
    var col = db.collection('documents');
    col.deleteMany({}, function(err, r) {
        if (err) {
            console.log('error', err);
        } else {
            console.log(r);
        }
    });
};
// set up a command function
var getDbStats = function(db, callback) {
    db.command({
            'dbStats': 1
        },
        function(err, results) {
            console.log(results);
            callback();
        }
    );
};

var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    var bulk = collection.initializeOrderedBulkOp();
    // var finished = _.after(bg.length, function() {
    //      console.log('finished inserting all documents');
    //      getDbStats(db, function() {
    //           db.close();
    //      })
    //  //    bulk.execute(function(err, result) {
    //  //        assert.equal(null, err);
    //  //        getDbStats(db, function() {
    //  //             db.close();
    //  //        });
    //  //    });
    // });
    _.forEach(bg, function(value, key) {
        var caseid = value.id;
        var caseloc = value.loc;
        var person = {
            "id": caseid,
            "loc": {
                type: "Point",
                coordinates: [caseloc[1], caseloc[0]]
            }
        };
        //     var caseid = value.id;
        //     console.log('caseid is ' + caseid);
        //     console.log('key is ' + key);
        collection.find({
            caseid: caseid
        }).toArray(function(err, r) {
            if (err) {
                console.log('error', err);
            } else {
                if (r.length === 0) {
                    fs.readFile('./data/json/' + value.id + '.json', 'utf8', function(err, data) {
                        console.log('VALUE PASSED TO READFILE: ' + JSON.stringify(person));
                        if (err) {
                            // console.log('error', err);
                        } else {
                            var jsonFile = JSON.parse(data);
                            // console.log(data);
                            jsonFile.caseid = person.id;
                            jsonFile.loc = person.loc;
                            console.log(jsonFile);
                            console.log('Key: ' + key);
                            collection.insert(jsonFile, function() {
                                getDbStats(db, function() {
                                    db.close();
                                });
                            });
                            // bulk.insert(jsonFile);
                            // finished();
                        }
                    });
                }
                console.log(r);
                callback(r);
            }
        });
        //    if (value.id !== undefined) {
        //   fs.readFile('./data/json/' + value.id + '.json', 'utf8', function(err, data) {
        //        console.log('VALUE PASSED TO READFILE: ' + JSON.stringify(person));
        //       if (err) {
        //           // console.log('error', err);
        //       } else {
        //           var jsonFile = JSON.parse(data);
        //           // console.log(data);
        //           jsonFile.caseid = person.id;
        //           jsonFile.loc = person.loc;
        //           console.log(jsonFile);
        //           console.log('Key: ' + key);
        //           collection.insert(jsonFile, function() {
        //                finished();
        //           })
        //           // bulk.insert(jsonFile);
        //           // finished();
        //       }
        //   });
        //    }

    });
};

// var fau = function(db, callback) {
//         var collection = db.collection('documents');
//         collection.findOneAndUpdate({
//                 case_report_title: 'Case Report - NamUs UP # 5845'
//             }, {
//                 $set: {
//                     b: 1
//                 }
//             }, {
//                 returnOriginal: false,
//                 sort: [
//                     [a, 1]
//                 ],
//                 upsert: true
//             }, function(err, r) {
//                 assert.equal(null, err);
//                 assert.equal(1, r.value.b);
//             }
//         };

app.post('/currentposition', function(req, res, next) {
    console.log(req.body);
    var pos = req.body;
    var lat = parseFloat(pos.lat);
    var lon = parseFloat(pos.lng);
    console.log("Lat = " + lat);
    console.log("Lon = " + lon);
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db.collection('documents').find({
            loc: {
                $geoWithin: {
                    $centerSphere: [
                        [lon, lat], 10 / 3963.2
                    ]
                }
            }
        }).toArray(function(err, r) {
            if (err) {
                console.log('error', err);
            } else {
                var accum = [];
                _.forEach(r, function(value, key) {
                    accum.push({"lat": value.loc.coordinates[1], "lng":value.loc.coordinates[0], "id": value.caseid});
                });
                console.log(accum);
                res.send({points:accum});
                console.log(r);
                db.close();
            }
        });
    });
});

app.post('/getall', function(req, res, next) {
    console.log(req.body);
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log('Connected correctly to server');
        db.collection('documents').find().toArray(function(err, r) {
            if (err) {
                console.log('error',err);
            } else {
                console.log(r);
                res.send(r);
                db.close();
            }
        });
    });
});

app.post('/getcases', function(req, res, next) {
    console.log(req.body);
    var ids = req.body.ids;
    console.log(ids);
    var array = ids.split(',');
    var caseids = [];
    for (var i = 0; i < array.length; i++) {
        if (parseInt(array[i]) > 0) {
            caseids.push(parseInt(array[i]));
        }
    }

    console.log(caseids);
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db.collection('documents').find({
            caseid : { $in: caseids}
        }).toArray(function(err, r) {
            if (err) {
                console.log('error', err);
            } else {
                console.log(r);
                res.send(r);
                // var accum = [];
                // _.forEach(r, function(value, key) {
                //     accum.push({"lat": value.loc.coordinates[1], "lng":value.loc.coordinates[0], "id": value.caseid});
                // });
                // console.log(accum);
                // res.send({points:accum});
                // console.log(r);
                db.close();
            }
        });
    });
});

var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    collection.find({
        case_report_title: 'Case Report - NamUs UP # 5845'
    }).toArray(function(err, docs) {
        assert.equal(err, null);
        //    assert.equal(1, result.ops.length);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
