var successfulData;
var unsuccessfullData;
var map;

fetch('https://crowdfundapi.herokuapp.com/kickstarterAllSuccessfullProjects')
  .then(response => response.json())
  .then(data => {
    successfulData = data;
    // Here's a list of successful projects!
    createTabel(data, '#008000', false);
  });

fetch('https://crowdfundapi.herokuapp.com/kickstarterAllUnsuccessfullProjects')
  .then(response => response.json())
  .then(data => {
    unsuccessfullData = data;
    // Here's a list of successful projects!
    createTabel(data, '#FF0000', false);
  });


function createTabel(data, color, recreate) {
  console.log("1. color: " + color);
  CityList = {};
  var object = [];

  function getData() {
    data.forEach(function (i) {
      if (!i.lat || !i.lon) {
        console.log(i);
        getCoords(i);
      }
    })
    setTimeout(function () {
      object = createDataForHeatMap(CityList);
    }, 1000);
  };

  getData();

  function getCoords(city) {
    $.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + city.name + "&sensor=false", function (data) {
      if (!data.results) {
        data = JSON.parse(data);
      }
      //if the same coordinates occur, increase count
      var coords;
      try {
        coords = data.results[0].geometry.location.lat + ', ' + data.results[0].geometry.location.lng
        if (coords in CityList) {
          CityList[coords] += 1;
        } else {
          CityList[coords] = 1;
        }
        $.ajax({
          type: "POST",
          url: "https://crowdfundapi.herokuapp.com/addCoords",
          async: false,
          data: {
            id: city.id,
            lat: data.results[0].geometry.location.lat,
            lon: data.results[0].geometry.location.lng
          },
          timeout: 5000,
          success: function () {
            console.log("gg")
          },
          error: function (e) {
            console.log("bg");
          }
        });

      } catch (err) {
        console.log(err)
      }
    })
  }

  function createDataForHeatMap(cityList) {
    var dataHM = []
    for (var coords in cityList) {
      var lat = coords.split(', ')[0]
      var long = coords.split(', ')[1]
      dataHM.push({lat: lat, lng: long, count: cityList[coords]})
    }
    return dataHM;
  }

  function getCities() {
    object = createDataForHeatMap(citylist);
  };

  function myMap(color, recreate) {
    console.log("2. y map color: " + color);
    setTimeout(function () {
      if (recreate || !map) {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 5,
          center: {lat: 51.508742, lng: -0.120850}
        });
      }
//    google.maps.event.addListener(map, 'bounds_changed', function() {
//     for (var i in object){
//         console.log((object[i].lat,object[i].lng));
//        if( map.getBounds().contains((object[i].lat,object[i].lng))){
//        // code for showing your object, associated with markers[i]
//            console.log('hey');
//        }
//    }
//      });
//


      // Construct the circle for each value in citymap.
      // Note: We scale the area of the circle based on the population.
      for (var i in object) {

        var city = object[i]
        $('#list').text(city.lat, city.count)
        // console.log(city.lat + " " + city.lng + " " + city.count)
        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
          strokeColor: color,
          strokeOpacity: 0.9,
          strokeWeight: 1.5,
          fillColor: color,
          fillOpacity: 0.02,
          map: map,
          center: new google.maps.LatLng(city.lat, city.lng),
          radius: Math.sqrt(city.count) * 10000
        });


      }

    }, 1000);
  }

  setTimeout(myMap(color, recreate), 2000);
};

$('.toggle').click(function () {
  if ($("#success").is(':checked') && $("#unsuccess").is(':checked')) {
    createTabel(successfulData, '#008000', true);
    createTabel(unsuccessfullData, '#FF0000', false);
  } else if ($("#unsuccess").is(':checked')) {
    createTabel(unsuccessfullData, '#FF0000', true);
  } else {
    createTabel(successfulData, '#008000', true);
  }
});

//$("#list").html("<h2> City List - Number of projects </h2><p>London - 12</p><p>Brighton - 2</p><p>Cambridge - 4</p><p>Manchester - 2</p><p>Dublin - 1</p>")
