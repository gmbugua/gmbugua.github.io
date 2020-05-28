var width = 960;
var height = 1100;

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
};

var svg = d3.select(".view")
    .append("svg")
    .attr("class", "ny-map-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var path = d3.geoPath();

var x = d3.scaleSqrt()
    .domain([0, 4500])
    .rangeRound([440, 950]);

var color = d3.scaleThreshold()
    .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
    .range(d3.schemeOrRd[9]);

var color_0 = d3.scaleThreshold()
                .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
                .range(d3.schemeYlGnBu[9]);

d3.json("NY.json").then(function (topology) {
    
    var densities = [];
    
    
    var main_path = svg.append("g")
        .selectAll("path")
        .data(topojson.feature(topology, topology.objects.tracts).features)
        .enter().append("path")
        .attr("fill", function (d) {
            densities.push(d.properties.density);
            return color(d.properties.density);
        })
        .attr("d", path);
    
    console.log(topology.objects.tracts);
    console.log(densities);
        
    svg.append("path")
        .datum(topojson.feature(topology, topology.objects.counties))
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.3)
        .attr("d", path);

    var state_Path = svg.append("path")
        .datum(topojson.feature(topology, topology.objects.sate))
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0)
        .attr("d", path);

    var tract_Path = svg.append("path")
        .datum(topojson.feature(topology, topology.objects.tracts))
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0)
        .attr("d", path);

    var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(0,40)");

    var legend_rectangles = g.selectAll("rect")
        .data(color.range().map(function (d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
        }))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", function (d) {
            return x(d[0]);
        })
        .attr("width", function (d) {
            return x(d[1]) - x(d[0]);
        })
        .attr("fill", function (d) {
            return color(d[0]);
        });

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Population per square mile");

    g.call(d3.axisBottom(x)
            .tickSize(13)
            .tickValues(color.domain()))
        .select(".domain")
        .remove();

    var tractPath_f = 0;
    var statePath_f = 0;
    var legendPath_f = 0;

    // reset button calls the zoom reset button
    d3.select("#legend").on("click", changeLegend);
    d3.select("#tract").on("click", toggleTractPath);
    d3.select("#state").on("click", toggleStatePath);

    function changeLegend() {
        if (legendPath_f == 0) {

            legend_rectangles.transition(6000).attr("fill", function (d) {
                return color_0(d[0]);
            });

            main_path.transition(10000).attr("fill", function (d) {
                return color_0(d.properties.density);
            })

            legendPath_f = 1;

        } else {

            legend_rectangles.transition(10000).ease(d3.easeCubic)
                .attr("fill", function (d) {
                    return color(d[0]);
                });

            main_path.transition(100000).attr("fill", function (d) {
                return color(d.properties.density);
            })

            legendPath_f = 0;

        }
    }

    function toggleTractPath() {
        if (tractPath_f == 0) {
            tract_Path.attr("stroke-opacity", .3);
            tractPath_f = 1;
        } else {
            tract_Path.attr("stroke-opacity", 0);
            tractPath_f = 0;
        }
    }


    function toggleStatePath() {
        if (statePath_f == 0) {
            state_Path.attr("stroke-opacity", .3);
            statePath_f = 1;
        } else {
            state_Path.attr("stroke-opacity", 0);
            statePath_f = 0;
        }
    }



});