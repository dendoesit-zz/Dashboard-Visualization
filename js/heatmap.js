var successfulData;
var unsuccessfullData;
var map;

fetch('https://cors.io/?http://danpopoutanu.ro/Crowdfunding/website/data/results.json')
  .then(response => response.json())
    .then(data => {
     successfulData = data;
    // Here's a list of successful projects!
   createTabel(data, '#008000', false);
});

fetch('https://cors.io/?http://danpopoutanu.ro/Crowdfunding/website/data/not-success.json')
  .then(response => response.json())
    .then(data => {
    unsuccessfullData = data;
    // Here's a list of successful projects!
   createTabel(data, '#FF0000', false);
});


function createTabel(data, color, recreate) {
    CityList = {};
    var object = [];
    function getData(){
        console.log(object);
        data.forEach(function(i){
            getCoords(i.city);
        })
        setTimeout(function() {
			object = createDataForHeatMap(CityList);
        }, 1000);
    };
    
	getData();

    function getCoords(name){
        $.get("http://maps.googleapis.com/maps/api/geocode/json?address="+name+"&sensor=false", function(data){
			if (!data.results) {
			  data = JSON.parse(data);
			}
			//if the same coordinates occur, increase count
			var coords;
			try {
			  coords = data.results[0].geometry.location.lat + ', ' + data.results[0].geometry.location.lng
			  if (coords in CityList){
					CityList[coords] += 1;
				} else {
					CityList[coords] = 1;
				}

			} catch (err) {
			  console.log(data)
			}
            //object = createDataForHeatMap(CityList)
        })
    }
    
    function createDataForHeatMap(cityList) {
        var dataHM = []
        for (var coords in cityList) {
            var lat = coords.split(', ')[0]
            var long = coords.split(', ')[1]
            dataHM.push({lat: lat, lng : long, count: cityList[coords]})
        }
        return dataHM;
    }
    
    function getCities(){
            object = createDataForHeatMap(citylist);
        };
    function myMap(color, recreate) {
		
		setTimeout(function() {
			if (recreate || !map) {
				map = new google.maps.Map(document.getElementById('map'), {
				  zoom: 5,
				  center: {lat: 51.508742, lng: -0.120850}
				});
			}
			

			// Construct the circle for each value in citymap.
			// Note: We scale the area of the circle based on the population.
			for (var i in object) {
				var city = object[i]
				// console.log(city.lat + " " + city.lng + " " + city.count)
				// Add the circle for this city to the map.
				var cityCircle = new google.maps.Circle({
					strokeColor: color,
					strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: color,
					fillOpacity: 0.2,
					map: map,
					center: new google.maps.LatLng(city.lat, city.lng),
					radius: Math.sqrt(city.count) * 10000
				});
			}
        }, 1000);
    }
	setTimeout(myMap(color, recreate), 2000);
};

$('.toggle').click(function() {
	if($("#success").is(':checked') && $("#unsuccess").is(':checked')) {
		createTabel(successfulData, '#008000', true);
		createTabel(unsuccessfullData, '#FF0000', false);
	} else if ($("#unsuccess").is(':checked')) {
		createTabel(unsuccessfullData, '#FF0000', true);
	} else {
		createTabel(successfulData, '#008000', true);
	}
});