fetch('https://crowdfundapi.herokuapp.com//kickstarterAllSuccessfullProjects')
  .then(response => response.json())
    .then(data => {
    prepareforVis(data, "Kickstarter");
         console.log(data.length);
    });
    // Here's a list of successful projects!

fetch('https://crowdfundapi.herokuapp.com/indiegogoProjects')
  .then(response => response.json())
    .then(data => {
    indieData = data;
    for (i in indieData){
        indieData[i].pledged= parseInt(indieData[i].goal);
    }
    console.log(indieData);
    prepareforVis(indieData,"Indiegogo");
    });


function prepareforVis(data, title){
    dataset={"children":[]};
    data.forEach (function(i){                  dataset.children.push({'Name':i["projectName"],'Count':Math.round(i.pledged),'Category':i.category});
        return dataset;
    });

    console.log(dataset);

    var diameter = 800;
    var colour = d3.scaleOrdinal(d3.schemeCategory20);
    var width=600;
    var height = 400;

    var bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("body")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");
    svg.append("text")
    .attr("x", (width / 2))
    .attr("y", height/9)
    .attr("text-anchor", "middle")  
    .style("font-size", "30px")
    .style("color","#202e3b")
    .text(title); 


    var nodes = d3.hierarchy(dataset)
        .sum(function(d) { return d.Count; });

    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")
        .style("background-color","white")
        .style("border","2px solid black")

        .style("width","250px")
        .style("height","auto")
        .style("opacity", 0)


    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr('transform', function(d, i) {
                return 'translate('+ d.x +', '+ d.y +')';
        });



    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d,i) {
            return colour(i);
        })

        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);
            div	.html("<p>Project Name: " + d.data.Name + "</br>Project funding :" +(d.data.Count.toLocaleString('en-GB', { style: 'currency', currency: 'GBP'}).slice(0,-3)) + "</br>Project Category: "+ d.data.Category + "</p>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })					
        .on("mouseout", function(d) {		
        div.transition()		
            .duration(500)		
            .style("opacity", 0);	
        });

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
        return d.data.Name.substr(0,20);

        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return (d.data.Count).toLocaleString('en-GB', { style: 'currency', currency: 'GBP'}).slice(0,-3);
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

    }