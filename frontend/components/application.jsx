import { useState, useRef, useEffect } from "react"
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import * as d3 from "d3";

import Heatmap from "../components/heatmap"
import ColorLegend from "../components/colorscale"

const colorScale = d3
  .scaleSequential()
  .interpolator(d3.interpolateRdYlGn)
  .domain([18, 0]);

const GPU_TYPES = ["H100", "A100-80GB", "A100", "L40S", "A10G", "L4", "T4"]

export default function Application({data}) {
  const [activeIndex, setActiveIndex] = useState(null);

  function handleHover(event, time, resource_type, values) {
    if (event.type === 'mouseenter') {
      setActiveIndex(() => [time, resource_type, values])
    } else {
      setActiveIndex(() => null)
    }
  }

  let sample_string = "[hover over a cell]"
  if (activeIndex) {
    sample_string = "[" + activeIndex[2].map(num => num.toFixed(1) + "s").join(", ") + "]"
  }
  
  return (
    <div className="heatmap-container">
    <Heatmap
        width={1600}
        height={400}
        data={data}
        colorScale={colorScale}
        activeIndex={activeIndex}
        handleHover={handleHover}
    />
    <p className="sample-datapoints">Samples taken during this bucket of time: {sample_string}</p>
    <ColorLegend
        width={700}
        height={100}
        colorScale={colorScale}
    />
    </div>
  );
}