/*
Copyright (C) 2017 Expedia Inc. All Rights Reserved.
See LICENSE.txt for this sample’s licensing information

Abstract:
Sets up a simple Express HTTP server to host the landing page for charge, telesales, and hard Change
made in Voyager, helps stub out Apple Pay merchant session from Apple's servers.
*/

var express = require('express');
var querystring = require('querystring');
var mongoHelper = require('./lib/mongoHelper.js');
var ObjectId = require('mongodb').ObjectId;

/**
* Set up our server and static page hosting
*/
const app = express();
app.use(express.static('public'));
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');

/**
* A GET to obtain the landing page in the event the agent needs to perform a
* charge in Voyager using Apple Pay.
*/
app.get('/charge', function (req, res) {
    console.log("GET:charge");
    // get query params as object
    var queryParams;
    if (req.url.indexOf('?') >= 0) {
      queryParams = querystring.parse(req.url.replace(/^.*\?/, ''));
    }

    var query = { _id: ObjectId(queryParams.id) };
    mongoHelper.find(query, res, function(result, res) {
      res.render('charge', result);
    });
});

/**
* A GET to render the success page post the payment.
*/
app.get('/success', function (req, res) {
    console.log("GET:success");
    // get query params as object
    var queryParams;
    if (req.url.indexOf('?') >= 0) {
      queryParams = querystring.parse(req.url.replace(/^.*\?/, ''));
    }

    var query = { _id: ObjectId(queryParams.id) };
    mongoHelper.find(query, res, function(result, res) {
      result.tokenId = result._id;
      res.render('success', result);
    });
});

/**
* A GET to render the trip recap.
*/
app.get('/bookorchange', function (req, res) {
    console.log("GET:bookorchange");
    // get query params as object
    var queryParams;
    if (req.url.indexOf('?') >= 0) {
      queryParams = querystring.parse(req.url.replace(/^.*\?/, ''));
    }

    var query = { _id: ObjectId(queryParams.id) };
    mongoHelper.find(query, res, function(result, res) {
      result.tokenId = result._id;
      res.render('bookorchange', result);
    });
});

/**
* A POST to push the data to a database and return the id for the payload.
*/
app.post('/applepaydata', function (req, res) {
    console.log("POST:applepaydata");
    // get query params as object
    var queryParams;
    if (req.url.indexOf('?') >= 0) {
      queryParams = querystring.parse(req.url.replace(/^.*\?/, ''));
    }

    var data = {
      brandName: queryParams.brandName,
      hotelName: queryParams.hotelName,
      roomDescription: queryParams.roomDescription,
      cancellationInfo: queryParams.cancellationInfo,
      checkInDate: queryParams.checkInDate,
      checkOutDate: queryParams.checkOutDate,
      totalPrice: queryParams.totalPrice,
      travelerName: queryParams.travelerName,
      travelerPhone: queryParams.travelerPhone,
      travelerEmail: queryParams.travelerEmail
    }

    mongoHelper.insert(data, res, function(result, res) {
      res.send(result.insertedId);
    });
});

app.post('/mongodbTest', function (req, res) {
    console.log("POST:mongodbTest");

    mongoHelper.foo();
    mongoHelper.createDatabase();
    mongoHelper.createCollection();

    mongoHelper.insert("Husain");
    mongoHelper.insert("Husain2");

    var query = { name: "Husain2" };
    mongoHelper.find(query);
    mongoHelper.update(query, { name: query.name, address: Date.now() });

    mongoHelper.find(query, res, function(result, res) {
      res.send(result._id);
    });
});

/**
* A GET to render and test other pages
*/
app.get('/test', function (req, res) {
    console.log("GET:test");
    res.render('test')
});

/**
* Handle 404
*/
  app.use(function(req, res) {
    res.status(400);
    res.render('404.jade', {title: '404: Oops, have not found gold yet!!!'});
  });

/**
* Start serving the app.
*/
app.listen(app.get('port'), function() {
    console.log('Voyager AnyPay app is running on port', app.get('port'));
});
