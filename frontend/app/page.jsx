"use client";

import { useState } from "react"
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import Application from "../components/application"

const GPU_TYPES = ["B200", "H200", "H100", "A100-80GB", "A100", "L40S", "A10G", "L4", "T4"]

export default function Home() {
  const [hourGranularity, setHourGranularity] = useState(6);
  const queue_times = useQuery(api.queue_times.get)

  if (!queue_times) {
    return
  }

  queue_times.sort((a, b) => b.time - a.time)

  const queue_times_bucket_to_gpu_samples = {}

  const min_time = queue_times[queue_times.length - 1].time

  const time_markers = []
  for (let i=min_time; i <= Math.floor(Date.now() / 1000); i += (60 * 60 * hourGranularity)) {
    time_markers.push(i)
  }

  // Get rid of old time markers, we only want to show what can fit the page
  const time_markers_sliced = time_markers.slice(-41)

  for (const time_marker of time_markers_sliced) {
    queue_times_bucket_to_gpu_samples[time_marker] = {}
    GPU_TYPES.forEach(gpu_type => {
      queue_times_bucket_to_gpu_samples[time_marker][gpu_type] = []
    })
  }

  const recent_queue_times = queue_times.filter(item => item.time >= time_markers_sliced[0]);

  time_markers_sliced.reverse()
  let current_time_marker_index = 0
  let current_time_marker = time_markers_sliced[current_time_marker_index]

  // Aggregate the data points into buckets of time
  for (const queue_time of recent_queue_times) {
    while (queue_time.time < current_time_marker) {
      current_time_marker_index++
      current_time_marker = time_markers_sliced[current_time_marker_index]
    }
    queue_times_bucket_to_gpu_samples[current_time_marker][queue_time.resource_type].push(queue_time.value)
  }

  // Reconstruct data as an array of objects, where each object contains gpu type, benchmark time, timestamp
  const queue_types_bucketed = []
  for (const [queue_time_key, gpu_samples] of Object.entries(queue_times_bucket_to_gpu_samples)) {
    for (const [gpu_sample_key, bucketed_benchmark_values] of Object.entries(gpu_samples)) {
      queue_types_bucketed.push({
        "resource_type": gpu_sample_key,
        "time": queue_time_key,
        "values": bucketed_benchmark_values.sort((a, b) => a - b)
      })
    }
  }

  function handleClick(event) {
    const button_id = event.target.id
    if (button_id === "button1") {
      setHourGranularity(() => 0.5) // 0.5hr increments is about 1 day of data
    } else if (button_id === "button5") {
      setHourGranularity(() => 3) // 3hr increments is about 5 days of data
    } else if (button_id === "button10") {
      setHourGranularity(() => 6) //6hr increments is about 10 days of data
    }
  }
  
  return (
    <main>
      <div className="github-link-div"><a href="https://github.com/sandcat100/modal-queue-map" target="_blank" rel="noopener noreferrer">[github]</a></div>
      <h1>How quickly can you get a GPU on Modal?</h1>
      <h2>Median TTYCR (time to your code running) sampled on each of our GPU types 🏎️</h2>
      <div className="time-selector-div">
        <button onClick={(event) => handleClick(event)} id="button1" className={hourGranularity === 0.5 ? "selected-button" : ""}>Last day</button>
        <button onClick={(event) => handleClick(event)} id="button5" className={hourGranularity === 3 ? "selected-button" : ""}>Last 5 days</button>
        <button onClick={(event) => handleClick(event)} id="button10" className={hourGranularity === 6 ? "selected-button" : ""}>Last 10 days</button>
      </div>
      {queue_times && <Application
        data={queue_types_bucketed}
      />
      }
    </main>
  );
}