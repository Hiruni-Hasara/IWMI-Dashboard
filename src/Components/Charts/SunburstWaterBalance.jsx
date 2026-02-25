import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const TRANSPARENT = "rgba(0,0,0,0)";
const SW_COLOR    = "#38bdf8";  // electric sky blue for SW inflow

// ── Dark-theme vibrant palette ───────────────────────────────────
// L3 outer ring
const C_TOTAL_CONSUMED = "#0d9488";   // deep teal
const C_NET_INFLOW     = "#f43f5e";   // vivid rose-red
const C_MSO_L3         = "#6366f1";   // electric indigo

// L2 middle ring
const C_LANDSCAPE_ET   = "#14b8a6";   // bright teal
const C_MANMADE        = "#2dd4bf";   // aqua teal
const C_GROSS_INFLOW   = "#64748b";   // slate
const C_DELTA_S        = "#475569";   // dark slate
const C_MSO_L2         = "#818cf8";   // soft indigo

// L1 inner ring
const C_GREEN_ET       = "#4ade80";   // neon green
const C_BLUE_ET_N      = "#93c5fd";   // sky blue
const C_BLUE_ET_M      = "#38bdf8";   // electric blue
const C_CONS_WATER     = "#fb923c";   // warm orange
const C_P_RAINFALL     = "#94a3b8";   // cool grey
const C_SW_OUTFLOW     = "#a78bfa";   // soft violet
const C_RETURN_FLOW    = "#c084fc";   // lavender

