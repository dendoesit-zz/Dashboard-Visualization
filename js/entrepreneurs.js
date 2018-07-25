var succesfullData = "";

fetch('https://crowdfundapi.herokuapp.com//kickstarterRelated')
  .then(response => response.json())
    .then(data => {
     successfulData = data;
    // Here's a list of successful projects!
   createTabel(data);
});


function createTabel(data) {
    $("#entrepreneur-table").tabulator({
            data:data,
            layout:"fitColumns",
    //set initial table data

      columns:[
        {title:"Creator name", field:"creator", sortable:true, width:300},
        {title:"Project Name", field:"projectName", sortable:true, width:400}, 
        {title:"Category", field:"category", sortable:true},
        {title:"City", field:"city", sortable:true},
          {title:"Goal", field:"goal",formatter:"money", sortable:true,formatterParams:{symbol:"£",precision:"0"},  sorter:"number"},
          {title:"Gathered", field:"pledged",formatter:"money",formatterParams:{symbol:"£",precision:"0"},  sorter:"number"},
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
            $('#modal h3').text(data["created"]);
            $('#modal h4').text("Category : " + data['category']);
            $('#modal h5').text("Created by " + data['creator']);
            $('#modal #city').text(data['city']);
            $('#modal #goal').text("Project goal was " + (data["goal"].toLocaleString('en-GB', { style: 'currency', currency: 'GBP'}).slice(0,-3)) + " while the project gathered ");
            $('#modal #pledged').text( + ((data["pledged"] / data["goal"])*100).toFixed(0) + "% funds" );
                if ((data["pledged"]/ data["goal"])*100 > 100){
                    $('#modal #pledged').css('color','green')
                }
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