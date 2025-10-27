"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DashboardChartProps {
  data: {
    amountType: string;
    categoryType: string;
    actualAmount: number;
  }[];
}

const DashboardChart: React.FC<DashboardChartProps> = ({ data }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    d3.select(chartRef.current).selectAll("*").remove();

    const aggregatedData = d3
      .rollups(
        data,
        (v) => d3.sum(v, (d) => d.actualAmount),
        (d) => d.categoryType,
        (d) => d.amountType
      )
      .flatMap(([category, typeGroups]) =>
        typeGroups.map(([amountType, value]) => ({
          category,
          amountType,
          value,
        }))
      );

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(aggregatedData.map((d) => d.category))
      .range([0, width])
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(aggregatedData, (d) => d.value) ?? 0])
      .nice()
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(aggregatedData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.category) ?? 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => (d.amountType === "Credit" ? "green" : "red"));
  }, [data]);

  return <svg ref={chartRef}></svg>;
};

export default DashboardChart;


interface ExpectedDashboardChartProps {
  data: {
    name: string;
    budget: number;
    amountType: string;
  }[];
}

export const ExpectedDashboardChart: React.FC<ExpectedDashboardChartProps> = ({
  data,
}) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    d3.select(chartRef.current).selectAll("*").remove();

    const aggregatedData = d3
      .rollups(
        data,
        (v) => d3.sum(v, (d) => d.budget),
        (d) => d.name,
        (d) => d.amountType
      )
      .flatMap(([category, typeGroups]) =>
        typeGroups.map(([amountType, value]) => ({
          category,
          amountType,
          value,
        }))
      );

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(aggregatedData.map((d) => d.category))
      .range([0, width])
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(aggregatedData, (d) => d.value) ?? 0])
      .nice()
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(aggregatedData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.category) ?? 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => (d.amountType === "Credit" ? "green" : "red")); 
  }, [data]);

  return <svg ref={chartRef}></svg>;
};
