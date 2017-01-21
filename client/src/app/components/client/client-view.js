(function(){
	const app = angular.module('client-view', []);
	
	app.directive('clientView', () => {
		return {
			restrict    : 'E',
			templateUrl : 'html/views/product-form.html'
		};
	});
})();
