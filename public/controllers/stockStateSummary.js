/**
 * Created by Abdelkader on 2015-02-18.
 */
StockExchangeMarket.StockStateSummaryController = Ember.Controller.extend({

    myModel: [], //to swap the main model to the controller-based model
    mySortFactor: ['name'], //the default list sort
    sortedModel: Ember.computed.sort('model', 'mySortFactor'),
    sortedGainers: Ember.computed.sort('gainers', 'mySortFactor'),
    sortedLosers: Ember.computed.sort('losers', 'mySortFactor'),
    // A computed property which returns a new array with all the properties from the model
    // sorted based on a sortFactor property above.
    // Initially Companies wil appear sorted by company name.

    gainers: function () {
        var companies = this.get('model');
        return companies.filter(function (company) {
            return (company.get('changeDirection') == parseInt(1));
        });
    }.property('mySortFactor'),

    losers: function () {
        var companies = this.get('model');
        return companies.filter(function (company) {
            return (company.get('changeDirection') == parseInt(2));
        });
    }.property('mySortFactor'),

    init: function () {
        this.set('myModel', this.get('sortedModel'));
    },
    actions: {
        sortByVolume: function () {
            this.set('mySortFactor', ["shareVolume:desc"]);
            this.set('myModel', this.get('sortedModel'));
        },
        sortByGainers: function () {
            this.set('mySortFactor', ["changePercentage:desc"]);
            this.set('myModel', this.get('sortedGainers'));
        },
        sortByLosers: function () {
            this.set('mySortFactor', ["changePercentage:desc"]);
            this.set('myModel', this.get('sortedLosers'));
        },
        placeBid: function (params) {
            this.transitionToRoute('placeBidOrder', params);
        },
        placeSale: function (params) {
            this.transitionToRoute('placeSaleOrder', params);
        },
        initSummary: function () {
            if (Ember.isEmpty(this.get('myModel'))) {
                 //initialize the company model
                var self = this;
                companies.forEach(function (company) {
                    var newCompany = self.store.createRecord('company', {
                        name: company.name,
                        openPrice: company.openPrice,
                        symbolURL: company.symbolURL
                    });
                    newCompany.save();
                }, companies);
            }
        }
    }
});