/**
 * Created by Abdelkader on 2015-02-18.
 */
StockExchangeMarket.PlaceBidOrderRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.find('company', params.buyOrder_id);
    },
    renderTemplate: function() {
        this.render( {outlet: 'order', into: 'application', controller: 'placeBidOrder'});
    }
});
