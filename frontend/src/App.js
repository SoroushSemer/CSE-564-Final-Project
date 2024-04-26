import "./App.css";

function App() {
  let headerColor = "#002255";
  let panelStyle = { background: "#b6cde3" };
  return (
    <div className="App">
      <div className="header" style={{ background: headerColor }}>
        <h3>NYC Payroll Analytics Dashboard</h3>
      </div>
      <div id="mds" className="panel" style={panelStyle}>
        <h2>MDS Plot</h2>
      </div>
      <div id="scatter" className="panel" style={panelStyle}>
        <h2>Scatter Plot</h2>
      </div>
      <div id="pie" className="panel" style={panelStyle}>
        <h2>Pie Chart</h2>
      </div>
      <div id="bar" className="panel" style={panelStyle}>
        <h2>Bar Chart</h2>
      </div>
      <div id="time" className="panel" style={panelStyle}>
        <h2>Time </h2>
      </div>
      <div id="parallelcoords" className="panel" style={panelStyle}>
        <h2>Parallel Coordinates Plot</h2>
      </div>
    </div>
  );
}

export default App;