const DATA = {
  2016: {
    P:            { v: 816.3,  s: 38 }, SWInflow: { v: 166.4, s: 14 },
    SW_part1:     { s: 12 }, SW_part2: { s: 2 },
    GreenET:      { v: 515.4,  s: 23 }, BlueET_N: { v: 187.9, s: 7 },
    BlueET_M:     { v: 50.2,   s: 3  }, ConsWater: { v: 82.7, s: 7 },
    SWOutflow:    { v: 35.4,   s: 2  }, ReturnFlow: { v: 92.8, s: 8 },
    DeltaS:       { v: -18.3,  s: 2  },
    GrossInflow:  { v: 982.7  }, LandscapeET: { v: 703.3 }, ManmadeCons: { v: 132.9 },
    MSO_L2:       { v: 128.2  }, NetInflow:   { v: 964.4 }, TotalConsumed: { v: 836.1 }, MSO_L1: { v: 128.2 },
  },
  2017: {
    P:            { v: 983,    s: 40 }, SWInflow: { v: 165.5, s: 25 },
    SW_part1:     { s: 10 }, SW_part2: { s: 15 },
    GreenET:      { v: 476,    s: 25 }, BlueET_N: { v: 182.9, s: 10 },
    BlueET_M:     { v: 31.6,   s: 1  }, ConsWater: { v: 76, s: 4 },
    SWOutflow:    { v: 17.2,   s: 1  }, ReturnFlow: { v: 125.8, s: 9 },
    DeltaS:       { v: -239,   s: 15 },
    GrossInflow:  { v: 1148.5 }, LandscapeET: { v: 658.9 }, ManmadeCons: { v: 107.6 },
    MSO_L2:       { v: 143.1  }, NetInflow:   { v: 909.6 }, TotalConsumed: { v: 766.5 }, MSO_L1: { v: 143.1 },
  },
  2018: {
    P:            { v: 1272,   s: 45 }, SWInflow: { v: 165.6, s: 10 },
    SW_part1:     { s: 5  }, SW_part2: { s: 5 },
    GreenET:      { v: 653.6,  s: 25 }, BlueET_N: { v: 286.7, s: 10 },
    BlueET_M:     { v: 77,     s: 2  }, ConsWater: { v: 127.6, s: 5 },
    SWOutflow:    { v: 11.6,   s: 1  }, ReturnFlow: { v: 131.1, s: 6 },
    DeltaS:       { v: -150,   s: 5  },
    GrossInflow:  { v: 1437.6 }, LandscapeET: { v: 940.3 }, ManmadeCons: { v: 204.6 },
    MSO_L2:       { v: 142.7  }, NetInflow:   { v: 1287.6 }, TotalConsumed: { v: 1144.9 }, MSO_L1: { v: 142.7 },
  },
  2019: {
    P:            { v: 1100.1, s: 45 }, SWInflow: { v: 168.1, s: 7 },
    SW_part1:     { s: 5  }, SW_part2: { s: 2 },
    GreenET:      { v: 656.7,  s: 20 }, BlueET_N: { v: 296.4, s: 10 },
    BlueET_M:     { v: 86.4,   s: 2  }, ConsWater: { v: 102.9, s: 8 },
    SWOutflow:    { v: 37.2,   s: 1  }, ReturnFlow: { v: 129.2, s: 9 },
    DeltaS:       { v: 40.5,   s: 2  },
    GrossInflow:  { v: 1268.3 }, LandscapeET: { v: 953.1 }, ManmadeCons: { v: 189.3 },
    MSO_L2:       { v: 166.4  }, NetInflow:   { v: 1308.7 }, TotalConsumed: { v: 1142.4 }, MSO_L1: { v: 166.4 },
  },
  2020: {
    P:            { v: 776,    s: 40 }, SWInflow: { v: 167.5, s: 12 },
    SW_part1:     { s: 10 }, SW_part2: { s: 2 },
    GreenET:      { v: 516.1,  s: 20 }, BlueET_N: { v: 232.8, s: 10 },
    BlueET_M:     { v: 37.7,   s: 5  }, ConsWater: { v: 93.3, s: 5 },
    SWOutflow:    { v: 17.1,   s: 2  }, ReturnFlow: { v: 129.7, s: 8 },
    DeltaS:       { v: 83.2,   s: 2  },
    GrossInflow:  { v: 943.4  }, LandscapeET: { v: 748.9 }, ManmadeCons: { v: 131 },
    MSO_L2:       { v: 146.8  }, NetInflow:   { v: 1026.7 }, TotalConsumed: { v: 879.9 }, MSO_L1: { v: 146.8 },
  },
  2021: {
    P:            { v: 927.7,  s: 40 }, SWInflow: { v: 169, s: 12 },
    SW_part1:     { s: 10 }, SW_part2: { s: 2 },
    GreenET:      { v: 523,    s: 20 }, BlueET_N: { v: 221.8, s: 10 },
    BlueET_M:     { v: 35.9,   s: 5  }, ConsWater: { v: 927.3, s: 5 },
    SWOutflow:    { v: 4.9,    s: 2  }, ReturnFlow: { v: 130.3, s: 8 },
    DeltaS:       { v: -34.3,  s: 2  },
    GrossInflow:  { v: 1096.7 }, LandscapeET: { v: 744.8 }, ManmadeCons: { v: 182.5 },
    MSO_L2:       { v: 135.1  }, NetInflow:   { v: 1062.4 }, TotalConsumed: { v: 927.3 }, MSO_L1: { v: 135.1 },
  },
  2022: {
    P:            { v: 979.2,  s: 41 }, SWInflow: { v: 167.0, s: 14 },
    SW_part1:     { s: 9  }, SW_part2: { s: 5 },
    GreenET:      { v: 556.8,  s: 24 }, BlueET_N: { v: 234.8, s: 8 },
    BlueET_M:     { v: 53.1,   s: 2  }, ConsWater: { v: 235.0, s: 7 },
    SWOutflow:    { v: 20.6,   s: 1  }, ReturnFlow: { v: 123.2, s: 8 },
    DeltaS:       { v: -53.0,  s: 5  },
    GrossInflow:  { v: 1146.2 }, LandscapeET: { v: 791.6 }, ManmadeCons: { v: 158.0 },
    MSO_L2:       { v: 143.7  }, NetInflow:   { v: 1093.2 }, TotalConsumed: { v: 949.5 }, MSO_L1: { v: 145.4 },
  },
};

