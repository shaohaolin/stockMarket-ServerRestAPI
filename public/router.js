/**
 * Created by Abdelkader on 2015-01-31.
 */
StockExchangeMarket.Router.map(function () {
    this.resource('stockStateSummary', {path: '/'}, function(){
        this.resource('marketDepth',{path: 'marketDepth/:company_id'});
        this.resource('placeBidOrder',{path: 'placeBidOrder/:buyOrder_id'});
        this.resource('placeSaleOrder',{path: 'placeSaleOrder/:saleOrder_id'});
    });
});
