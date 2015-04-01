ar express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

//A connection is a fairly standard wrapper around a database connection.
mongoose.connect('mongodb://localhost/stockExchangeMarket');

var app = express();

var logger = require('./logger');
app.use(logger);
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

// define buyOrder Schema
var buyOrderSchema = mongoose.Schema({
    timeStamp: Date,
    size: Number,
    price: Number,
    company: { type: companySchema }
});

// define saleOrder Schema
var saleOrderSchema = mongoose.Schema({
    timeStamp: Date,
    size: Number,
    price: Number,
    company: { type: companySchema }
});

//define transaction Schema
var transactionSchema = mongoose.Schema({
    timeStamp: Date,
    size: Number,
    price: Number,
    company: { type: companySchema }
});

//  define company Schema
var companySchema = mongoose.Schema({
    name: String,
    symbolURL: String,
    openPrice: { type: Number, default: 0 },
    currentPrice: { type: Number, default: 0 }, 
    changeValue: { type: Number, default: 0 },
    changeIcon: { type: String, default: 'images/noChange.png' },
    changePercentage: { type: Number, default: 0 },
    changeDirection: { type: Number, default: 0 },
    shareVolume: { type: Number, default: 0 },
    buyOrders: [buyOrderSchema], 
    saleOrders: [saleOrderSchema],
    transactions: [transactionSchema] //to save the transaction when we find a deal
});

// compile company model - instances of models are document.
// Now I have companys model or document
// A model is an object that gives you easy access to a named collection.
var Companys = mongoose.model('Companys', companySchema);

app.get('/companies', function (request, response) {
    Companys.find(function (error, companies) {
        if (error) response.send(error);
        response.json({companies: companies});
    });
});

app.get('/companies/:company_id', function(request, response) {
    Companys.findById(request.params.company_id, function (error, company) {
        if (error || !company) response.send(error);
        response.json({companies: company});
    });
});

app.put('/companies/:company_id', function(request, response) {
    Companys.findById(require.params.company_id, function(error, company) {
        if (error) response.send(error);

        //undate the company information
        company.name = request.body.company.name;
        company.symbolURL = request.body.company.symbolURL;
        company.openPrice = request.body.company.openPrice;
        company.currentPrice = request.body.company.currentPrice;
        company.changeValue = request.body.company.changeValue;
        company.changeIcon = request.body.company.changeIcon;
        company.changeDirection = request.body.company.changeDirection;
        company.shareVolume = request.body.company.shareVolume;
        company.buyOrders = request.body.company.buyOrders;
        company.saleOrders = request.body.company.saleOrders;
        company.transaction = request.body.company.transactions;

        // save the company information
        company.save(function(error) {
            if (error) response.send(error);
            response.status(201).json({companies: company});
        });
        
    });
});

/*
var Posts = mongoose.model('Posts', postsSchema);


app.get('/posts', function (request, response) {
    Posts.find(function (error, posts) {
        if (error) response.send(error);
        response.json({posts: posts});
    });
});

app.get('/posts/:post_id', function (request, response) {
    Posts.findById(request.params.post_id, function (error, post) {
        if (error) response.send(error);
        response.json({posts: post});
    });
});

app.post('/posts', function (request, response) {
    var post = new Posts({
        title: request.body.post.title,
        body: request.body.post.body
    });
    post.save(function(error) {
        if (error) response.send(error);
        response.status(201).json({posts: post});
    });
});

app.put('/posts/:post_id', function (request, response) {
    // use our Posts model to find the post we want
    Posts.findById(request.params.post_id, function (error, post) {
        if (error) response.send(error);

        // update the post info
        post.title = request.body.post.title,
        post.body = request.body.post.body

        // save the post
        post.save(function (error) {
            if (error) response.send(error);
            response.status(201).json({posts: post});
        });
    });
});

app.delete('/posts/:post_id', function (request, response) {
    Posts.remove({
        _id: request.params.post_id
    }, function(error, post) {
        if (error) response.send(err);
        response.status(201).json({posts: Posts});
    });

});
*/

app.listen(3700, function () {
    console.log('Listening on port 3700');
});

