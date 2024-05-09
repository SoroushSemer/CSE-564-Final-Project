import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const colors = [
    "#1f77b4", // blue
    "#ff7f0e", // orange
    "#2ca02c", // green
    "#d62728", // red
    "#9467bd", // purple
    "#8c564b", // brown
    "#e377c2", // pink
    "#7f7f7f", // gray
    "#bcbd22", // olive
    "#17becf"  // teal
];

export default function PCP(props) {
    let ref = useRef(null);

    useEffect(() => {
        let indexedAttrs = props.pcpAttributes.map((attr, i) => {
            attr['index'] = i
            return attr
        })

        console.log(indexedAttrs)

        let margin = { top: 30, right: 10, bottom: 10, left: 0 };
        const width = props.width - margin.left - margin.right;
        const height = props.height - margin.top - margin.bottom;

        //create the Y axis scales
        let y = {}
        indexedAttrs.forEach((attr) => {
            if (attr.type === 'categorical') {
                //find all categories
                const domain = new Set();
                props.data.forEach(item => domain.add(item[attr.name]))

                //create band scaling
                y[attr.name] = d3.scaleBand()
                    .domain(Array.from(domain))
                    .range([0, height])
            } else {
                //create numerical scaling
                y[attr.name] = d3.scaleLinear()
                    .domain(d3.extent(props.data, function (d) { return +d[attr.name]; }))
                    .range([0, height])
            }
        })

        //create the x axis scale to positon each attribute
        let x = d3.scalePoint()
            .domain(indexedAttrs.map((attr) => attr.name))
            .range([0, width])
            .padding(1)

        //function to draw the line for each data point
        function path(d) {
            return d3.line()(indexedAttrs.map((attr) => [x(attr.name), y[attr.name](d[attr.name])]))
        }

        const svg = d3.select(ref.current)
            .append("svg")
            .attr("width", props.width)
            .attr("height", props.height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll("path")
            .data(props.data)
            .enter()
            .append("path")
            .attr('d', path)
            .style('fill', 'none')
            .style('stroke', (d, i) => colors[props.labels[i]])
            .style("opacity", 0.5)

        svg.selectAll("Axis")
            .data(indexedAttrs)
            .enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + x(d.name) + ")"; })
            .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d.name])); })
            .call(d3.drag()
                .on('start', function(event, d) {
                    d3.select(this).attr('fill', 'orange')
                })
                .on('drag', function(event){
                    const newX = Math.min(Math.max(0, event.x), props.width);
                    d3.select(this).attr('transform', `translate(${newX})`);

                })
                .on('end', function(event, d) {
                    const newX = Math.min(Math.max(0, event.x), props.width);

                    const draggedIndex = Math.round(newX / (props.width / indexedAttrs.length));
                    const updatedPcpAttributes = [...indexedAttrs];
                    const draggedItem = updatedPcpAttributes.splice(d.index, 1)[0];
                    updatedPcpAttributes.splice(draggedIndex, 0, draggedItem);

                    props.handleAxisChange(updatedPcpAttributes)
                }))
            .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function (d) { return d.name; })
                .style("fill", "white")


        return () => {
            d3.select(ref.current).selectAll('*').remove();
        }
    });

    return (
        <div ref={ref} />
    );
}