function buildTree(year) {
  const d = DATA[year];
  return {
    name: "root",
    children: [
      {
        id: "L3_TotalConsumed", name: "Total Consumed\nWater",
        color: C_TOTAL_CONSUMED, value: d.TotalConsumed.v,
        children: [
          {
            id: "L2_LandscapeET", name: "Landscape ET",
            color: C_LANDSCAPE_ET, value: d.LandscapeET.v,
            children: [
              { id:"L1_GreenET",  name:"Green ET",    color:C_GREEN_ET,   value:d.GreenET.v,  size:d.GreenET.s  },
              { id:"L1_BlueET_N", name:"Blue ET (N)", color:C_BLUE_ET_N,  value:d.BlueET_N.v, size:d.BlueET_N.s },
            ]
          },
          {
            id: "L2_ManmadeCons", name: "Manmade\nConsumption",
            color: C_MANMADE, value: d.ManmadeCons.v,
            children: [
              { id:"L1_BlueET_M",  name:"Blue ET (M)",    color:C_BLUE_ET_M,   value:d.BlueET_M.v,  size:d.BlueET_M.s  },
              { id:"L1_ConsWater", name:"Consumed Water", color:C_CONS_WATER,  value:d.ConsWater.v, size:d.ConsWater.s },
            ]
          },
        ]
      },
      {
        id: "L3_NetInflow_Gross", name: "Net\nInflow",
        color: C_NET_INFLOW, value: d.NetInflow.v,
        children: [
          {
            id: "L2_GrossInflow", name: "Gross\nInflow",
            color: C_GROSS_INFLOW, value: d.GrossInflow.v,
            children: [
              { id:"L1_P",        name:"P (Rainfall)", color:C_P_RAINFALL,  value:d.P.v, size:d.P.s        },
              { id:"L1_SW_part1", name:"",             color:TRANSPARENT,   value:0,     size:d.SW_part1.s },
            ]
          },
        ]
      },
      {
        id: "L3_NetInflow_DS", name: "",
        color: TRANSPARENT, value: d.DeltaS.v,
        children: [
          {
            id: "L2_DeltaS", name: `ΔS\n${d.DeltaS.v}`,
            color: C_DELTA_S, value: d.DeltaS.v,
            children: [
              { id:"L1_SW_part2", name:"", color:TRANSPARENT, value:0, size:d.SW_part2.s },
            ]
          },
        ]
      },
      {
        id: "L3_MSO", name: "Mixed SW\nOutflow",
        color: C_MSO_L3, value: d.MSO_L1.v,
        children: [
          {
            id: "L2_MSO", name: "Mixed SW\nOutflow",
            color: C_MSO_L2, value: d.MSO_L2.v,
            children: [
              { id:"L1_SWOutflow",  name:"SW Outflow",  color:C_SW_OUTFLOW,  value:d.SWOutflow.v,  size:d.SWOutflow.s  },
              { id:"L1_ReturnFlow", name:"Return Flow", color:C_RETURN_FLOW, value:d.ReturnFlow.v, size:d.ReturnFlow.s },
            ]
          },
        ]
      },
    ]
  };
}

const LEGEND_ITEMS = [
  { color: C_P_RAINFALL,  label: "P (Rainfall)"       },
  { color: SW_COLOR,      label: "SW Flow Inflow"      },
  { color: C_GREEN_ET,    label: "Green ET"            },
  { color: C_BLUE_ET_N,   label: "Blue ET (N)"         },
  { color: C_BLUE_ET_M,   label: "Blue ET (M)"         },
  { color: C_CONS_WATER,  label: "Consumed Water"      },
  { color: C_SW_OUTFLOW,  label: "SW Outflow"          },
  { color: C_RETURN_FLOW, label: "Return Flow"         },
  { color: C_DELTA_S,     label: "ΔS (L2 visible)"    },
  { color: TRANSPARENT,   label: "ΔS gap (L1 & L3)",  border: "#475569" },
];

