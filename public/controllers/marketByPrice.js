/**
 * Created by Abdelkader on 2015-02-24.
 */
StockExchangeMarket.MarketByPriceController = Ember.ObjectController.extend({
    needs: ['marketDepth'],

    companyName: function () {
        var company = this.get('controllers.marketDepth.model');
        return company.get('name');
    }.property('controllers.marketDepth.model'),

    marketByPriceGrid: function () {
        var company = this.get('controllers.marketDepth.model');
        var buyOrders = company.get('buyOrders').sortBy('price');
        var saleOrders = company.get('saleOrders').sortBy('price');
        var table = [];
        for (var r = 0; r < 10; r++) {
            var row = Ember.Object.create();
            row.groupBuyCount = null;
            row.groupBuyVolume = null;
            row.groupBuyPrice = null;
            row.groupSalePrice = null;
            row.groupSaleVolume = null;
            row.groupSaleCount = null;
            table.pushObject(row);
        }
        //To sort ASC
        var sortedBuyOrders = buyOrders.sort(function (a, b) {
            return parseFloat(b.get('price')) - parseFloat(a.get('price'));
        });
        //To sort DESC
        var sortedSaleOrders = saleOrders.sort(function (a, b) {
            return parseFloat(a.get('price')) - parseFloat(b.get('price'));
        });

        var i = 0;
        var groupCount = 0;
        if (sortedBuyOrders.objectAt(0) != null) {
            table.objectAt(i).set('groupBuyPrice', parseFloat(sortedBuyOrders.objectAt(0).get('price')));
            table.objectAt(i).set('groupBuyVolume', parseInt(0));
        }
        sortedBuyOrders.forEach(function (buyOrder) {
            if (i < 10) {
                if (table.objectAt(i).get('groupBuyPrice') == parseFloat(buyOrder.get('price'))) {
                    groupCount++;
                    table.objectAt(i).set('groupBuyCount', groupCount);
                    table.objectAt(i).set('groupBuyVolume', parseInt(table.objectAt(i).get('groupBuyVolume'))
                    + parseInt(buyOrder.get('size')));
                }
                else {
                    if (i == 9) return true;
                    i++;
                    groupCount = 1;
                    table.objectAt(i).set('groupBuyCount', 1);
                    table.objectAt(i).set('groupBuyPrice', parseFloat(buyOrder.get('price')));
                    table.objectAt(i).set('groupBuyVolume', parseInt(buyOrder.get('size')));
                }
            }

        }, buyOrders);

        var i = 0;
        var groupCount = 0;
        if (sortedSaleOrders.objectAt(0) != null) {
            table.objectAt(i).set('groupSalePrice', parseFloat(sortedSaleOrders.objectAt(0).get('price')));
            table.objectAt(i).set('groupSaleVolume', parseInt(0));
        }

        sortedSaleOrders.forEach(function (saleOrder) {
            if (i < 10) {
                if (table.objectAt(i).get('groupSalePrice') == parseFloat(saleOrder.get('price'))) {
                    groupCount++;
                    table.objectAt(i).set('groupSaleCount', groupCount);
                    table.objectAt(i).set('groupSaleVolume', parseInt(table.objectAt(i).get('groupSaleVolume'))
                    + parseInt(saleOrder.get('size')));
                }
                else {
                    if (i == 9) return true;
                    i++;
                    groupCount = 1;
                    table.objectAt(i).set('groupSaleCount', 1);
                    table.objectAt(i).set('groupSalePrice', parseFloat(saleOrder.get('price')));
                    table.objectAt(i).set('groupSaleVolume', parseInt(saleOrder.get('size')));
                }
            }
        }, saleOrders);
        return table;
    }.property('controllers.marketDepth.model.buyOrders',
        'controllers.marketDepth.model.saleOrders',
        'controllers.marketDepth.model.transactions')
});