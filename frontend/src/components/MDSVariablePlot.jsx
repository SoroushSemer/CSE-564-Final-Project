import "../App.css";
import { useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { GlobalStoreContext } from "../../src/store/store";
import data from "../../data/variables_mds_list.json";

function MDSVariablePlot() {
  const d3Container = useRef(null);

  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    const svg = d3.select(d3Container.current);

    // Set dimensions
    const margin = { top: 50, right: 0, bottom: 0, left: 30 };
    const width = 450 - margin.left - margin.right;
    const height = 340 - margin.top - margin.bottom;

    // const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(clusterIds);

    // Clear SVG before redrawing
    svg.selectAll("*").remove();

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.x) - 0.1, d3.max(data, (d) => d.x)])
      .range([margin.left, width]);
    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.y) - 0.1, d3.max(data, (d) => d.y)])
      .range([height - margin.bottom, 0]);

    // Draw gridlines
    chart
      .append("g")
      .selectAll("line.horizontalGrid")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "horizontalGrid")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d));

    chart
      .append("g")
      .selectAll("line.verticalGrid")
      .data(xScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "verticalGrid")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", 0)
      .attr("y2", height);

    // Draw data points
    chart
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 15)
      .attr("stroke", (d, i) => d3.schemeCategory10[i % 10])
      .attr("stroke-width", 2)
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
      .attr("opacity", 0.6)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        console.log(d.name, " Clicked");
      });

    chart
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("font-size", 10)
      .attr("font-weight", "bold")
      .attr("x", (d) => xScale(d.x))
      .attr("y", (d) => yScale(d.y))
      .attr("text-anchor", "middle") // Add this line to align text to center
      .text((d) =>
        d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name
      )
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        console.log(d.name, " Clicked");
      });
    //   .attr("fill", (d) => colorScale(d.clusterId));

    // Draw arrowheads
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5");

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    chart
      .append("g")
      .attr("transform", `translate(0, ${height - 15})`)
      .call(xAxis);

    chart
      .append("g")
      .attr("transform", `translate(${margin.left}, 0 )`)
      .call(yAxis);

    // X axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("font-weight", "bold")
      .attr("x", width / 2 + 20)
      .attr("y", height + 70)
      .text("MDS Dim. 1");

    // Y axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("font-weight", "bold")
      .attr("y", 20)
      .attr("x", -height / 2)
      .attr("transform", `rotate(-90)`)
      .text("MDS Dim. 2");

    // Add title to the chart
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", 24)
      .attr("font-weight", "bold")
      .attr("x", (width + margin.left + 40) / 2)
      .attr("y", margin.top / 2)
      .text("MDS Variable Plot");
  }, [store]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg
        className="d3-component"
        width={"100%"}
        height={"100%"}
        ref={d3Container}
      />
    </div>
  );
}

export default MDSVariablePlot;
