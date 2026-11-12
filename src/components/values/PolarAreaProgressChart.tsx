import type { ProgressSegment } from "@/types";
import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { PolarArea } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels,
);

interface PolarAreaProgressChartProps {
  segments: ProgressSegment[];
}

export function PolarAreaProgressChart({
  segments,
}: PolarAreaProgressChartProps) {
  // Handle empty segments case
  if (!segments || segments.length === 0) {
    return <div>No data available</div>;
  }

  // Define track background color
  const trackColor = "#616161";

  // Create datasets: Background (Track) and Progress
  const data: ChartData<"polarArea"> = {
    labels: segments.map((s) => s.label),
    datasets: [
      {
        // Progress Dataset (Foreground)
        label: "Progress",
        data: segments.map((s) => Math.max(0, s.progress)),
        backgroundColor: segments.map((s) => s.color),
        borderColor: trackColor,
        borderWidth: 5,
      },
      {
        // Track Dataset (Background) with Gray Color
        label: "Track",
        data: segments.map(() => 100), // Always full for track
        backgroundColor: segments.map(() => trackColor),
        borderColor: trackColor, // No border for seamless look or match background
        borderWidth: 6,
      },
    ],
  };

  const options: ChartOptions<"polarArea"> = {
    responsive: true,
    maintainAspectRatio: true,
    layout: {
      padding: 20,
    },
    elements: {
      arc: {
        borderWidth: 5, // Gap between slices
        borderColor: '#f5f5f5', // Should match page background
        borderRadius: 0, // Image shows sharp or slightly rounded. Let's try 0 first or small.
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, // Disable default tooltips to rely on labels? Or keep enabled for generic info
      },
      datalabels: {
        color: 'white',
        font: {
          weight: 'bold',
          size: 14,
          family: 'system-ui'
        },
        formatter: (_value, context) => {
          // Context gives us access to the data index
          const index = context.dataIndex;
          const segment = segments[index];

          if (!segment) return "";

          // Only show labels on the Track dataset (index 1)
          if (context.datasetIndex === 1) { // Track dataset
            return `${segment.completed}/${segment.total}`;
          }
          return "";
        },
        anchor: 'end',
        align: 'start',
        offset: 10, // Push slightly in
        rotation: (context) => {
          // Calculate rotation to make text tangential or perpendicular?
          // Image: Text follows the curve.
          // Chart.js uses degrees.
          // We need the angle of the arc center.
          const chart = context.chart;
          const meta = chart.getDatasetMeta(context.datasetIndex);
          const arc = meta.data[context.dataIndex] as any;
          if (!arc) return 0;

          // arc.startAngle and arc.endAngle are in radians
          const centerAngle = (arc.startAngle + arc.endAngle) / 2;

          // Convert to degrees
          let degrees = centerAngle * (180 / Math.PI);

          // Rotate to be readable (tangential)
          // Default is 0 (horizontal).
          // If we want it radial: degrees + 90
          // If we want it tangential: degrees

          // Adjust for readability (don't want upside down text)
          // This logic might need fine tuning.
          return degrees + 90; // Makes it radial?
          // Let's try radial first as it fits "slice" segments logic usually.
          // Actually, looking at the image:
          // 5/12 is at the top. Top is roughly -90 deg in canvas?
          // It looks like the text is rotated to align with the radius line.
        }
      },
    },
    scales: {
      r: {
        display: false, // Hide all scales/grids
        min: 0,
        max: 100,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div className="w-full max-w-[380px] aspect-square shrink-0 p-4 relative">
      {/* Overlays or custom drawing could happen here if needed */}
      <PolarArea data={data} options={options} />
    </div>
  );
}
