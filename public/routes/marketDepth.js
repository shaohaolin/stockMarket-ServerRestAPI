/**
 * Created by Abdelkader on 2015-02-19.
 */
StockExchangeMarket.MarketDepthRoute = Ember.Route.extend({
    renderTemplate: function () {
        this.render(                 {outlet: 'depth', into: 'application', controller: 'marketByOrder'});
        this.render('marketByOrder', {outlet: 'marketByOrder', into: 'marketDepth', controller: 'marketByOrder'});
        this.render('marketByPrice', {outlet: 'marketByPrice', into: 'marketDepth', controller: 'marketByPrice'});
        this.render('symbol',        {outlet: 'symbol', into: 'marketDepth', controller: 'symbol'});
    },
    model: function (params) {
        this.store.find('buyOrder', { 'company': params.company_id });
        this.store.find('saleOrder', { 'company': params.company_id });
        return this.store.find('company', params.company_id);
    }
});