import { useState, useRef, useEffect } from "react"
import * as d3 from "d3"
import ColorLegend from "../components/colorscale"

// const colorScale = d3
//   .scaleSequential()
//   .interpolator(d3.interpolateRdYlGn)
//   .domain([16, 0]);

export default function HeatmapCell({x, y, width, height, colorScale, data, isActive, handleHover}) {
    const componentRef = useRef(null)

    const magnify = 10
    const values = data.values

    function handleHovers(event, time, resource_type, values) {
        handleHover(event, time, resource_type, values)
        d3.select(event.target.parentNode).raise();
    }

    function getMedian(sorted_array) {
        if (sorted_array.length === 0) {
          return 0
        }
            
        const mid = Math.floor(sorted_array.length / 2);
      
        if (sorted_array.length % 2 === 0) {
          return (sorted_array[mid - 1] + sorted_array[mid]) / 2;
        } else {
          return sorted_array[mid];
        }
      }

    const min_benchmark_value = values[0]
    const median_benchmark_value = getMedian(values)
    const max_benchmark_value = values[values.length - 1]

    useEffect(() => {
        if (isActive) {
            d3.select(componentRef.current).raise();
        }
      }, []);

    return (
        <g>
            <defs>
                <linearGradient id={`linear-gradient-${x}-${y}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={colorScale(min_benchmark_value)} />
                    <stop offset="50%" stopColor={colorScale(median_benchmark_value)} />
                    <stop offset="100%" stopColor={colorScale(max_benchmark_value)} />
                </linearGradient>
            </defs>
            <rect
                rx="4" // round the corners
                x={isActive ? x - magnify/2 : x}
                y={isActive ? y - magnify/2 : y}
                width={isActive ? width + magnify : width}
                height={isActive ? height + magnify : height}
                fill={`url(#linear-gradient-${x}-${y})`}
                stroke="black"
                strokeWidth={isActive ? "2px" : "0px"}
                onMouseEnter={(event) => handleHovers(event, data.time, data.resource_type, values)}
                onMouseLeave={(event) => handleHovers(event, data.time, data.resource_type, values)}
            >
            </rect>
            <text
                x={isActive ? x - magnify/2 + ((width+magnify) / 2) : x}
                y={isActive ? y + magnify/2 : y}
                textAnchor="middle"
                pointerEvents="none"
                fontSize={10}
            >
                {isActive && values ? median_benchmark_value.toFixed(1) + "s" : ""}
            </text>
        </g>
    );
}