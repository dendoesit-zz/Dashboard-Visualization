var succesfullData = "";

fetch('https://crowdfundapi.herokuapp.com/kickstarterCreators')
  .then(response => response.json())
    .then(data => {
     successfulData = data;
    // Here's a list of successful projects!
      for( i=0;  i < data.length; i++) {
        if(data[i].noSuccess != 0 ){
          data[i].Success = Math.floor(data[i].noSuccess / (data[i].noFails +data[i].noSuccess) * 100) + " % ";
        }else{
          data[i].Success = '0%';
      }}
   createTabel(data);
});


function createTabel(data) {
    $("#entrepreneur-table").tabulator({
            data:data,
            tooltips:true,
            pagination:"local", //enable local pagination.
            paginationSize:15,
            layout:"fitColumns",
    //set initial table data

      columns:[
        {title:"Creator name", field:"creator", sortable:true, width:400},
        {title:"Projects No.", field:"noProjects", sortable:true, width:200},
        {title:"Projects Success Rate", field:"Success", formatter:"progress",sortable:true},
        {title:"Gathered", field:"money",formatter:"money",formatterParams:{symbol:"£",precision:"0"},  sorter:"number"},
      ],
        rowFormatter: function(row){

          var data = row.getData();
            if(data.pledged >= '1000000'){
                row.getElement().addClass("positive");
            }
        },
        rowClick:function(e, row, data){
            var data = row.getData();
            console.log(data.creatorId);
          fetch('https://crowdfundapi.herokuapp.com/kickstarterProjectsByCreatorId?creatorId='+ data.creatorId)
            .then(response => response.json())
            .then(data => {
              successfulData = data;
              console.log(data);
              for (i in data) {
                data[i].Success = Math.round(data[i].pledged / (data[i].duration / (3600 * 24))) + " £/days";
                data[i].Days = Math.round(data[i].duration / (3600 * 24)) + " days";
                // Here's a list of successful projects!
              }
              ProjectList(data);
            });


            $('#modal').css('display', "block");
        },
    });

    $(".tabulator-col-content").attr("title","Click here to sort table.")
    $(".tabulator-cell").attr("title","Click here to view more project details.")

    // Modal options
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        location.reload();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
          location.reload();
        }
    }


  function ProjectList(data) {
    $("#projects-table").tabulator({
      data:data,
      layout:"fitColumns",
      //set initial table data
      columns:[
        {title:"Name", field:"projectName", sortable:true, width:300},
        {title:"State", field:"state", sortable:true},
        {title:"Category", field:"category", sortable:true},
        {title:"City", field:"city", sortable:true},
        {title:"Goal", field:"goal",formatter:"money", sortable:true,formatterParams:{symbol:"£",precision:"0"},  sorter:"number"},
        {title:"Gathered", field:"pledged",formatter:"money",formatterParams:{symbol:"£",precision:"0"},  sorter:"number"},
        {title:"Days", field:"Days", sortable:true},
        {title:"Success", field:"Success", sortable:true},
        //{title:"Success - £/day", field:"Success", sortable:true},
      ],
      rowFormatter: function(row){

        var data = row.getData();
        if(data.pledged >= '1000000'){
          row.getElement().addClass("positive");
        }
      },
    })
  }
}
