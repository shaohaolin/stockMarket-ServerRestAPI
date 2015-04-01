/**
 * Created by Abdelkader on 2015-02-20.
 */
StockExchangeMarket.PlaceSaleOrderRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.find('company', params.saleOrder_id);
    },
    renderTemplate: function() {
        this.render( {outlet: 'order', into: 'application', controller: 'placeSaleOrder'});
    }
});