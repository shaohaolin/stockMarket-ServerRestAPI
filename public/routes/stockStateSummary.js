/**
 * Created by Abdelkader on 2015-02-18.
 */
StockExchangeMarket.StockStateSummaryRoute = Ember.Route.extend({
    renderTemplate: function () {
        this.render('stockStateSummary', {  // the template to render
            into: 'application',            // the template to render into
            outlet: 'summary',           // the name of the outlet in that template
            controller: 'stockStateSummary' // the controller to use for the template
        });
    },



  model: function() {
      return this.store.find('company');
      // "this.store" is the data store represented by the adapter

  }
});