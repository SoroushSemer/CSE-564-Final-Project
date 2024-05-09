import "../App.css";
import { useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { GlobalStoreContext } from "../../src/store/store";
// import data from "../../data/variables_mds_list.json";

function ScatterPlot() {
  const d3Container = useRef(null);

  const { store } = useContext(GlobalStoreContext);

  let data = store.payrollData;

  let var1 = "Regular Hours";
  let var2 = "Base Salary";

  useEffect(() => {
    const svg = d3.select(d3Container.current);
    var margin = { top: 10, right: 30, bottom: 0, left: 30 },
      width = 500 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    svg.selectAll("*").remove();
    const chart = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    // Add X axis
    var x = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d[var1]), d3.max(data, (d) => d[var1])])
      .range([0, width - margin.left - margin.right]);

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d[var2]), d3.max(data, (d) => d[var2])])
      .range([height, 0]);

    chart
      .append("g")
      .selectAll("line.horizontalGrid")
      .data(y.ticks(5))
      .enter()
      .append("line")
      .attr("class", "horizontalGrid")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d));

    chart
      .append("g")
      .selectAll("line.verticalGrid")
      .data(x.ticks(5))
      .enter()
      .append("line")
      .attr("class", "verticalGrid")
      .attr("x1", (d) => x(d))
      .attr("x2", (d) => x(d))
      .attr("y1", 0)
      .attr("y2", height);

    // Color scale: give me a specie name, I return a color
    var color = d3
      .scaleOrdinal()
      .domain(["male", "female"])
      .range(["#00aaff", "#ff0077"]);

    // Add dots
    var myCircle = svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d[var1]) + margin.left;
      })
      .attr("cy", function (d) {
        return y(d[var2]) - margin.bottom;
      })
      .attr("r", 2)
      .style("fill", function (d) {
        return color(d["Gender"]);
      })
      .style("opacity", 0.5);

    // Add brushing
    svg.call(
      d3
        .brush() // Add the brush feature using the d3.brush function
        .extent([
          [margin.left, 0],
          [width, height],
        ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    );

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
    chart
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(xAxis);

    chart
      .append("g")
      .attr("transform", `translate(${margin.left}, ${-margin.bottom} )`)
      .call(yAxis);

    // Function that is triggered when brushing is performed
    function updateChart() {
      let extent = d3.event;
      console.log(extent);
      myCircle.classed("selected", function (d) {
        return isBrushed(extent, x(d[var1]), y(d[var2]));
      });
    }

    // A function that return TRUE or FALSE according if a dot is in the selection or not
    function isBrushed(brush_coords, cx, cy) {
      var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
    }
  }, [store]);

  return (
    <div style={{ width: "100%", height: "100%", marginTop: "50px" }}>
      <h2 style={{ position: "absolute", top: "7%", left: "33%" }}>
        Scatter Plot
      </h2>
      <svg
        className="d3-component"
        width={"100%"}
        height={"100%"}
        ref={d3Container}
      />
    </div>
  );
}

export default ScatterPlot;
