import { useState, useEffect, useContext, useRef } from 'react';
import * as d3 from 'd3';
import GlobalStoreContext from "../store/store";

export default function BarChart() {
    const { store } = useContext(GlobalStoreContext);
    let ref = useRef(null);

    useEffect(() => {
        let width = 300
        let height = 300
        let margin = 20
        let radius = Math.min(width, height) / 2 - margin

        const data = { "male": 0, "female": 0 };
        store.payrollData.forEach(row => {
            if (row['Gender'] === "male")
                data['male'] += 1
            else if (row['Gender'] === "female")
                data['female'] += 1
        })

        console.log(Object.entries(data))

        const color = d3.scaleOrdinal()
            .domain(["male", "female"])
            .range(["#9CAF88", "pink"]);

        const pie = d3.pie()
            .value(d => { return d[1] });

        const arc = d3.arc() 
            .innerRadius(0)
            .outerRadius(radius);

        const pieData = pie(Object.entries(data));

        const svg = d3.select(ref.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg
            .selectAll('mySlices')
            .data(pieData)
            .join('path')
            .attr('d', arc)
            .attr('fill', function (d) { return (color(d.data[0])) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            .on("click", function (event, d) {
                store.setGender(d.data[0])
            })

        svg
            .selectAll('mySlices')
            .data(pieData)
            .join('text')
            .text(function (d) { return d.data[0] })
            .attr("transform", function (d) { return `translate(${arc.centroid(d)})` })
            .style("text-anchor", "middle")
            .style("font-size", 17)
            .style("font-weight", (d) => {
                if (d.data[0] === store.gender) {
                    
                }
            });

        return () => {
            d3.select(ref.current).selectAll('*').remove();
        }
    })

    return (
        <>
            <h3>Scatter Plot</h3>
            <div ref={ref} />
        </>
    )
}