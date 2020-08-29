// Define chart size and margins
var svgWidth = 960;
var svgHeight = 800;

var margin = {
  top: 50,
  right: 30,
  bottom: 120,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}
// Initial Params
var chosenYAxis = "healthcare";

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.5,
      d3.max(data, d => d[chosenYAxis]) * 1.1
    ])
    .range([0, height]);

  return yLinearScale;

}
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// // function used for updating yAxis var upon click on axis label
// function renderAxes(newYScale, yAxis) {
//     var leftAxis = d3.axisLeft(newYScale);
  
//     yAxis.transition()
//       .duration(1000)
//       .call(leftAxis);
  
//     return yAxis;
//   }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, textGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  textGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "poverty") {
      label = "poverty:";
    }
    else if (chosenXAxis === "income"){
      label = "income";
    }
    else {
        label = "age";
      }
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`<br>${label} ${d[chosenXAxis]}`);
      });
  // function used for updating circles group with new tooltip
// function updateToolTip(chosenYAxis, circlesGroup) {
//     var label;
  
//     if (chosenYAxis === "healthcare") {
//       label = "poverty:";
//     }
//     else if (chosenXAxis === "income"){
//       label = "income";
//     }
//     else {
//         label = "age";
//       }
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(function(d) {
//         return (`<br>${label} ${d[chosenXAxis]}`);
//       });


    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

//Load data 
    
d3.csv('assets/data/data.csv')
  .then(function (healthdata) {
    healthdata.forEach(function (data) {
        data.state = +data.abbr;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
     });     


  // xLinearScale function 
  var xLinearScale = xScale(healthdata, chosenXAxis);
  var yLinearScale = yScale(healthdata, chosenYAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthdata, d => d.age)])
    .range([height, 0]);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

//   // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "tan")
    .attr("opacity", ".5");

var textGroup = chartGroup.selectAll("text.state")
    .data(healthdata)
    .enter()
    .append("text")
    .attr("class","state")
    .text(d=>d.abbr)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d.healthcare))
    .style("text-anchor","middle")
  
  // Create location for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty");
  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("active", true)
    .text("Income");
  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age");


// append y axis
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.classed("axis-text", true)
.text("Healthcare");
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 20)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.classed("axis-text", true)
.text("Obesity");
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.classed("axis-text", true)
.text("Smokes");

// var labelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${height / 2}, ${width - 20})`);

// var healthcareLabel = labelsGroup.append("text")
// .attr("x", 20)
// .attr("y", 0)
// .attr("value", "healthcare") // value to grab for event listener
// .classed("active", true)
// .text("Healthcare");
// var obesityLabel = labelsGroup.append("text")
// .attr("x", 40)
// .attr("y", 0)
// .attr("value", "obesity") // value to grab for event listener
// .classed("active", true)
// .text("Obesity");
// var smokesLabel = labelsGroup.append("text")
// .attr("x", 60)
// .attr("y", 0)
// .attr("value", "smokes") // value to grab for event listener
// .classed("active", true)
// .text("Smokes");

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// x axis labels event listener
labelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;

    // console.log(chosenXAxis)

    // updates x scale for new data
    xLinearScale = xScale(healthdata, chosenXAxis);

    // updates x axis with transition
    xAxis = renderAxes(xLinearScale, xAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, textGroup, xLinearScale, chosenXAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenXAxis === "income") {
      incomeLabel
        .classed("active", true)
        .classed("inactive", false);
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
      }

    else {
        ageLabel
        .classed("active", true)
        .classed("inactive", false);    
        incomeLabel
        .classed("active", false)
        .classed("inactive", true);
        povertyLabel
        .classed("active", false)
        .classed("inactive", true);
    }
  }
});

})
