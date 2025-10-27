"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Transaction {
  amountType: "Credit" | "Debit";
  actualAmount: number | string;
}

interface PieChartProps {
  data: Transaction[];
  width?: number;
  height?: number;
}

const PieChartSummary: React.FC<PieChartProps> = ({ data, width = 400, height = 400 }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

   
    const totals = data.reduce(
      (acc, curr) => {
        const amount = Number(curr.actualAmount);
        if (curr.amountType === "Credit") acc.Credit += amount;
        else acc.Debit += amount;
        return acc;
      },
      { Credit: 0, Debit: 0 }
    );

    const pieData = [
      { type: "Credit", value: totals.Credit },
      { type: "Debit", value: totals.Debit },
    ];

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2;
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(["#4CAF50", "#F44336"]); // Green for Credit, Red for Debit

    const pie = d3.pie<{ type: string; value: number }>().value(d => d.value);

    const path = d3
      .arc<d3.PieArcDatum<{ type: string; value: number }>>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const arcs = g
      .selectAll(".arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path").attr("d", path).attr("fill", d => color(d.data.type));

    // Add labels
    const label = d3
      .arc<d3.PieArcDatum<{ type: string; value: number }>>()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    arcs
      .append("text")
      .attr("transform", d => `translate(${label.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "#fff")
      .text(d => `${d.data.type}: ${d.data.value}`);
  }, [data, width, height]);

  return <svg ref={ref}></svg>;
};

export default PieChartSummary;