export default function WaterSunburst() {
  const svgRef      = useRef(null);
  const tooltipRef  = useRef(null);
  const [year, setYear]           = useState(2018);
  const [hoveredLabel, setHovered] = useState(null);

  useEffect(() => {
    const width    = 680;
    const height   = 680;
    const radius   = Math.min(width, height) / 2 - 20;
    const maxDepth = 3;
    const holeR    = 90;
    const ringW    = (radius - holeR) / maxDepth;

    const treeData = buildTree(year);
    const root = d3.hierarchy(treeData).sum(d => d.size || 0);
    d3.partition().size([2 * Math.PI, radius])(root);
    const nodes = root.descendants().filter(d => d.depth > 0);

    const swPart1 = root.descendants().find(d => d.data.id === "L1_SW_part1");
    const swPart2 = root.descendants().find(d => d.data.id === "L1_SW_part2");
    const swStartAngle = swPart1?.x0 ?? 0;
    const swEndAngle   = swPart2?.x1 ?? 0;

    const arc = d3.arc()
      .startAngle(d => d.x0).endAngle(d => d.x1)
      .padAngle(d => d.data.color === TRANSPARENT ? 0 : 0.016)
      .padRadius(radius / 2)
      .innerRadius(d => holeR + (maxDepth - d.depth)     * ringW + 3)
      .outerRadius(d => holeR + (maxDepth - d.depth + 1) * ringW - 3);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    // ── SVG Defs: glow filter + clip ─────────────────────────────
    const defs = svg.append("defs");

    // Glow filter for hover
    const glowFilter = defs.append("filter").attr("id","glow").attr("x","-30%").attr("y","-30%").attr("width","160%").attr("height","160%");
    glowFilter.append("feGaussianBlur").attr("stdDeviation","4").attr("result","coloredBlur");
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in","coloredBlur");
    feMerge.append("feMergeNode").attr("in","SourceGraphic");

    // Subtle ambient glow filter (always on, softer)
    const ambientFilter = defs.append("filter").attr("id","ambient").attr("x","-10%").attr("y","-10%").attr("width","120%").attr("height","120%");
    ambientFilter.append("feGaussianBlur").attr("stdDeviation","1.5").attr("result","coloredBlur");
    const feMerge2 = ambientFilter.append("feMerge");
    feMerge2.append("feMergeNode").attr("in","coloredBlur");
    feMerge2.append("feMergeNode").attr("in","SourceGraphic");

    // Clip circle — keeps all labels inside the outer ring boundary
    defs.append("clipPath").attr("id","chartClip")
      .append("circle").attr("r", holeR + ringW * maxDepth + 2);

    const g = svg.append("g").attr("transform", `translate(${width/2},${height/2})`);

    // ── Subtle background ring glow ───────────────────────────────
    g.append("circle")
      .attr("r", holeR + ringW * 3 + 8)
      .attr("fill", "none")
      .attr("stroke", "rgba(20,184,166,0.08)")
      .attr("stroke-width", 18);
    g.append("circle")
      .attr("r", holeR - 6)
      .attr("fill", "rgba(15,23,42,0.6)")
      .attr("stroke", "rgba(99,102,241,0.2)")
      .attr("stroke-width", 1.5);

    const showTip = (event, name, value) => {
      setHovered(name.replace(/\n/g," "));
      d3.select(tooltipRef.current).style("opacity",1)
        .html(`
          <div style="font-size:11px;color:#94a3b8;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:3px">${name.replace(/\n/g," ")}</div>
          <div style="font-size:18px;font-weight:700;color:#f0f9ff;letter-spacing:-0.02em">${typeof value==="number" ? value.toFixed(1) : value} <span style="font-size:11px;color:#64748b;font-weight:400">mm</span></div>
        `);
    };
    const moveTip = (event) => {
      const rect = svgRef.current.parentElement.getBoundingClientRect();
      d3.select(tooltipRef.current)
        .style("left", (event.clientX - rect.left + 16) + "px")
        .style("top",  (event.clientY - rect.top  - 48) + "px");
    };
    const hideTip = () => { d3.select(tooltipRef.current).style("opacity",0); setHovered(null); };

    // ── Pass 1: normal arcs ──────────────────────────────────────
    g.selectAll("path.normal")
      .data(nodes).enter().append("path").attr("class","normal")
      .attr("d", arc)
      .attr("fill",         d => d.data.color)
      .attr("stroke",       d => d.data.color === TRANSPARENT ? "none" : "rgba(15,23,42,0.7)")
      .attr("stroke-width", 1.5)
      .style("cursor",  d => d.data.color === TRANSPARENT ? "default" : "pointer")
      .style("opacity", 0)
      .style("filter", "url(#ambient)")
      .on("mouseover", function(event, d) {
        if (d.data.color === TRANSPARENT) return;
        const angle = (d.x0 + d.x1) / 2;
        const x = Math.cos(angle - Math.PI/2) * 6;
        const y = Math.sin(angle - Math.PI/2) * 6;
        d3.select(this)
          .interrupt()
          .attr("transform", `translate(${x},${y})`)
          .style("filter","url(#glow)")
          .attr("stroke", d.data.color)
          .attr("stroke-width", 2.5)
          .style("opacity", 1);
        showTip(event, d.data.name, d.data.value);
      })
      .on("mousemove", moveTip)
      .on("mouseout", function(event, d) {
        d3.select(this)
          .interrupt()
          .attr("transform","translate(0,0)")
          .style("filter","url(#ambient)")
          .attr("stroke","rgba(15,23,42,0.7)")
          .attr("stroke-width", 1.5)
          .style("opacity", 1);
        hideTip();
      })
      .transition().duration(900).delay((_, i) => i * 22).style("opacity", 1);

    // ── Pass 2: SW Flow Inflow custom arc ─────────────────────────
    const swInnerR = holeR + 3;
    const swOuterR = holeR + ringW - 3;
    const swValue  = DATA[year].SWInflow.v;

    const swPath = g.append("path")
      .attr("d", d3.arc()
        .innerRadius(swInnerR).outerRadius(swOuterR)
        .startAngle(swStartAngle).endAngle(swEndAngle)
        .padAngle(0.016).padRadius(radius/2)()
      )
      .attr("fill", SW_COLOR)
      .attr("stroke","rgba(15,23,42,0.7)").attr("stroke-width",1.5)
      .style("cursor","pointer").style("opacity",0)
      .style("filter","url(#ambient)")
      .on("mouseover", function(event) {
        const midAngle = (swStartAngle + swEndAngle) / 2;
        const x = Math.cos(midAngle - Math.PI/2) * 6;
        const y = Math.sin(midAngle - Math.PI/2) * 6;
        d3.select(this)
          .interrupt()
          .attr("transform",`translate(${x},${y})`)
          .style("filter","url(#glow)")
          .attr("stroke", SW_COLOR).attr("stroke-width",2.5);
        showTip(event, "Surface Water Flow Inflow", swValue);
      })
      .on("mousemove", moveTip)
      .on("mouseout", function(){
        d3.select(this)
          .interrupt()
          .attr("transform","translate(0,0)")
          .style("filter","url(#ambient)")
          .attr("stroke","rgba(15,23,42,0.7)").attr("stroke-width",1.5);
        hideTip();
      });

    swPath.transition().duration(900).delay(200).style("opacity",1);

    // SW label
    const swMid    = (swStartAngle + swEndAngle) / 2;
    const swLabelR = (swInnerR + swOuterR) / 2;
    const swDeg    = (swMid * 180 / Math.PI) - 90;
    const swFlip   = (swDeg > 90 && swDeg < 270) ? 180 : 0;
    const swArcLen = (swEndAngle - swStartAngle) * swLabelR;

    if (swArcLen > 16) {
      const lbl = g.append("text")
        .attr("transform",`rotate(${swDeg}) translate(${swLabelR},0) rotate(${swFlip})`)
        .attr("text-anchor","middle").attr("dominant-baseline","middle")
        .attr("font-family","'SF Pro Display', 'Segoe UI Variable', 'Segoe UI', sans-serif")
        .attr("font-size", swArcLen > 70 ? "10px" : "8.5px")
        .attr("fill","#0f172a").attr("font-weight","600")
        .attr("pointer-events","none").style("opacity",0);
      (swArcLen > 55 ? ["SW Flow","Inflow"] : ["SW"]).forEach((line,i,arr) =>
        lbl.append("tspan").attr("x",0)
          .attr("dy", i===0 ? `${-(arr.length-1)*0.55}em` : "1.2em").text(line)
      );
      lbl.transition().duration(800).delay(600).style("opacity",1);
    }

    // ── Labels ────────────────────────────────────────────────────
    g.selectAll("text.lbl")
      .data(nodes.filter(d => {
        if (d.data.color === TRANSPARENT || !d.data.name) return false;
        const nudge = d.depth === 1 ? -10 : 0;
        const r = holeR + (maxDepth - d.depth + 0.5) * ringW + nudge;
        const arcLen = (d.x1 - d.x0) * r;
        // L3 (outer) needs more space — raise threshold to avoid overflow
        const minLen = d.depth === 1 ? 40 : 16;
        return arcLen > minLen;
      }))
      .enter().append("text").attr("class","lbl")
      .attr("clip-path","url(#chartClip)")
      .attr("transform", d => {
        const angle  = (d.x0 + d.x1) / 2;
        // Pull L3 (depth=1) labels inward by 10px so they stay inside their band
        const nudge  = d.depth === 1 ? -10 : 0;
        const r      = holeR + (maxDepth - d.depth + 0.5) * ringW + nudge;
        const deg    = (angle * 180 / Math.PI) - 90;
        const flip   = (deg > 90 && deg < 270) ? 180 : 0;
        return `rotate(${deg}) translate(${r},0) rotate(${flip})`;
      })
      .attr("text-anchor","middle").attr("dominant-baseline","middle")
      .attr("font-family","'SF Pro Display', 'Segoe UI Variable', 'Segoe UI', sans-serif")
      .attr("fill", d => {
        // Use dark text on light-colored slices
        const lightSlices = [C_GREEN_ET, C_BLUE_ET_N, C_P_RAINFALL];
        return lightSlices.includes(d.data.color) ? "#0f172a" : "#f0f9ff";
      })
      .attr("font-weight", "600")
      .attr("pointer-events","none").style("opacity",0)
      .each(function(d) {
        const el     = d3.select(this);
        const nudge  = d.depth === 1 ? -10 : 0;
        const r      = holeR + (maxDepth - d.depth + 0.5) * ringW + nudge;
        const arcLen = (d.x1 - d.x0) * r;
        el.attr("font-size", arcLen > 80 ? "11px" : "9px");
        const lines    = d.data.name.split("\n");
        const showVal  = arcLen > 35;
        const dispVal  = typeof d.data.value === "number" ? d.data.value.toFixed(1) : "";
        const allLines = showVal && dispVal ? [...lines, dispVal] : lines;
        allLines.forEach((line, i) =>
          el.append("tspan").attr("x",0)
            .attr("dy", i===0 ? `${-(allLines.length-1)*0.55}em` : "1.2em")
            .attr("font-size", i===allLines.length-1 && showVal ? "8px" : null)
            .attr("fill", i===allLines.length-1 && showVal ? "rgba(240,249,255,0.7)" : null)
            .text(line.length > 12 ? line.slice(0,11)+"…" : line)
        );
      })
      .transition().duration(800).delay(440).style("opacity",1);

    // ── Center ────────────────────────────────────────────────────
    g.append("text")
      .attr("text-anchor","middle").attr("dominant-baseline","middle")
      .attr("font-family","'SF Pro Display', 'Segoe UI Variable', 'Segoe UI', sans-serif")
      .attr("font-size","28px").attr("font-weight","700")
      .attr("fill","#f0f9ff").attr("y",-14)
      .style("letter-spacing","-0.02em")
      .text(year);
    g.append("text")
      .attr("text-anchor","middle").attr("dominant-baseline","middle")
      .attr("font-family","'SF Pro Display', 'Segoe UI Variable', 'Segoe UI', sans-serif")
      .attr("font-size","10px").attr("fill","#cfd6e0").attr("y",12)
      .style("letter-spacing","0.08em").style("text-transform","uppercase")
      .text("Water Balance");

  }, [year]);

  return (
    <div style={{
      fontFamily:"'SF Pro Display','Segoe UI Variable','Segoe UI',sans-serif",
      width: 720, margin:"0 auto",
      background:"linear-gradient(135deg,rgba(15,23,42,0.95) 0%,rgba(15,23,42,0.85) 100%)",
      borderRadius: 20,
      border:"1px solid rgba(99,102,241,0.15)",
      boxShadow:"0 0 40px rgba(13,148,136,0.1), 0 0 80px rgba(99,102,241,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
      padding:"24px 20px 20px",
      backdropFilter:"blur(20px)",
    }}>

      {/* Title */}
      <div style={{ textAlign:"center", marginBottom:18 }}>
        <div style={{
          fontSize:15, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase",
          background:"linear-gradient(90deg,#14b8a6,#6366f1)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          marginBottom:3,
        }}>Water Balance Sunburst</div>
        <div style={{ fontSize:11, color:"#d5dce6", letterSpacing:"0.06em" }}>
          Irrigated Basin · Annual Analysis
        </div>
      </div>

      {/* Year buttons */}
      <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {[2016,2017,2018,2019,2020,2021,2022].map(y => (
          <button key={y} onClick={() => setYear(y)} style={{
            padding:"4px 14px", borderRadius:20,
            border:`1px solid ${y===year ? "#14b8a6" : "rgba(99,102,241,0.2)"}`,
            background: y===year
              ? "linear-gradient(135deg,#0d9488,#0891b2)"
              : "rgba(15,23,42,0.6)",
            color:      y===year ? "#f0f9ff" : "#64748b",
            fontWeight: y===year ? 700       : 400,
            fontSize:   13,
            cursor:     "pointer",
            transition: "all 0.2s",
            boxShadow:  y===year ? "0 0 12px rgba(20,184,166,0.35)" : "none",
            letterSpacing: "0.02em",
          }}>{y}</button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ position:"relative", display:"flex", justifyContent:"center" }}>
        <svg ref={svgRef} style={{ borderRadius:12, overflow:"visible" }} />
        {/* Glassmorphism tooltip */}
        <div ref={tooltipRef} style={{
          position:"absolute",
          background:"rgba(15,23,42,0.85)",
          border:"1px solid rgba(99,102,241,0.25)",
          backdropFilter:"blur(16px)",
          padding:"10px 16px",
          borderRadius:10,
          pointerEvents:"none", opacity:0,
          transition:"opacity 0.12s",
          whiteSpace:"nowrap", zIndex:10,
          boxShadow:"0 4px 24px rgba(0,0,0,0.4), 0 0 12px rgba(13,148,136,0.1)",
        }} />
      </div>

      {/* Legend */}
      <div style={{
        display:"flex", flexWrap:"wrap", gap:"6px 20px",
        marginTop:16, paddingTop:14,
        borderTop:"1px solid rgba(99,102,241,0.1)",
        justifyContent:"center",
      }}>
        {LEGEND_ITEMS.map(item => (
          <div key={item.label} style={{
            display:"flex", alignItems:"center", gap:6,
            opacity: hoveredLabel && hoveredLabel !== item.label ? 0.35 : 1,
            transition:"opacity 0.2s",
          }}>
            <div style={{
              width:10, height:10, borderRadius:2, flexShrink:0,
              background: item.color === TRANSPARENT ? "transparent" : item.color,
              border:`1px solid ${item.border || item.color}`,
              boxShadow: item.color !== TRANSPARENT ? `0 0 6px ${item.color}55` : "none",
            }}/>
            <span style={{ fontSize:10.5, color:"#b6bdc7", letterSpacing:"0.03em" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}