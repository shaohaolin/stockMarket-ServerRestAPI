var express = require('express');
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
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Companies' }
});

// define saleOrder Schema
var saleOrderSchema = mongoose.Schema({
    timeStamp: Date,
    size: Number,
    price: Number,
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Companies'}
});

//define transaction Schema
var transactionSchema = mongoose.Schema({
    timeStamp: Date,
    size: Number,
    price: Number,
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Companies' }
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
    buyOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BuyOrders' }], 
    saleOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SaleOrders' }],
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transactions' }] //to save the transaction when we find a deal
});

/* compile company model - instances of models are document.
 * Now I have companys model or document
 * A model is an object that gives you easy access to a named collection.
 */ 
var Companies = mongoose.model('Companies', companySchema);
var BuyOrders = mongoose.model('BuyOrders', buyOrderSchema);
var SaleOrders = mongoose.model('SaleOrders', saleOrderSchema);
var Transactions = mongoose.model('Transactions', transactionSchema);

// compile buyOrders model

// Get all the companies
app.get('/companies', function (request, response) {
    Companies.find(function (error, companies) {
        if (error) response.send(error);
        response.json({companies: companies});
    });
});

// Get all the buy orders
app.get('/buyOrders', function (request, response) {
    BuyOrders.find(function (error, buyOrders) {
        if (error) response.send(error);
        response.json({BuyOrders: buyOrders});
    });
});

// Get all teh sale orders
app.get('/saleOrders', function (request, response) {
    SaleOrders.find(function (error, saleOrders) {
        if (error) response.send(error);
        response.json({saleOrders: saleOrders});
    });
});

// Create a company
app.post('/companies', function (request, response) {
    var company = new Companies (request.body.company);

    // save the company
    company.save(function (error) {
        if (error) response.send(error);
        response.status(201).json({Companies: company});
    });
});

// Create a buy orders
app.post('/buyOrders', function (request, response) {
    var buyOrder = new BuyOrders (request.body.buyOrder);
    //console.log(request.body);
    //console.log(request.body.buyOrder.company);

    Companies.findById(request.body.buyOrder.company, function (error, company) {
        if (error) response.send(error);
        company.buyOrders.push(buyOrder);
        company.save();
    });

    // save the buyOrder
    buyOrder.save(function (error) {
        if (error) response.send(error);
        response.status(201).json({BuyOrders: buyOrder});
    });
});

// Create a sale orders
app.post('/saleOrders', function (request, response) {
    var saleOrder = new SaleOrders (request.body.saleOrder);
    //console.log(request.body);
    //console.log(request.body.saleOrder.company);

    Companies.findById(request.body.saleOrder.company, function (error, company) {
        if (error) response.send(error);
        company.saleOrders.push(saleOrder);
        company.save();
    });

    // save the buyOrder
    saleOrder.save(function (error) {
        if (error) response.send(error);
        response.status(201).json({SaleOrders: saleOrder});
    });
});

// Create a transcation
app.post('/transactions', function (request, response) {
    console.log(request.body);
    var transaction = new Transactions (request.body.transaction);

    Companies.findById(request.body.transaction.company, function (error, company) {
        if (error) response.send(error);
        company.transactions.push(transaction);
        company.save();
    });

    // save the buyOrder
    transaction.save(function (error) {
        if (error) response.send(error);
        response.status(201).json({Transactions: transaction});
    });
});

// Update a company with new info.
app.put('/companies/:company_id', function(request, response) {

    Companies.findById(request.params.company_id, function(error, company) {
        if (error) response.send(error);
        //console.log(company);
        //undate the company information
        company.currentPrice = request.body.company.currentPrice;
        company.changeValue = request.body.company.changeValue;
        company.changeIcon = request.body.company.changeIcon;
        company.changePercentage = request.body.company.changePercentage;
        company.changeDirection = request.body.company.changeDirection;
        company.shareVolume = request.body.company.shareVolume;
        //company.buyOrders = request.body.company.buyOrders;
        //company.saleOrders = request.body.company.saleOrders;
        //company.transaction = request.body.company.transactions;

        // save the company information
        company.save(function(error) {
            if (error) response.send(error);
            response.status(201).json({companies: company});
        });

    });
});

// Delete a buy order
app.delete('/buyOrders/:buyOrder_id', function (request, response) {
    BuyOrders.remove({
        _id: request.params.buyOrder_id
    }, function(error, buyOrder) {
        if (error) response.send(err);
        response.status(201).json({BuyOrders: buyOrder});
    });

});

// Delete a sale order
app.delete('/saleOrders/:saleOrder_id', function (request, response) {
    SaleOrders.remove({
        _id: request.params.saleOrder_id
    }, function(error, saleOrder) {
        if (error) response.send(err);
        response.status(201).json({SaleOrders: saleOrder});
    });

});

// Get a company with matching company_id
app.get('/companies/:company_id', function(request, response) {
    Companys.findById(request.params.company_id, function (error, company) {
        if (error || !company) response.send(error);
        response.json({companies: company});
    });
});

app.listen(3700, function () {
    console.log('Listening on port 3700');
});

