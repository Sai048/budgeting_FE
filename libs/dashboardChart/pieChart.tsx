"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface PieChartProps {
  data: {
    amountType: string;
    categoryType: string;
    actualAmount: number;
  }[];
  width?: number;
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 400,
  height = 400,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2;
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3
      .pie<{ category: string; value: number }>()
      .value((d) => d.value);
    const path = d3
      .arc<d3.PieArcDatum<{ category: string; value: number }>>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const pieData = data.map((d) => ({
      category: d.categoryType,
      value: d.actualAmount,
    }));

    const arcs = g
      .selectAll(".arc")
      .data(pie(pieData)) 
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", path)
      .attr("fill", (d, i) => color(d.data.category));

    // Add labels
    const label = d3
      .arc<d3.PieArcDatum<{ category: string; value: number }>>()
      .outerRadius(radius)
      .innerRadius(radius - 80);

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${label.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text((d) => d.data.category);
  }, [data, width, height]);

  return <svg ref={ref}></svg>;
};

export default PieChart;



interface BudgetPieChartProps {
  data: {
    amountType: string;
    name: string;
    budget: number;
  }[];
  width?: number;
  height?: number;
}

export const BudgetPieChart: React.FC<BudgetPieChartProps> = ({
  data,
  width = 400,
  height = 400,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2;
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3
      .pie<{ category: string; value: number }>()
      .value((d) => d.value);
    const path = d3
      .arc<d3.PieArcDatum<{ category: string; value: number }>>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const pieData = data.map((d) => ({
      category: d.name,
      value: d.budget,
    }));

    const arcs = g
      .selectAll(".arc")
      .data(pie(pieData)) 
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", path)
      .attr("fill", (d, i) => color(d.data.category));

    // Add labels
    const label = d3
      .arc<d3.PieArcDatum<{ category: string; value: number }>>()
      .outerRadius(radius)
      .innerRadius(radius - 80);

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${label.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text((d) => d.data.category);
  }, [data, width, height]);

  return <svg ref={ref}></svg>;
};


