/**
 * Created by Abdelkader on 2015-02-20.
 */
StockExchangeMarket.PlaceSaleOrderController = Ember.ObjectController.extend({
    actions: {
        addSellOrder: function () {
            var inputPrice = this.get('price');
            var inputSize = this.get('size');
            var company = this.get('model');
            var buyOrders = company.get('buyOrders').sortBy('price');
            var saleOrders = company.get('saleOrders').sortBy('price');
            var transactions = company.get('transactions').sortBy('price');

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

            self = this;
            sortedBuyOrders.forEach(function (buyOrder) {
                // if we have buy order with the same price do the transaction
                // and add it into Transaction list
                if (parseFloat(inputPrice) <= parseFloat(buyOrder.get('price'))) {
                    if (parseInt(buyOrder.get('size')) == parseInt(inputSize)) {
                        // do full transaction
                        // do not add to saleOrders list
                        // remove buyOrder from the buyOrders list
                        var sale = self.store.createRecord('transaction', {
                            price: parseFloat(inputPrice),
                            size: parseInt(inputSize),
                            timeStamp: new Date()
                        });
                        sale.save();
                        var company = self.get('model');
                        company.get('transactions').pushObject(sale);
                        buyOrders.forEach(function (order) {
                            if (order.get('timeStamp') === buyOrder.get('timeStamp')) {
                                order.deleteRecord();
                                order.save();
                                return true;
                            }
                        });
                        company.set('currentPrice', parseFloat(inputPrice));
                        company.set('shareVolume', (parseInt(company.get('shareVolume')) + parseInt(inputSize)));
                        var changeNet = (parseFloat(inputPrice) - parseFloat(company.get('openPrice'))).toFixed(2);
                        if (changeNet < 0) {
                            company.set('changeDirection', parseInt(2)); // 1- up, 2- down, 0- noChange. Used for sorting
                            company.set('changeIcon', "images/down.png");
                        }
                        else if (changeNet > 0) {
                            company.set('changeDirection', parseInt(1));
                            company.set('changeIcon', "images/up.png");
                        }
                        else {
                            company.set('changeDirection', parseInt(0));
                            company.set('changeIcon', "images/noChange.png");
                        }
                        company.set('changeValue', Math.abs(changeNet));
                        company.set('changePercentage', ((Math.abs(changeNet) / parseFloat(company.get('openPrice'))
                        * 100)).toFixed(2));
                        company.save();
                        inputSize = 0;
                        return true;
                    }
                    else if (parseInt(buyOrder.get('size')) > parseInt(inputSize)) {
                        // do partial transaction
                        // do not add to saleOrders list
                        // update buyOrder size to the remaining size in buyOrders list
                        var remainingSize = buyOrder.get('size') - parseInt(inputSize);
                        var sale = self.store.createRecord('transaction', {
                            price: parseFloat(inputPrice),
                            size: parseInt(inputSize),
                            timeStamp: new Date()
                        });
                        sale.save();
                        var company = self.get('model');
                        buyOrders.forEach(function (order) {
                            if (order.get('timeStamp') === buyOrder.get('timeStamp')) {
                                order.set('size', remainingSize);
                                return true;
                            }
                        });
                        company.get('transactions').pushObject(sale);
                        company.set('currentPrice', parseFloat(inputPrice));
                        company.set('shareVolume', (parseInt(company.get('shareVolume')) + parseInt(inputSize)));
                        var changeNet = (parseFloat(inputPrice) - parseFloat(company.get('openPrice'))).toFixed(2);
                        if (changeNet < 0) {
                            company.set('changeDirection', parseInt(2)); // 1- up, 2- down, 0- noChange. Used for sorting
                            company.set('changeIcon', "images/down.png");
                        }
                        else if (changeNet > 0) {
                            company.set('changeDirection', parseInt(1));
                            company.set('changeIcon', "images/up.png");
                        }
                        else {
                            company.set('changeDirection', parseInt(0));
                            company.set('changeIcon', "images/noChange.png");
                        }
                        company.set('changeValue', Math.abs(changeNet));
                        company.set('changePercentage', ((Math.abs(changeNet) / parseFloat(company.get('openPrice'))
                        * 100)).toFixed(2));
                        company.save();
                        inputSize = 0;
                        return true;
                    }
                    else if (parseInt(buyOrder.get('size')) < parseInt(inputSize)) {
                        // do partial transaction
                        // remove buyOrder from the buyOrders list
                        // add to saleOrders for the remaining size in saleOrders list
                        var remainingSize = parseInt(inputSize) - buyOrder.get('size');
                        var sale = self.store.createRecord('transaction', {
                            price: parseFloat(inputPrice),
                            size: parseInt(buyOrder.get('size')),
                            timeStamp: new Date()
                        });
                        sale.save();
                        var company = self.get('model');
                        buyOrders.forEach(function (order) {
                            if (order.get('timeStamp') === buyOrder.get('timeStamp')) {
                                order.deleteRecord();
                                order.save();
                                return true;
                            }
                        });
                        company.get('transactions').pushObject(sale);
                        company.set('currentPrice', parseFloat(inputPrice));
                        company.set('shareVolume', (parseInt(company.get('shareVolume')) + parseInt(buyOrder.get('size'))));
                        var changeNet = (parseFloat(inputPrice) - parseFloat(company.get('openPrice'))).toFixed(2);
                        if (changeNet < 0) {
                            company.set('changeDirection', parseInt(2)); // 1- up, 2- down, 0- noChange. Used for sorting
                            company.set('changeIcon', "images/down.png");
                        }
                        else if (changeNet > 0) {
                            company.set('changeDirection', parseInt(1));
                            company.set('changeIcon', "images/up.png");
                        }
                        else {
                            company.set('changeDirection', parseInt(0));
                            company.set('changeIcon', "images/noChange.png");
                        }
                        company.set('changeValue', Math.abs(changeNet));
                        company.set('changePercentage', ((Math.abs(changeNet) / parseFloat(company.get('openPrice'))
                        * 100)).toFixed(2));
                        company.save();
                        inputSize = remainingSize;
                    }
                }
                else {
                    return true;
                }
            }, buyOrders);
            if (inputSize > 0) {
                var order = self.store.createRecord('saleOrder', {
                    price: inputPrice,
                    size: inputSize,
                    timeStamp: new Date()
                });
                order.save();
                var company = self.get('model');
                company.get('saleOrders').pushObject(order);
                company.save();
            }
            self.transitionToRoute('marketDepth', company.id);
        },
        cancel: function () {
            var company = this.get('model');
            this.transitionToRoute('marketDepth', company.id);
        }
    }
});
