import { useState, useEffect, useContext, useRef } from "react";
import * as d3 from "d3";
import GlobalStoreContext from "../store/store";

const categorical = [
  "Fiscal Year",
  "Agency Name",
  "Work Location Borough",
  "Leave Status as of June 30",
  "Pay Basis",
];

function wrapText(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineHeight = 1.1, // Adjust line height if needed
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")) || 0,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

export default function BarChart() {
  const { store } = useContext(GlobalStoreContext);
  let ref = useRef(null);

  //get the columns for the dataset
  let columns = [];
  if (store.payrollData.length !== 0) {
    let exclude = [
      "Payroll Number",
      "Last Name",
      "First Name",
      "Mid Init",
      "Title Description",
      "Gender",
    ];
    columns = Object.keys(store.payrollData[0]).filter(
      (d) => !exclude.includes(d)
    );
  }

  let [attribute, setAttribute] = useState("");

  useEffect(() => {
    //separate the data by male and female
    let male_data = [];
    let female_data = [];
    store.payrollData.map((d) => {
      if (d["Gender"] === "female") female_data.push(d);
      else if (d["Gender"] === "male") male_data.push(d);
    });

    if (store.gender === "male") female_data = [];

    if (store.gender === "female") male_data = [];

    const width = 500;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };

    //check for the type of data
    if (categorical.includes(attribute)) {
      //get the domain
      let domain = {};
      store.payrollData.forEach(
        (row) =>
          (domain[row[attribute]] = {
            male: 0,
            female: 0,
          })
      );

      male_data.forEach(
        (row) =>
          (domain[row[attribute]]["male"] = domain[row[attribute]]["male"] + 1)
      );

      female_data.forEach(
        (row) =>
          (domain[row[attribute]]["female"] =
            domain[row[attribute]]["female"] + 1)
      );

      const bardata = Object.keys(domain).map((key) => ({
        key,
        count: domain[key],
      }));

      console.log(bardata);

      const xDomain = [0, 40000];
      const yDomain = Object.keys(domain);

      const xScale = d3.scaleLinear(xDomain, [
        margin.left,
        width - margin.right,
      ]);

      console.log(margin.left, xScale(0));

      const yScale = d3
        .scaleBand(yDomain, [height - margin.bottom, margin.top])
        .padding(0.1);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      const svg = d3
        .select(ref.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("x", -10)
        .attr("y", 0)
        .style("text-anchor", "end");

      svg
        .append("g")
        .selectAll("rect")
        .data(bardata)
        .join("rect")
        .attr("x", margin.left)
        .attr("y", (d) => yScale(d.key))
        .attr("width", (d) => xScale(d.count["male"]) - margin.left)
        .attr("height", (d) => yScale.bandwidth())
        .attr("fill", "#69b3a2")
        .style("opacity", 0.7);

      svg
        .append("g")
        .selectAll("rect")
        .data(bardata)
        .join("rect")
        .attr("x", (d) => margin.left + xScale(d.count["male"]) - margin.left)
        .attr("y", (d, i) => yScale(d.key))
        .attr("width", (d, i) => xScale(d.count["female"]) - margin.left)
        .attr("height", (d) => yScale.bandwidth())
        .attr("fill", "pink")
        .style("opacity", 0.7);

      svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .text("Frequency of people");
      svg
        .append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2 - attribute.length * 5)
        .attr("y", 20)
        .text(attribute);
    } else {
      //draw histogram for numerical data
      let numBins;
      const values = store.payrollData.map((d) => d[attribute]);
      const min = d3.min(values) ?? 0;
      const max = d3.max(values) ?? 0;
      if (max - min > 10) numBins = 10;
      else numBins = max;

      const binGen = d3
        .bin()
        .domain([min ?? 0, max ?? 0])
        .thresholds(numBins);
      const bins = binGen(values);

      //calculate male and female
      const binCounts = {};
      bins.forEach((bin, index) => {
        binCounts[index] = {
          x0: bin.x0,
          x1: bin.x1,
          male: 0,
          female: 0,
        };
      });

      male_data.forEach((d) => {
        const binIndex = bins.findIndex(
          (bin) => d[attribute] >= bin.x0 && d[attribute] < bin.x1
        );
        if (binIndex != -1)
          binCounts[binIndex].male = binCounts[binIndex].male + 1;
      });

      female_data.forEach((d) => {
        const binIndex = bins.findIndex(
          (bin) => d[attribute] >= bin.x0 && d[attribute] < bin.x1
        );
        if (binIndex != -1)
          binCounts[binIndex].female = binCounts[binIndex].female + 1;
      });

      const bardata = Object.keys(binCounts).map((key) => ({
        key,
        x0: binCounts[key].x0,
        x1: binCounts[key].x1,
        male: binCounts[key].male,
        female: binCounts[key].female,
      }));

      const XDomain = [0, d3.max(bins, (d) => d.length) ?? 0 + 10];
      const YDomain = [bins[0].x0 ?? 0, bins[bins.length - 1].x1 ?? 0];

      const XRange = [margin.left, width - margin.right];
      const YRange = [height - margin.bottom, margin.top];

      const XScale = d3.scaleLinear(XDomain, XRange);
      const YScale = d3.scaleLinear(YDomain, YRange);

      const XAxis = d3.axisBottom(XScale);
      const YAxis = d3.axisLeft(YScale);

      const svg = d3
        .select(ref.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(XAxis);

      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(YAxis);

      svg
        .append("g")
        .selectAll("rect")
        .data(bardata)
        .join("rect")
        .attr("x", margin.left)
        .attr("y", (d) => YScale(d.x1 ?? 0))
        .attr("width", (d) => XScale(d.male) - margin.left)
        .attr("height", (d) =>
          Math.max(YScale(d.x0 ?? 0) - YScale(d.x1 ?? 0) - 1, 0)
        )
        .attr("fill", "#69b3a2");

      svg
        .append("g")
        .selectAll("rect")
        .data(bardata)
        .join("rect")
        .attr("x", (d) => margin.left + XScale(d.male) - margin.left)
        .attr("y", (d) => YScale(d.x1 ?? 0))
        .attr("width", (d) => XScale(d.female) - margin.left)
        .attr("height", (d) =>
          Math.max(YScale(d.x0 ?? 0) - YScale(d.x1 ?? 0) - 1, 0)
        )
        .attr("fill", "pink");

      svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .text("Frequency of people");
      svg
        .append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2 - attribute.length * 5)
        .attr("y", 20)
        .text(attribute);
    }

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, [attribute, store.gender]);

  const handleAttributeChange = (event) => {
    setAttribute(event.target.value);
  };

  return (
    <>
      <label>{attribute} vs. Frequency</label>
      <div ref={ref} />
      <label htmlFor="var1_dropdown">Select Attribute: </label>
      <select
        id="var1_dropdown"
        defaultValue={attribute}
        onChange={handleAttributeChange}
      >
        <option value={null} disabled>
          -- Please select --
        </option>
        {columns.map((menuItem, i) => {
          return (
            <option key={i} value={menuItem}>
              {menuItem}
            </option>
          );
        })}
      </select>
    </>
  );
}
