/**
 * Created by Abdelkader on 2015-02-17.
 */
// We create a model of type StockExchangeMarket.Companies
StockExchangeMarket.Company = DS.Model.extend({
    name: DS.attr(),
    symbolURL: DS.attr(),
    openPrice: DS.attr(),
    currentPrice: DS.attr('number', {defaultValue: 0.0}),
    changeValue: DS.attr('number', {defaultValue: 0.0}),
    changeIcon: DS.attr('string', {defaultValue: 'images/noChange.png'}),
    changePercentage: DS.attr('number', {defaultValue: 0.0}),
    changeDirection: DS.attr('number', {defaultValue: 0}),// 1- up, 2- down, 0- noChange. Used for sorting
    shareVolume: DS.attr('number', {defaultValue: 0}),
    buyOrders: DS.hasMany('buyOrder', { async: true }),
    saleOrders: DS.hasMany('saleOrder', { async: true }),
    transactions: DS.hasMany('transaction', { async: true }) //to save the transaction when we find a deal
});