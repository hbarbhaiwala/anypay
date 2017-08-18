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

/**
* Set up our server and static page hosting
*/
const app = express();
app.use(express.static('public'));
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');

/**
* A GET to obtain  the landing page in the event the agent needs to perform a charge
* in Voyager using Apple Pay.
*/
app.get('/charge', function (req, res) {
    console.log("GET:charge");
    // get query params as object
    var queryParams;
    if (req.url.indexOf('?') >= 0) {
      queryParams = querystring.parse(req.url.replace(/^.*\?/, ''));
    }

    var title = 'Home';
    if(queryParams!=undefined && queryParams.title!=undefined) {
      title = queryParams.title
    }

    res.render('charge', {
      title : title,
      year : '2017'
    })
});

app.get('/bookorchange', function (req, res) {
    console.log("GET:bookorchange");

    var data = {
      brandName: "hotels.com",
      hotelName : 'Fiesta Rancho Hotel',
      roomDescription: 'Standard Boring Room',
      cancellationInfo: 'Cancellation IMPOSSIBLE',
      checkInDate: 'tomorrow',
      checkOutDate: 'today',
      totalPrice: '$FREE',
      travelerName: 'Me',
      travelerPhone: '007',
      travelerEmail: 'iamBOND@bondmail.com',
    }

    res.render('bookorchange', data)
});

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
* Start serving the app.
*/
app.listen(app.get('port'), function() {
    console.log('Voyager AnyPay app is running on port', app.get('port'));
});
