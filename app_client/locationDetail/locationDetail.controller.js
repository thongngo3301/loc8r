(function () {
	angular
		.module('loc8rApp')
		.controller('locationDetailCtrl', locationDetailCtrl);

	locationDetailCtrl.$inject = ['$routeParams', '$location', '$modal', 'loc8rData', 'authentication'];
	function locationDetailCtrl ($routeParams, $location, $modal, loc8rData, authentication) {
		var vm = this;
		vm.locationid = $routeParams.locationid;

		vm.isLoggedIn = authentication.isLoggedIn();

		vm.currentPath = $location.path();

		loc8rData.locationById(vm.locationid)
			.success(function(data) {
				vm.data = { location: data };
				vm.pageHeader = {
					title: vm.data.location.name
				};
				//var url = "https://www.google.com/maps/embed/v1/place?q="+response.data.coordinates[1]+","+response.data.coordinates[0]+",&amp;key=AIzaSyCDZuWD6EaECWYEwPQQ6bE8q4ht3BMO-Is";
				//var url = "https://www.google.com/maps/embed/v1/view?key=AIzaSyCDZuWD6EaECWYEwPQQ6bE8q4ht3BMO-Is&center="+response.data.coordinates[1]+","+response.data.coordinates[0]+"&zoom=17&maptype=roadmap";
				//vm.mapURL = $sce.trustAsResourceUrl(url);
				vm.initMap(data);
			})
			.error(function (e) {
				console.log(e);
			});
		vm.popupReviewForm = function () {
			var modalInstance = $modal.open({
				templateUrl: '/reviewModal/reviewModal.view.html',
				controller: 'reviewModalCtrl as vm',
				resolve: {
					locationData: function () {
						return {
							locationid: vm.locationid,
							locationName: vm.data.location.name
						};
					}
				}
			});

			modalInstance.result.then (function (data) {
				vm.data.location.reviews.push(data);
			});
		};

		vm.initMap = function (location) {
			var myLatLng = {lat: location.coordinates[1], lng: location.coordinates[0]};

	        var map = new google.maps.Map(document.getElementById('map'), {
	          zoom: 17,
	          center: myLatLng
	        });

	        var marker = new google.maps.Marker({
	          position: myLatLng,
	          map: map,
	          title: location.name
	        });
		}
	}
}) ();