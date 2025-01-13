import * as d3 from "d3";
import { useEffect, useRef } from "react";

const COLOR_LEGEND_MARGIN = { top: 38, right: 0, bottom: 38, left: 90 };

export default function ColorLegend(props) {
  const width = props.width
  const height = props.height

  const canvasRef = useRef(null);

  const boundsWidth =
    props.width - COLOR_LEGEND_MARGIN.right - COLOR_LEGEND_MARGIN.left;
  const boundsHeight =
    props.height - COLOR_LEGEND_MARGIN.top - COLOR_LEGEND_MARGIN.bottom;

  const domain = props.colorScale.domain();
  const max = domain[0];
  const xScale = d3.scaleLinear().range([0, boundsWidth]).domain([0, max]);

  const allTicks = xScale.ticks(9).map((tick, i) => {
    return (
      <g key={`tick-${i}`}>
        <line
          key={`line-${i}`}
          x1={xScale(tick)}
          x2={xScale(tick)}
          y1={0}
          y2={boundsHeight + 10}
          stroke="black"
        />
        <text
          key={`key-${i}`}
          x={xScale(tick)}
          y={boundsHeight + 25}
          fontSize={10}
          textAnchor="middle"
        >
          {tick + "s"}
        </text>
      </g>
    );
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      console.log(canvas)
    }
    const context = canvas?.getContext("2d");

    if (!context) {
      return;
    }

    for (let i = 0; i < boundsWidth; ++i) {
      context.fillStyle = props.colorScale((max * i) / boundsWidth);
      context.fillRect(i, 0, 1, boundsHeight);
    }
  }, [props.width, props.height, props.colorScale]);

  return (
    <div style={{ width, height }}>
      <div
        style={{
          position: "relative",
          transform: `translate(${COLOR_LEGEND_MARGIN.left}px,
            ${COLOR_LEGEND_MARGIN.top}px`,
        }}
      >
        <canvas ref={canvasRef} width={boundsWidth} height={boundsHeight} />
        <svg
          width={boundsWidth}
          height={boundsHeight}
          style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
        >
          {allTicks}
        </svg>
      </div>
    </div>
  );
};


