//API ENDPOINTS
// All Success - https://crowdfundapi.herokuapp.com//kickstarterAllSuccessfullProjects
// All Not Success - https://crowdfundapi.herokuapp.com/kickstarterAllUnsuccessfullProjects
// All All Projects - https://crowdfundapi.herokuapp.com/kickstarterAllProjects
// Related Projects - https://crowdfundapi.herokuapp.com//kickstarterRelated
// Indie - https://crowdfundapi.herokuapp.com/indiegogoProjects
// POST with id, lat , long and save . https://crowdfundapi.herokuapp.com/indiegogoProjects/addCoords
/// Filter By Creator ID https://crowdfundapi.herokuapp.com/kickstarterProjectsByCreatorId?creatorId=245190432
// Creators list https://crowdfundapi.herokuapp.com/kickstarterCreators


var succesfullData = "";

fetch('https://crowdfundapi.herokuapp.com//kickstarterAllSuccessfullProjects')
  .then(response => response.json())
    .then(data => {
     successfulData = data;
    var i;
    for( i=0;  i < data.length; i++){
        data[i].Duration = Math.round(data[i].duration/(3600*24)) + " days"
        data[i].Success = Math.round(data[i].pledged / (data[i].duration / (3600*24)))
    }

    console.log()
    // Here's a list of successful projects!
   createTabel(data);
});


function createTabel(data) {
    $("#example-table").tabulator({
            data:data,
            layout:"fitColumns",
            pagination:"local", //enable local pagination.
            paginationSize:12,
    //set initial table data

      columns:[
        {title:"Name", field:"projectName", sortable:true, width:400},
//        {title:"Goal", field:"goal",formatter:"money", sortable:true,formatterParams:{symbol:"£",precision:"0"},  sorter:"number"},
        {title:"Gathered", field:"pledged",formatter:"money",formatterParams:{symbol:"£",precision:"0"},  sorter:"number"},
        {title:"City", field:"city", sortable:true},
        {title:"Category", field:"category", sortable:true},
        {title:"Creator", field:"creator", sortable:true},
        //{title:"Success - £/day", field:"Success", sortable:true},
      ],
        rowFormatter: function(row){

          var data = row.getData();
            if(data.pledged >= '1000000'){
                row.getElement().addClass("positive");
            }
        },
        rowClick:function(e, row, data){
            var data = row.getData();
            $('#modal').css('display', "block");
            $('#modal h3').text(data["projectName"]);
            $('#modal h4').text("Category : " + data['category']);
            $('#modal h5').text("Created by " + data['creator']);
            $('#modal #city').text(data['city']);
            $('#modal #goal').text("Project goal was " + (data["goal"].toLocaleString('en-GB', { style: 'currency', currency: 'GBP'}).slice(0,-3)) + " while the project gathered ");
            $('#modal #pledged').text( + ((data["pledged"] / data["goal"])*100).toFixed(0) + "% funds" );
                if ((data["pledged"]/ data["goal"])*100 > 100){
                    $('#modal #pledged').css('color','green')
                }
            $('#modal #days').text(data['Duration']);
            $('#modal #succ').text(data['Success'].toLocaleString('en-GB', { style: 'currency', currency: 'GBP'}).slice(0,-3));
            $('.modal-footer h5').html("<a href="+data.link+"> See more details about this project </a> ");
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

fetch('https://crowdfundapi.herokuapp.com//indiegogoProjects')
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
            pagination:"local", //enable local pagination.
            paginationSize:12,
    //set initial table data

      columns:[
        {title:"Name", field:"projectName", sortable:true, width:400},
        {title:"Gathered", field:"goal",formatter:"money", sortable:true,formatterParams:{symbol:"£",precision:"0"},  sorter:"number"},
        {title:"Backers", field:"backers", sorter:"number"},
         {title:"Category", field:"category", sortable:true}

      ],
        rowClick:function(e, row, data){
            var data = row.getData();
            if (confirm('You are about to acces the Kickstarter page for this project, Are you sure ?')) {
                 location.href="http://indiegogo.com/"+data.link;
            }
        },
    })
};
