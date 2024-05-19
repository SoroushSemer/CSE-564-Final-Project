import { useState, useEffect, useContext, useRef } from "react";
import * as d3 from "d3";
import GlobalStoreContext from "../store/store";

export default function BarChart() {
  const { store } = useContext(GlobalStoreContext);
  let ref = useRef(null);

  useEffect(() => {
    let width = 290;
    let height = 310;
    let margin = 0;
    let radius = 140;

    const data = { male: 0, female: 0 };
    store.payrollData.forEach((row) => {
      if (row["Gender"] === "male") data["male"] += 1;
      else if (row["Gender"] === "female") data["female"] += 1;
    });

    const color = d3
      .scaleOrdinal()
      .domain(["male", "female"])
      .range(["#69b3a2", "pink"]);

    const pie = d3.pie().value((d) => {
      return d[1];
    });

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const pieData = pie(Object.entries(data));

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg
      .selectAll("mySlices")
      .data(pieData)
      .join("path")
      .attr("d", arc)
      .attr("fill", function (d) {
        return color(d.data[0]);
      })
      .attr("stroke", "black")
      .style("stroke-width", (d) => {
        if (store.gender === d.data[0]) return "3px";
        else return "2px";
      })
      .style("opacity", (d) => {
        if (store.gender === d.data[0]) return 1;
        else if (store.gender === "") return 1;
        else return 0.5;
      })
      .on("click", function (event, d) {
        if (store.gender === d.data[0]) store.setGender("");
        else store.setGender(d.data[0]);
      });

    svg
      .selectAll("mySlices")
      .data(pieData)
      .join("text")
      .text(function (d) {
        let percent = Math.round((d.data[1] / (data.female + data.male)) * 100);
        return d.data[0] + " - " + percent + "%";
      })
      .attr("transform", function (d) {
        return `translate(${arc.centroid(d)})`;
      })
      .on("click", function (event, d) {
        if (store.gender === d.data[0]) store.setGender("");
        else store.setGender(d.data[0]);
      })
      .style("text-anchor", "middle")
      .style("font-size", 17)
      .style("font-weight", (d) => {
        if (d.data[0] === store.gender) {
          return "bold";
        }
      });

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  });

  const chartStyle = {
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "center",
  };

  return (
    <div style={chartStyle}>
      <h2>Gender Pie Chart</h2>
      <div ref={ref} />
    </div>
  );
}
