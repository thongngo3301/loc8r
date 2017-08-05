(function () {
	angular
		.module('loc8rApp')
		.controller('locationDetailCtrl', locationDetailCtrl);

	locationDetailCtrl.$inject = ['$routeParams', '$location', 'loc8rData', 'authentication'];
	function locationDetailCtrl ($routeParams, $location, loc8rData, authentication) {
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
		//modal add review controller
		vm.onSubmit = function () {
			vm.formError = "";
			if(/*!vm.formData.name || */!vm.formData.rating || !vm.formData.reviewText){
				vm.formError = "All fields are required, please try again";
				return false;
			}else{
				vm.doAddReview(vm.locationid,vm.formData);
			}
		}

		vm.doAddReview = function (locationid,formData) {
			
			loc8rData.addReviewById(locationid,{
				/*author: authentication.currentUser().name,*/
				rating: formData.rating,
				reviewText: formData.reviewText
			})
				.success(function (data) {
					$('#myModal').modal('toggle');
					vm.data.location.reviews.push(data);
				})
				.error(function(data){
					vm.formError = 'Your review has not saved, try again';
				})
				return false;
		}

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