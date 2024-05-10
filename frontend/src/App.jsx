import { useContext, useEffect } from "react";
import * as d3 from "d3";
import GlobalStoreContext from "./store/store";

import "./App.css";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import MDSVariablePlot from "./components/MDSVariablePlot";
import ScatterPlot from "./components/ScatterPlot";

function App() {
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    d3.csv("../data/small.csv", function (d) {
      return {
        "Fiscal Year": d["Fiscal Year"],
        "Payroll Number": +d["Payroll Number"],
        "Agency Name": d["Agency Name"],
        "Last Name": d["Last Name"],
        "First Name": d["First Name"],
        "Mid Init": d["Mid Init"],
        "Agency Start Date": d["Agency Start Date"],
        "Work Location Borough": d["Work Location Borough"],
        "Title Description": d["Title Description"],
        "Leave Status as of June 30": d["Leave Status as of June 30"],
        "Base Salary": +d["Base Salary"],
        "Pay Basis": d["Pay Basis"],
        "Regular Hours": +d["Regular Hours"],
        "Regular Gross Paid": +d["Regular Gross Paid"],
        "OT Hours": +d["OT Hours"],
        "Total OT Paid": +d["Total OT Paid"],
        "Total Other Pay": +d["Total Other Pay"],
        Gender: d["Gender"],
      };
    }).then((d) => {
      // store.setColumns(Object.keys(d[0]))
      store.setPayrollData(d);
    });
  }, []);

  let headerColor = "#002255";
  let panelStyle = { background: "#b6cde3" };
  return (
    <div className="App" style={{ textAlign: "start" }}>
      <div className="header" style={{ background: headerColor }}>
        <h3>NYC Payroll Analytics Dashboard</h3>
      </div>
      <div id="mds" className="panel" style={panelStyle}>
        <MDSVariablePlot />
      </div>
      <div id="scatter" className="panel" style={panelStyle}>
        {/* <h2>Scatter Plot</h2> */}
        <ScatterPlot />
      </div>
      <div
        id="pie"
        className="panel"
        style={{ ...panelStyle, textAlign: "center" }}
      >
        <PieChart />
      </div>
      <div id="bar" className="panel" style={panelStyle}>
        <BarChart />
      </div>
      {/* <div id="time" className="panel" style={panelStyle}>
        <h2>Time </h2>
      </div> */}
      <div id="parallelcoords" className="panel" style={panelStyle}>
        <h2>Parallel Coordinates Plot</h2>
      </div>
    </div>
  );
}

export default App;
