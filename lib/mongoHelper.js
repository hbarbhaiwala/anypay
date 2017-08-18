/*
Copyright (C) 2017 Expedia Inc. All Rights Reserved.
See LICENSE.txt for this sample’s licensing information

Abstract:
MongoDB helper for connecting to the database.
*/

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MDB_URL || 'mongodb://localhost:27017/mydb';

exports.foo = function() {
  console.log("foo created: " + url);
}

exports.createDatabase = function() {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });
}

exports.createCollection = function() {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.createCollection("voyagerData", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}

exports.insert = function(data, res, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("voyagerData").insertOne(data, function(err, result) {
      if (err) throw err;
      if (callback != undefined) {
        callback(result, res);
      }
      console.log("Record added as "+result.insertedId);
      console.log("Number of documents inserted: " + result.insertedCount);
      db.close();
    });
  });
}

exports.find = function(query, res, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("voyagerData").findOne(query, function(err, result) {
      if (err) throw err;
      console.log(result);
      console.log("Name: " + result.name);
      if (callback != undefined) {
        callback(result, res);
      }
      db.close();
    });
  });
}

exports.update = function(query, data) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var newvalues = { $set: data};
    db.collection("voyagerData").updateOne(query, newvalues, function(err, res) {
      if (err) throw err;
      console.log("Number of documents updated: " + res.result.nModified);
      db.close();
    });
  });
}

exports.destroyCollection = function() {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("voyagerData").drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
      db.close();
    });
  });
}
