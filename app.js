app = angular.module("freedomApp", []);

app.controller("freedomController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	
	$scope.startPos = getParameterByName("startPos") || 0;
	$scope.endPos = getParameterByName("endPos") || 1000;
	

	
	$http.get("data.json").success(function(data){
		
		// Possible params, name, scoreStart, scoreEnd
		if( getParameterByName("name") ){
			data = data.filter(function(d){ return d.Name == getParameterByName("name") });
			console.log(data);
		}
		
		if( getParameterByName("scoreStart") ){
			if(getParameterByName("scoreEnd")){
				data = data.filter(function(d){ return +d.Sum >= +getParameterByName("scoreStart") && +d.Sum < +getParameterByName("scoreEnd") });				
			}
			else {
				data =data.filter(function(d){ return +d.Sum == +getParameterByName("scoreStart") });
			}

		}
		
		// Sort alphabetically
		data.sort(
			firstBy(function(a,b){ return a.Sum < b.Sum ? 1 : a.Sum > b.Sum ? -1 : 0; })
			.thenBy(function(a,b){ return +b.Count - +a.Count })
			.thenBy(function(a,b){ return a.LastName < b.LastName ? -1 : a.LastName > b.LastName ? 1 : 0; })
		);
		
		$scope.senators = data;
		
	}).error(function(err){ throw err; });
}]);

/*** Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0 ***/
firstBy=(function(){function e(f){f.thenBy=t;return f}function t(y,x){x=this;return e(function(a,b){return x(a,b)||y(a,b)})}return e})();

// Thanks to http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript for this
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
