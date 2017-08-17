/*
Copyright (C) 2017 Expedia Inc. All Rights Reserved.
See LICENSE.txt for this sample’s licensing information

Abstract:
MongoDB helper for connecting to the database.
*/

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

exports.foo = function() {
  console.log("foo created!");
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
    db.createCollection("customers", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}

exports.insert = function(companyName) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myobj = { name: companyName, address: "Highway 37"+companyName };
    db.collection("customers").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
  });
}

exports.find = function(query) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("customers").findOne(query, function(err, result) {
      if (err) throw err;
      console.log(result);
      console.log("Name: " + result.name);
      db.close();
    });
  });
}

exports.update = function(query) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var addr = "Canyon 125"+query.companyName;
    var newvalues = { $set: { address: addr}};
    db.collection("customers").updateOne(query, newvalues, function(err, res) {
      if (err) throw err;
      console.log("Number of documents updated: " + res.result.nModified);
      db.close();
    });
  });
}

exports.destroyCollection = function() {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("customers").drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
      db.close();
    });
  });
}
