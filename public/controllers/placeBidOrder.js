/**
 * Created by Abdelkader on 2015-02-18.
 */
StockExchangeMarket.PlaceBidOrderController = Ember.ObjectController.extend({
    actions: {
        addBuyOrder: function () {
            var inputPrice = this.get('price');
            var inputSize = this.get('size');
            var company = this.get('model');
            var buyOrders = company.get('buyOrders').sortBy('price');
            var saleOrders = company.get('saleOrders').sortBy('price');
            var transactions = company.get('transactions').sortBy('price');

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

            self = this;
            sortedSaleOrders.forEach(function (saleOrder) {
                // if we have sell order with the same price do the transaction
                // and add it into Transaction list
                if (parseFloat(inputPrice) >= parseFloat(saleOrder.get('price'))) {
                    if (parseInt(saleOrder.get('size')) == parseInt(inputSize)) {
                        // do full transaction
                        // do not add to buyOrders list
                        // remove sellOrder from the sellOrders list
                        var sale = self.store.createRecord('transaction', {
                            price: parseFloat(inputPrice),
                            size: parseInt(inputSize),
                            timeStamp: new Date()
                        });
                        sale.save();
                        var company = self.get('model');
                        company.get('transactions').pushObject(sale);
                        saleOrders.forEach(function (order) {
                            if (order.get('timeStamp') === saleOrder.get('timeStamp')) {
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
                    else if (parseInt(saleOrder.get('size')) > parseInt(inputSize)) {
                        // do partial transaction
                        // do not add to buyOrders list
                        // update sellOrder size to the remaining size in sellOrders list
                        var remainingSize = saleOrder.get('size') - parseInt(inputSize);
                        var sale = self.store.createRecord('transaction', {
                            price: parseFloat(inputPrice),
                            size: parseInt(inputSize),
                            timeStamp: new Date()
                        });
                        sale.save();
                        var company = self.get('model');
                        saleOrders.forEach(function (order) {
                            if (order.get('timeStamp') === saleOrder.get('timeStamp')) {
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
                    else if (parseInt(saleOrder.get('size')) < parseInt(inputSize)) {
                        // do partial transaction
                        // remove sellOrder from the sellOrders list
                        // add to buyOrders for the remaining size in buyOrders list
                        var remainingSize = parseInt(inputSize) - saleOrder.get('size');
                        var sale = self.store.createRecord('transaction', {
                            price: parseFloat(inputPrice),
                            size: parseInt(saleOrder.get('size')),
                            timeStamp: new Date()
                        });
                        sale.save();
                        var company = self.get('model');
                        saleOrders.forEach(function (order) {
                            if (order.get('timeStamp') === saleOrder.get('timeStamp')) {
                                order.deleteRecord();
                                order.save();
                                return true;
                            }
                        });
                        company.get('transactions').pushObject(sale);
                        company.set('currentPrice', parseFloat(inputPrice));
                        company.set('shareVolume', (parseInt(company.get('shareVolume')) + parseInt(saleOrder.get('size'))));
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
            }, saleOrders);
            if (inputSize > 0) {
                var order = self.store.createRecord('buyOrder', {
                    price: inputPrice,
                    size: inputSize,
                    timeStamp: new Date()
                });
                order.save();
                var company = self.get('model');
                company.get('buyOrders').pushObject(order);

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
