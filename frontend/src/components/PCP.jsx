import { useContext, useEffect, useRef } from "react";
import * as d3 from "d3";
import GlobalStoreContext from "../store/store";

const categorical = [
  "Fiscal Year",
  "Agency Name",
  "Work Location Borough",
  "Leave Status as of June 30",
  "Pay Basis",
  "Gender",
];
const colors = ["#69b3a2", "pink"];

export default function PCP() {
  let ref = useRef(null);
  const { store } = useContext(GlobalStoreContext);

  let columns = [];
  if (store.payrollData.length !== 0) {
    let exclude = [
      "Payroll Number",
      "Last Name",
      "First Name",
      "Mid Init",
      "Title Description",
    ];
    columns = Object.keys(store.payrollData[0]).filter(
      (d) => !exclude.includes(d)
    );
  }

  useEffect(() => {
    let splicedPayroll = store.payrollData.splice(0, 1500);

    if (store.gender == "male") {
      splicedPayroll = splicedPayroll.filter((d) => {
        if (d["Gender"] == "male") {
          return true;
        }
      });
    } else if (store.gender == "female") {
      splicedPayroll = splicedPayroll.filter((d) => {
        if (d["Gender"] == "female") {
          return true;
        }
      });
    }

    let columnsToShow = [];
    if (store.pcp_columns.length == 0) {
      columnsToShow = columns;
    } else {
      columnsToShow = store.pcp_columns;
    }

    console.log(columnsToShow);

    let indexedAttrs = columnsToShow.map((attr, i) => {
      let type = "";
      if (categorical.includes(attr)) {
        type = "categorical";
      } else {
        type = "numerical";
      }
      let newAttr = {
        name: attr,
        type: type,
        index: i,
      };
      return newAttr;
    });

    const pWidth = 1500;
    const pHeight = 450;

    let margin = { top: 80, right: 10, bottom: 10, left: 0 };
    const width = pWidth - margin.left - margin.right;
    const height = pHeight - margin.top - margin.bottom;

    //create the Y axis scales
    let y = {};
    indexedAttrs.forEach((attr) => {
      if (attr.type === "categorical") {
        //find all categories
        const domain = new Set();
        splicedPayroll.forEach((item) => domain.add(item[attr.name]));

        //create band scaling
        y[attr.name] = d3
          .scaleBand()
          .domain(Array.from(domain))
          .range([0, height]);
      } else {
        //create numerical scaling
        y[attr.name] = d3
          .scaleLinear()
          .domain(
            d3.extent(splicedPayroll, function (d) {
              return +d[attr.name];
            })
          )
          .range([0, height]);
      }
    });

    //create the x axis scale to positon each attribute
    let x = d3
      .scalePoint()
      .domain(indexedAttrs.map((attr) => attr.name))
      .range([0, width])
      .padding(1);

    //function to draw the line for each data point
    function path(d) {
      return d3.line()(
        indexedAttrs.map((attr) => [x(attr.name), y[attr.name](d[attr.name])])
      );
    }

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", pWidth)
      .attr("height", pHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
      .selectAll("path")
      .data(splicedPayroll)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", "none")
      .style("stroke", (d, i) => {
        if (d["Gender"] == "male") return colors[0];
        else if (d["Gender"] == "female") {
          return colors[1];
        }
      })
      .style("opacity", 0.5);

    svg
      .selectAll("Axis")
      .data(indexedAttrs)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + x(d.name) + ")";
      })
      .each(function (d) {
        d3.select(this).call(
          d3
            .axisLeft()
            .scale(y[d.name])
            .tickFormat((d) => {
              console.log(d);
              return typeof d === "string" && d.length > 11
                ? d.slice(0, 10) + "..."
                : d;
            })
        );
      })
      .call(
        d3
          .drag()
          .on("start", function (event, d) {
            d3.select(this).attr("fill", "orange");
          })
          .on("drag", function (event) {
            const newX = Math.min(Math.max(0, event.x), pWidth);
            d3.select(this).attr("transform", `translate(${newX})`);
          })
          .on("end", function (event, d) {
            const newX = Math.min(Math.max(0, event.x), pWidth);

            const draggedIndex = Math.round(
              newX / (pWidth / indexedAttrs.length)
            );
            const updatedPcpAttributes = [...indexedAttrs];
            const draggedItem = updatedPcpAttributes.splice(d.index, 1)[0];
            updatedPcpAttributes.splice(draggedIndex, 0, draggedItem);

            store.changePCP(updatedPcpAttributes);
          })
      )
      .append("text")
      .style("text-anchor", "middle")
      .attr("x", 40)
      .attr("y", -9)
      .text(function (d) {
        return d.name;
      })
      .style("font-weight", "bold")
      .style("transform", "rotate(90deg)")
      .style("fill", "black");

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  });

  const resetHandler = () => {
    store.changePCP([]);
  };

  return (
    <>
      <h2 style={{ position: "absolute", left: 600 }}>
        Parallel Coordinates Plot
      </h2>
      <div ref={ref} style={{ position: "absolute" }} />
      <button onClick={resetHandler}>Reset</button>
    </>
  );
}
