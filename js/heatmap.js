var successfulData;
var unsuccessfulData;

fetch('https://cors.io/?http://danpopoutanu.ro/Crowdfunding/website/data/results.json')
  .then(response => response.json())
  .then(data => {
    successfulData = data;
    // Here's a list of successful projects!
    
  });


fetch('https://cors.io/?http://danpopoutanu.ro/Crowdfunding/website/data/not-success.json')
  .then(response => response.json())
  .then(data => {
    unsuccessfulData = data;
    // Here's a list of successful projects!

    getData(data, false);
    setTimeout(createHeatMapData(false), 500);

    myMap(true, true);
  });

var successCityList = {};
var unsuccessfulCityList = {};
var objectSuccess = [];
var objectNotSuccess = [];

function createHeatMapData(success) {
  console.log(successCityList)
  objectSuccess = createDataForHeatMap(successCityList, success);
  console.log(unsuccessfulCityList)
  objectNotSuccess = createDataForHeatMap(unsuccessfulCityList, !success);
};

function getData(data, success) {
  data.forEach(function (i) {
    getCoords(i.city, success);
  })
};

function getCoords(name, success) {
  $.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + name + "&sensor=false", function (data) {
    if (!data.results) {
      data = JSON.parse(data);
    }
    //if the same coordinates occur, increase count
    var coords;
    try {
      coords = data.results[0].geometry.location.lat + ', ' + data.results[0].geometry.location.lng
      if (success) {
        if (coords in successCityList) {
          successCityList[coords] += 1;
        } else {
          successCityList[coords] = 1;
        }
      } else {
        if (coords in unsuccessfulCityList) {
          unsuccessfulCityList[coords] += 1;
        } else {
          unsuccessfulCityList[coords] = 1;
        }
      }
      /*if (success) {
        objectSuccess = createDataForHeatMap(successCityList, true)
      } else {
        objectNotSuccess = createDataForHeatMap(unsuccessfulCityList, true);
      }*/
    } catch (err) {
      console.log(data)
    }
  })
}

function createDataForHeatMap(cityList, doIt) {
  setTimeout(function () {

  }, 1000);
  if (!doIt) {
    return [];
  }

  var dataHM = []
  for (var coords in cityList) {
    var lat = coords.split(', ')[0]
    var long = coords.split(', ')[1]
    dataHM.push({lat: lat, lng: long, count: cityList[coords]})
  }
  console.log(dataHM)
  return dataHM;
}

function myMap(success, notSuccess) {

  setTimeout(function () {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: {lat: 51.508742, lng: -0.120850}
    });

    // Construct the circle for each value in citymap.
    // Note: We scale the area of the circle based on the population.
    if (success) {
      console.log("mymap success");
      console.log(objectSuccess);
      for (var i in objectSuccess) {
        var city = objectSuccess[i]
        // console.log(city.lat + " " + city.lng + " " + city.count)
        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
          strokeColor: '#008000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#008000',
          fillOpacity: 0.35,
          map: map,
          center: new google.maps.LatLng(city.lat, city.lng),
          radius: Math.sqrt(city.count) * 10000
        });
      }
    }
    if (notSuccess) {
      console.log("mymap notsuccess");
      console.log(objectNotSuccess);
      for (var i in objectNotSuccess) {
        var city = objectNotSuccess[i]
        // console.log(city.lat + " " + city.lng + " " + city.count)
        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: new google.maps.LatLng(city.lat, city.lng),
          radius: Math.sqrt(city.count) * 10000
        });
      }
    }
  }, 1000);
}
