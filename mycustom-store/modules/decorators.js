var api;
(function(api) {
    var storeConstants = require('store').storeConstants;
    var tenantApi = require('/modules/tenant-api.js').api;
    var permissionsAPI = require('rxt').permissions;
    var log = new Log('decorators');
    api.navigationBar = function(ctx, page, utils) {
    	log.info('### Custom navigationBar page decorator called ###');
        var app = require('rxt').app;
        //Change the context to support cross tenant views
        var tenantAppResources = tenantApi.createTenantAwareAppResources(ctx.session);
        //Support for cross tenant views
        ctx = tenantAppResources.context;
        var rxtManager = ctx.rxtManager;
        //Obtain all of the available rxt types
        var availableTypes = app.getUIActivatedAssets(ctx.tenantId);
        availableTypes = ['isconnector','gadget','site'];
        var types = [];
        var type;
        var currentType;
        page.isUserDomainAndUrlDomainDifferent = tenantAppResources.isUserDomainAndUrlDomainDifferent;
        page.navigationBar = {};
        var isLandingPage = true;
        var noTypeSelected = true;

        for (var index in availableTypes) {
            type = availableTypes[index];
            if (permissionsAPI.hasAssetPermission(permissionsAPI.ASSET_LIST, type, ctx.tenantId, ctx.username)) {
                currentType = rxtManager.getRxtTypeDetails(type);
                currentType.selected = false;
                currentType.style = "all-item";
                currentType.listingUrl = utils.buildAssetPageUrl(currentType.shortName, '/list');
                if (currentType.shortName == page.rxt.shortName) {
                    currentType.selected = true;
                    currentType.style = "active home top-item";
                    isLandingPage = false;
                    noTypeSelected = false;
                }
                types.push(currentType);
            }
        }
        log.info(types);
        page.navigationBar.noTypeSelected = noTypeSelected;
        page.navigationBar.types = types;
        page.navigationBar.landingPage = isLandingPage;
        return page;
    };
}(api? api : (api={})));