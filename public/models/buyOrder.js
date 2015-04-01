/**
 * Created by Abdelkader on 2015-02-18.
 */
StockExchangeMarket.BuyOrder = DS.Model.extend({
    timeStamp: DS.attr('date'),
    size: DS.attr('number'),
    price: DS.attr('number'),
    company: DS.belongsTo('company', { async: true })
});