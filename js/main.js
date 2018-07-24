
var succesfullData = "";

fetch('https://cors.io/?http://danpopoutanu.ro/Crowdfunding/website/data/results.json')
  .then(response => response.json())
    .then(data => {
     successfulData = data;
    var i;
    for( i=0;  i < data.length; i++){
        data[i].Duration = Math.round(data[i].duration/(3600*24)) + " days"
        data[i].Success = Math.round(data[i].pledged / (data[i].duration / (3600*24)))
    }
    // Here's a list of successful projects!
   createTabel(data);
});


function createTabel(data) {
    $("#example-table").tabulator({
            data:data,
            layout:"fitDataFill",
    //set initial table data

      columns:[
        {title:"Name", field:"project name", sortable:true, width:400},  
        {title:"Goal", field:"goal",formatter:"money", sortable:true,formatterParams:{symbol:"£",precision:"0"},  sorter:"number"},
        {title:"Gathered", field:"pledged",formatter:"money",formatterParams:{symbol:"£",precision:"0"},  sorter:"number"},
       {title:"Category", field:"category", sortable:true},
        {title:"City", field:"city", sortable:true},
        {title:"Creator", field:"creator", sortable:true},
        {title:"Success - £/day", field:"Success", sortable:true},
      ],
        rowFormatter: function(row){
            
          var data = row.getData();
            if(data.pledged >= '1000000'){
                row.getElement().addClass("positive");
            }
        },
        rowClick:function(e, row, data){
            var data = row.getData();
//            if (confirm('You are about to acces the Kickstarter page for this project, Are you sure ?')) {}
                $('#modal').css('display', "block");
                $('#modal h3').text(data["project name"]);
                $('#modal h4').text("Category : " + data['category']);
                $('#modal h5').text("Created by " + data['creator']);
                $('#modal #city').text(data['city']);

                $('#modal #goal').text("Project goal was £ " + (data["goal"].toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,')) + " while the project gathered ");
                $('#modal #pledged').text( + ((data["pledged"] / data["goal"])*100).toFixed(0) + "% funds" );
                    if ((data["pledged"]/ data["goal"])*100 > 100){
                        $('#modal #pledged').css('color','green')
                    }
                $('#modal #days').text(data['Duration']);
                $('#modal #succ').text(data['Success']);
                $('.modal-footer h5').html("<a href="+data.Link+"> See more details about this project </a> ");
        },
    });
    
    $(".tabulator-col-content").attr("title","Click here to sort table.")
    $(".tabulator-cell").attr("title","Click here to view more project details.")
    
    // Modal options
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    } 
}

fetch('https://cors.io/?http://danpopoutanu.ro/Crowdfunding/website/data/indie.json')
  .then(response => response.json())
    .then(data => {
    // Here's a list of successful projects!
    indieData = data;
        console.log(indieData);

   createIndieTabel(indieData);
});
    
function createIndieTabel(indieData) {
    $("#indie-table").tabulator({
            data:indieData,
            layout:"fitDataFill",
    //set initial table data

      columns:[
        {title:"Name", field:"project name", sortable:true, width:400},  
        {title:"Gathered", field:"goal",formatter:"money", sortable:true,formatterParams:{symbol:"£",precision:"0"},  sorter:"number"},
        {title:"Goal", field:"pledged %", sorter:"number"},
         {title:"Category", field:"category", sortable:true}
 
      ],
        rowClick:function(e, row, data){
            var data = row.getData();
            if (confirm('You are about to acces the Kickstarter page for this project, Are you sure ?')) {
                 location.href="http://indiegogo.com/"+data.Link;
            }
        },
    })
};
    
//    CityList = {};
//    var object = [];
//    function getData(){
//        console.log(object);
//        tableData.forEach(function(i){
//            getCoords(i.city);
//        })
//        setTimeout(function() {
//        }, 1000);
//    };
//    
//	getData();
//
//    function getCoords(name){
//        $.get("http://maps.googleapis.com/maps/api/geocode/json?address="+name+"&sensor=false", function(data){
//			if (data.results) {
//				//if the same coordinates occur, increase count
//				var coords = data.results[0].geometry.location.lat + ', ' + data.results[0].geometry.location.lng
//				if (coords in CityList){
//					CityList[coords] += 1;
//				} else {
//					CityList[coords] = 1;
//				}
//			}
//            object = createDataForHeatMap(CityList)
//        })
//    }
//    
//    function createDataForHeatMap(cityList) {
//        var dataHM = []
//        for (var coords in cityList) {
//            var lat = coords.split(', ')[0]
//            var long = coords.split(', ')[1]
//            dataHM.push({lat: lat, lng : long, count: cityList[coords]})
//        }
//        return dataHM;
//    }
//    
//    function getCities(){
//            object = createDataForHeatMap(citylist);
//        };
//    function myMap() {
//		
//		setTimeout(function() {
//			var map = new google.maps.Map(document.getElementById('map'), {
//			  zoom: 5,
//			  center: {lat: 51.508742, lng: -0.120850}
//			});
//
//			// Construct the circle for each value in citymap.
//			// Note: We scale the area of the circle based on the population.
//			for (var i in object) {
//				var city = object[i]
//				// console.log(city.lat + " " + city.lng + " " + city.count)
//				// Add the circle for this city to the map.
//				var cityCircle = new google.maps.Circle({
//					strokeColor: '#FF0000',
//					strokeOpacity: 0.8,
//					strokeWeight: 2,
//					fillColor: '#FF0000',
//					fillOpacity: 0.35,
//					map: map,
//					center: new google.maps.LatLng(city.lat, city.lng),
//					radius: Math.sqrt(city.count) * 10000
//				});
//			}
//        }, 1000);
//    }
//	setTimeout(myMap(), 2000);
