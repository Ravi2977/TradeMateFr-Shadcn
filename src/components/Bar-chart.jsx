"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { Card, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export const description =
  "A fully dynamic bar chart component for visualizing data.";

export function ActiveBarChart({
  chartData,
  chartTitle,
  xAxisKey,
  barKeys,
  barColors,
  chartConfig,
}) {
  return (
    <Card>
      <div className="p-2">
        <CardTitle>{chartTitle}</CardTitle>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            width={chartConfig.width || 500}
            height={chartConfig.height || 300}
            margin={chartConfig.margin || { top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} tickLine={false} />
            <YAxis />
            <Tooltip />
            <Legend />
            {barKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={barColors[index] || "hsl(var(--chart-1))"}
                radius={chartConfig.barRadius || [8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
