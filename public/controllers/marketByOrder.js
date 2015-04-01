/**
 * Created by Abdelkader on 2015-02-24.
 */
StockExchangeMarket.MarketByOrderController = Ember.ObjectController.extend({
    needs: ['marketDepth'],

    companyName: function () {
        var company = this.get('controllers.marketDepth.model');
        return company.get('name');
    }.property('controllers.marketDepth.model'),

    marketByOrderGrid: function () {
        var company = this.get('controllers.marketDepth.model');

        var buyOrders = company.get('buyOrders').sortBy('price');
        var saleOrders = company.get('saleOrders').sortBy('price');
        var table = [];
        for (var r = 0; r < 10; r++) {
            var row = Ember.Object.create();
            row.sellPrice = null;
            row.sellSize = null;
            row.buyPrice = null;
            row.buySize = null;
            table.pushObject(row);
        }
        //To sort ASC
        var sortedBuyOrders = buyOrders.sort(function (a, b) {
            var priceA = parseFloat(a.get('price'));
            var priceB = parseFloat(b.get('price'));
            var dateA = a.get('timeStamp');
            var dateB = b.get('timeStamp');
            if (priceA < priceB) return 1;
            if (priceA > priceB) return -1;
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            return 0;
        });

        //To sort DESC
        var sortedSaleOrders = saleOrders.sort(function (a, b) {
            var priceA = parseFloat(a.get('price'));
            var priceB = parseFloat(b.get('price'));
            var dateA = a.get('timeStamp');
            var dateB = b.get('timeStamp');
            if (priceA < priceB) return -1;
            if (priceA > priceB) return 1;
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            return 0;
        });

        var i = 0;
        sortedSaleOrders.forEach(function (saleOrder) {
            if (i == 10) return true;
            table.objectAt(i).set('sellPrice', saleOrder.get('price'));
            table.objectAt(i).set('sellSize', saleOrder.get('size'));
            i++;
        }, saleOrders);
        var i = 0;
        sortedBuyOrders.forEach(function (buyOrder) {
            if (i == 10) return true;
            table.objectAt(i).set('buyPrice', buyOrder.get('price'));
            table.objectAt(i).set('buySize', buyOrder.get('size'));
            i++;
        }, buyOrders);
        return table;
    }.property('controllers.marketDepth.model.buyOrders',
        'controllers.marketDepth.model.saleOrders',
        'controllers.marketDepth.model.transactions')

});

