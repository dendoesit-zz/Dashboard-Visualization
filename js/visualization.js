fetch('https://cors.io/?http://danpopoutanu.ro/Crowdfunding/website/data/results.json')
  .then(response => response.json())
    .then(data => {
    prepareforVis(data);
         console.log(data.length);
    });
    // Here's a list of successful projects!

fetch('https://cors.io/?http://danpopoutanu.ro/Crowdfunding/website/data/indie.json')
  .then(response => response.json())
    .then(data => {
    indieData = data;
    console.log(indieData);
    prepareforVis(indieData);
    });


    function prepareforVis(data){
        dataset={"children":[]};
        data.forEach (function(i){
                dataset.children.push({'Name':i["project name"],'Count':i.goal,'Category':i.category});
        return dataset;
        });
    
        console.log(dataset);

// dataset = {
//            "children": [{"Name":"Olives","Count":4319},
//                {"Name":"Tea","Count":4159},
//                {"Name":"Mashed Potatoes","Count":2583},
//                {"Name":"Boiled Potatoes","Count":2074},
//                {"Name":"Milk","Count":1894},
//                {"Name":"Chicken Salad","Count":1809},
//                {"Name":"Vanilla Ice Cream","Count":1713},
//                {"Name":"Cocoa","Count":1636},
//                {"Name":"Lettuce Salad","Count":1566},
//                {"Name":"Lobster Salad","Count":1511},
//                {"Name":"Chocolate","Count":1489},
//                {"Name":"Apple Pie","Count":1487},
//                {"Name":"Orange Juice","Count":1423},
//                {"Name":"American Cheese","Count":1372},
//                {"Name":"Green Peas","Count":1341},
//                {"Name":"Assorted Cakes","Count":1331},
//                {"Name":"French Fried Potatoes","Count":1328},
//                {"Name":"Potato Salad","Count":1306},
//                {"Name":"Baked Potatoes","Count":1293},
//                {"Name":"Roquefort","Count":1273},
//                {"Name":"Stewed Prunes","Count":1268}]
//        };
        
        var diameter = 800;
        var colour = d3.scaleOrdinal(d3.schemeCategory10);
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

        var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.Count; });

        var div = d3.select("body").append("div")	
            .attr("class", "tooltip")
            .style("background-color","white")
            .style("border","2px solid black")

            .style("width","250px")
            .style("height","auto")
            .style("opacity", 0);


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
                div	.html(("<p>Project Name: " + d.data.Name + "</br>Project funding : £" +(d.data.Count.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,')) + "</br>Project Category: "+ d.data.Category + "</p>"))
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
                return d.data.Count;
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");
        
        }
//
//   var width = 960,
//    height = 500,
//    padding = 1.5, // separation between same-color nodes
//    clusterPadding = 6, // separation between different-color nodes
//    maxRadius = 12;
//
//var n = 200, // total number of nodes
//    m = 2; // number of distinct clusters
//
//var color = d3.scaleOrdinal(d3.schemeCategory10)
//    .domain(d3.range(m));
//
//// The largest node for each cluster.
//var clusters = new Array(m);
//
//var nodes = d3.range(n).map(function() {
//  var i = Math.floor(Math.random() * m),
//      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
//      d = {cluster: i, radius: r};
//  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
//  return d;
//});
//
//// Use the pack layout to initialize node positions.
//d3.layout.pack()
//    .sort(null)
//    .size([width, height])
//    .children(function(d) { return d.values; })
//    .value(function(d) { return d.radius * d.radius; })
//    .nodes({values: d3.nest()
//      .key(function(d) { return d.cluster; })
//      .entries(nodes)});
//
//var force = d3.layout.force()
//    .nodes(nodes)
//    .size([width, height])
//    .gravity(.02)
//    .charge(0)
//    .on("tick", tick)
//    .start();
//
//var svg = d3.select("body").append("svg")
//    .attr("width", width)
//    .attr("height", height);
//
//var node = svg.selectAll("circle")
//    .data(nodes)
//  .enter().append("circle")
//    .style("fill", function(d) { return color(d.cluster); })
//    .call(force.drag);
//
//node.transition()
//    .duration(750)
//    .delay(function(d, i) { return i * 5; })
//    .attrTween("r", function(d) {
//      var i = d3.interpolate(0, d.radius);
//      return function(t) { return d.radius = i(t); };
//    });
//
//function tick(e) {
//  node
//      .each(cluster(10 * e.alpha * e.alpha))
//      .each(collide(.5))
//      .attr("cx", function(d) { return d.x; })
//      .attr("cy", function(d) { return d.y; });
//}
//
//// Move d to be adjacent to the cluster node.
//function cluster(alpha) {
//  return function(d) {
//    var cluster = clusters[d.cluster];
//    if (cluster === d) return;
//    var x = d.x - cluster.x,
//        y = d.y - cluster.y,
//        l = Math.sqrt(x * x + y * y),
//        r = d.radius + cluster.radius;
//    if (l != r) {
//      l = (l - r) / l * alpha;
//      d.x -= x *= l;
//      d.y -= y *= l;
//      cluster.x += x;
//      cluster.y += y;
//    }
//  };
//}
//
//// Resolves collisions between d and all other circles.
//function collide(alpha) {
//  var quadtree = d3.geom.quadtree(nodes);
//  return function(d) {
//    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
//        nx1 = d.x - r,
//        nx2 = d.x + r,
//        ny1 = d.y - r,
//        ny2 = d.y + r;
//    quadtree.visit(function(quad, x1, y1, x2, y2) {
//      if (quad.point && (quad.point !== d)) {
//        var x = d.x - quad.point.x,
//            y = d.y - quad.point.y,
//            l = Math.sqrt(x * x + y * y),
//            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
//        if (l < r) {
//          l = (l - r) / l * alpha;
//          d.x -= x *= l;
//          d.y -= y *= l;
//          quad.point.x += x;
//          quad.point.y += y;
//        }
//      }
//      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//    });
//  };
//}
//
