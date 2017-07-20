//(function () {	
	angular.module('loc8rApp', ['ngRoute']);

	function config ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'home/home.view.html',
				controller: 'homeCtrl',
				controllerAs: 'vm'		// stand for ViewModel, use this 'vm' var in CONTROLLER and VIEW
			})
			.otherwise({redirectTo: '/'});
	}

	angular
		.module('loc8rApp')
		.config(['$routeProvider', config]);
//}) ();