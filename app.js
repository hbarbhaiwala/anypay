/*
Copyright (C) 2017 Expedia Inc. All Rights Reserved.
See LICENSE.txt for this sample’s licensing information

Abstract:
Sets up a simple Express HTTP server to host the landing page for charge, telesales, and hard Change
made in Voyager, helps stub out Apple Pay merchant session from Apple's servers.
*/

var express = require('express');
var querystring = require('querystring');

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
    var q = querystring.parse(queryParams);

    res.render('charge', {
      title : queryParams.title || 'Home',
      year : queryParams.year
    })
});

/**
* Start serving the app.
*/
app.listen(app.get('port'), function() {
    console.log('Voyager AnyPay app is running on port', app.get('port'));
});
