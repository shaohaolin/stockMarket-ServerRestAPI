/**
 * Created by Abdelkader on 2015-02-24.
 */
StockExchangeMarket.SymbolController = Ember.Controller.extend({
    needs: ['marketDepth'],

    logoUrl: function() {
        var company = this.get('controllers.marketDepth.model');
        var symbol = company.get('symbolURL');
        return  symbol;

    }.property('controllers.marketDepth.model')


});






