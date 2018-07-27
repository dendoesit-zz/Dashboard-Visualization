var successfulData;
var unsuccessfullData;
var map;
var objectS;
var objectU;
var noData;

fetch('https://crowdfundapi.herokuapp.com/kickstarterAllSuccessfullProjects')
  .then(response => response.json())
  .then(data => {
    successfulData = data;
    // Here's a list of successful projects!
    createTabel(successfulData, '#008000', true);
  });

fetch('https://crowdfundapi.herokuapp.com/kickstarterAllUnsuccessfullProjects')
  .then(response => response.json())
  .then(data => {
    unsuccessfullData = data;
    // Here's a list of successful projects!
    createTabel(unsuccessfullData, '#FF0000', false);
  });

function createTabel(data, color, recreate) {
  CityList = {};
  object = [];

  function getData(data) {
    console.log("in get data");
    data.forEach(function (i) {
      if (!i.lat || !i.lon) {
        getCoords(i);
      } else {
        var coords = i.lat + ', ' + i.lon
        if (coords in CityList) {
          CityList[coords] += 1;
        } else {
          CityList[coords] = 1;
        }
      }
    })
    if (color == '#FF0000') {
      objectU = createDataForHeatMap(CityList);
    } else {
      objectS = createDataForHeatMap(CityList);
    }
  };

  getData(data);

  function getCoords(city) {
    $.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + city.city + "&sensor=false", function (data) {
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

    setTimeout(function () {
      var percentage = (successfulData.length/unsuccessfullData.length)*100;
      $("#title-bar").html("<h4> Succesfull projects " + Math.floor(percentage) + " % </h4>")
      $("#progress-bar").css("width","percentage");
      var object;
      if (color == '#FF0000') {
        object = objectU;
      } else {
        object = objectS;
      }
      if (recreate || !map) {
       map = new google.maps.Map(document.getElementById('map'), {
          zoom: 6,
          center: {lat: 54.508742, lng: -0.120850}
        });
      }

      // Construct the circle for each value in citymap.
      // Note: We scale the area of the circle based on the population.
      for (var i in object) {
        var city = object[i];
        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
          strokeColor: color,
          strokeOpacity: color == '#008000' ? 0 : 1,
          strokeWeight: 1,
          fillColor: color,
          fillOpacity: color == '#008000' ? 0.5 : 0.02,
          visible:true,
            description:city.count,
            title:(city.lat, city.lng),
          map: map,
          center: new google.maps.LatLng(city.lat, city.lng),
          radius: Math.sqrt(city.count) * 5000
        });

          var infowindow = new google.maps.InfoWindow({
          content: 'heyeeeeeee'
        });

          var infoWindow = new google.maps.InfoWindow();
          google.maps.event.addListener(cityCircle, 'click', function() {
            infoWindow.setContent('Number of projects: ' + String(this.description) );
              infoWindow.open(map, this);
              infoWindow.setPosition( this.center );/* need to set the position */
          });
      }
    }, 1000);
  }

  myMap(color, recreate);
};

$('.toggle').click(function () {
  if ($("#success").is(':checked') && $("#unsuccess").is(':checked')) {
    createTabel(successfulData, '#008000', true);
    createTabel(unsuccessfullData, '#FF0000', false);
  } else if ($("#unsuccess").is(':checked')) {
    createTabel(unsuccessfullData, '#FF0000', true);
  } else if ($("#success").is(':checked')){
    createTabel(successfulData, '#008000', true);
  }else{
      map = new google.maps.Map(document.getElementById('map'), {
          zoom: 6,
          center: {lat: 54.508742, lng: -0.120850}
        });
  }
});






//$("#list").html("<h2> City List - Number of projects </h2><p>London - 12</p><p>Brighton - 2</p><p>Cambridge - 4</p><p>Manchester - 2</p><p>Dublin - 1</p>")
