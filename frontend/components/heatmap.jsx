import * as d3 from "d3"
import { useMemo } from "react"
import HeatmapCell from "../components/heatmapcell"

const MARGIN = { top: 30, right: 50, bottom: 100, left: 90 };

export default function Heatmap(props) {

    const boundsWidth = props.width - MARGIN.right - MARGIN.left;
    const boundsHeight = props.height - MARGIN.top - MARGIN.bottom;

    const yAxisElements = ["H100", "A100-80GB", "A100", "L40S", "A10G", "L4", "T4"]    
    const xAxisElements = useMemo(() => [...new Set(props.data.map((d) => d.time))], [props.data])

    const yScale = useMemo(() => {
        return d3
          .scaleBand()
          .range([0, boundsHeight])
          .domain(yAxisElements)
          .padding(0.01);
    }, [props.data, props.width]);

    const xScale = useMemo(() => {
        return d3
          .scaleBand()
          .range([0, boundsWidth])
          .domain(xAxisElements)
          .padding(0.01);
    }, [props.data, props.width]);
    
    const yLabels = yAxisElements.map((name, i) => {
        const yPos = yScale(name) ?? 0;
        return (
            <text
            key={i}
            x={-5}
            y={yPos + yScale.bandwidth() / 2}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={15}
            >
            {name}
            </text>
        );
    });

    const xLabels = xAxisElements.map((name, i) => {
        const xPos = xScale(name) ?? 0;

        const dt_element = new Date(name * 1000)
        const date_formatted = `${dt_element.toLocaleString('default', { month: 'short' })}${dt_element.getDate()} ${dt_element.getHours()}:${String(dt_element.getMinutes()).padStart(2, '0')}`

        return (
            <text
            key={i}
            x={xPos + 15}
            y={boundsHeight + 10}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={10}
            transform={`rotate(-45 ${xPos + xScale.bandwidth() / 2} ${boundsHeight + 10})`}
            >
            {date_formatted}
            </text>
        );
    });

    const allRects = props.data.map((d, i) => useMemo(() => {
        if (d.values === null) {
            return;
        }
        
        const isActive = props.activeIndex && d.time === props.activeIndex[0] && d.resource_type === props.activeIndex[1]

        return (
            <HeatmapCell
                key={i}
                x={xScale(d.time) + 0.5}
                y={yScale(d.resource_type) + 0.5}
                width={xScale.bandwidth() - 1}
                height={yScale.bandwidth() - 1}
                colorScale={props.colorScale}
                data={d}
                isActive={isActive}
                handleHover={props.handleHover}
            />
        );
    }, [props.activeIndex, props.data]

    ))

    return (
        <div>
            <svg width={props.width} height={props.height}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
                >
                {allRects}
                {xLabels}
                {yLabels}
                </g>
            </svg>
        </div>
    )
}

