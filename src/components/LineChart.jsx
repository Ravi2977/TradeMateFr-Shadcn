"use client";

import React, { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

const chartConfig = {
  views: {
    label: "Sales, Profits & Remaining",
  },
  sales: {
    label: "Total Sales",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Total Profit",
    color: "hsl(var(--chart-2))",
  },
  totalRemaining: {
    label: "Total Remaining",
    color: "hsl(var(--chart-5))", // Add color for the new chart
  },
};

export function LineChartForSalesAndProfits({ chartData }) {
  const [activeChart, setActiveChart] = useState("sales");
  const [dateFilter, setDateFilter] = useState("all"); // Default filter is "All Data"

  // Get the filtered data based on the date filter
  const filteredData = useMemo(() => {
    if (dateFilter === "all") return chartData;

    const now = new Date();
    const startDate = {
      today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      yesterday: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
      last7days: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
      last30days: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
      last90days: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90),
    }[dateFilter];

    // Special handling for "yesterday" to filter only that specific day
    if (dateFilter === "yesterday") {
      const endOfYesterday = new Date(startDate);
      endOfYesterday.setHours(23, 59, 59, 999);
      return chartData.filter(
        (entry) => new Date(entry.date) >= startDate && new Date(entry.date) <= endOfYesterday
      );
    }

    return chartData.filter((entry) => new Date(entry.date) >= startDate);
  }, [chartData, dateFilter]);

  // Pre-process the data for the chart
  const processedData = useMemo(
    () =>
      filteredData.map((entry) => ({
        date: entry.date,
        sales: entry.totalSales, // Map totalSales to sales
        profit: entry.totalProfit, // Map totalProfit to profit
        totalRemaining: entry.totalRemaining, // Map totalRemaining
      })),
    [filteredData]
  );

  const total = useMemo(
    () => ({
      sales: processedData.reduce((acc, curr) => acc + curr.sales, 0),
      profit: processedData.reduce((acc, curr) => acc + curr.profit, 0),
      totalRemaining: processedData.reduce((acc, curr) => acc + curr.totalRemaining, 0),
    }),
    [processedData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Sales, Profits & Remaining</CardTitle>
          <CardDescription>
            Showing total sales, profits, and remaining values
          </CardDescription>
        </div>
        <div className="flex">
          {["sales", "profit", "totalRemaining"].map((chart) => (
            <button
              key={chart}
              data-active={activeChart === chart}
              className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[chart].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total[chart].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="mb-4 flex gap-4 flex-wrap">
          {["all", "today", "yesterday", "last7days", "last30days", "last90days"].map((filter) => (
            <Button
              key={filter}
              variant={dateFilter === filter ? "default" : "outline"}
              onClick={() => setDateFilter(filter)}
            >
              {filter === "all"
                ? "All Data"
                : filter === "today"
                ? "Today"
                : filter === "yesterday"
                ? "Yesterday"
                : filter === "last7days"
                ? "Last 7 Days"
                : filter === "last30days"
                ? "Last 30 Days"
                : "Last 90 Days"}
            </Button>
          ))}
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={processedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={chartConfig[activeChart].color}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
