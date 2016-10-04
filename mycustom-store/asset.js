asset.renderer =  function (ctx){
	return {
		pageDecorators: {
			navigationBar: function(page) {
                return require('/extensions/app/mycustom-store/modules/decorators.js').api.navigationBar(ctx, page, this);
            }
		}
	};		
};