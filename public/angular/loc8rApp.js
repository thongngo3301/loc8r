angular.module('loc8rApp', []);

var homeCtrl = function ($scope, loc8rData, geolocation) {
	$scope.message = "Checking your location...";
	$scope.getData = function (position) {
		var lat = position.coords.latitude,
			lng = position.coords.longitude;
		$scope.message = "Searching for nearby places...";
		loc8rData.locationByCoords(lat, lng)
		/*.success(function(data) {
			$scope.message = data.length > 0 ? "" : "No locations found";
			$scope.data = { locations: data };
			console.log(data);
		})*/
		.then(function (response) {
			console.log(response);
			$scope.data = { locations: [] };
			$scope.message = response.data.length > 0 ? "" : "No locations found";
			$scope.data.locations = response.data;
		}, function(error) {
			$scope.message = "Sorry, something's gone wrong";
		});
	};
	$scope.showError = function (error) {
		$scope.$apply(function() {
			$scope.message = error.message;
		});
	};
	$scope.noGeo = function() {
		$scope.$apply(function() {
			$scope.message = "Geolocation is not supported by this browser.";
		});
	};
	geolocation.getPosition($scope.getData,$scope.showError,$scope.noGeo);
};

var _isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

var _formatDistance = function () {
	return function (distance) {
		var numDistance, unit;
		if (distance && _isNumeric(distance)) {
			if (distance > 1) {
				numDistance = parseFloat(distance).toFixed(1);
				unit = 'km';
			}
			else {
				numDistance = parseInt(distance *1000,10);
				unit = 'm';
			}
			return numDistance + unit;
		}
		else {
			return "?";
		}
	};
};

var ratingStars = function () {
	return {
		scope: {
			thisRating: '=rating'
		},
		templateUrl: '/angular/rating-stars.html'
	};
};

var loc8rData = function ($http) {
	//return $http.get('/api/locations?lng=105.7879486&lat=21.0423793&maxDistance=20');
	var locationByCoords = function (lat, lng) {
		return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20');
	};
	return {
		locationByCoords : locationByCoords
	};
};

var geolocation = function () {
	var getPosition = function (cbSuccess, cbError, cbNoGeo) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
		}
		else {
			cbNoGeo();
		}
	};
	return {
		getPosition : getPosition
	};
};

angular
	.module('loc8rApp')
	.controller('homeCtrl', homeCtrl)
	.filter('_formatDistance', _formatDistance)
	.directive('ratingStars', ratingStars)
	.service('loc8rData', loc8rData)
	.service('geolocation', geolocation);