import React, { useState, useRef } from "react";
import ChartCard from "./components/ChartCard";
import Toolbar from "./components/Toolbar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import './App.css'

const defaultChartSettings = () => ({
  chartType: "bar",
  viewBy: "year",
  dateRangeType: "year",
  dateRangeValue: 1,
  customStart: new Date(new Date().getFullYear(), 0, 1),
  customEnd: new Date(),
  useCustom: false,
  chartTitle: "Chart Title",
  expanded: true,
});

const App = () => {
  const [charts, setCharts] = useState([
    defaultChartSettings(),
  ]);
  const [printing, setPrinting] = useState(false);
  const chartRefs = useRef([]);

  // Handlers for chart actions
  const handleUpdate = (idx, updates) => {
    setCharts((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...updates } : c))
    );
  };

  const handleToggleExpand = (idx) => {
    setCharts((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, expanded: !c.expanded } : c))
    );
  };

  const handleDuplicate = (idx) => {
    setCharts((prev) => {
      const newChart = { ...prev[idx], chartTitle: prev[idx].chartTitle + " Copy" };
      const newArr = [...prev];
      newArr.splice(idx, 0, newChart);
      return newArr;
    });
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    setCharts((prev) => {
      const newArr = [...prev];
      [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
      return newArr;
    });
  };

  const handleMoveDown = (idx) => {
    if (idx === charts.length - 1) return;
    setCharts((prev) => {
      const newArr = [...prev];
      [newArr[idx], newArr[idx + 1]] = [newArr[idx + 1], newArr[idx]];
      return newArr;
    });
  };

  const handleDelete = (idx) => {
    setCharts((prev) => prev.filter((_, i) => i !== idx));
  };

  // Print to PDF handler
  const handlePrintPage = async () => {
    setPrinting(true);
    // Wait for UI to update if needed
    await new Promise((r) => setTimeout(r, 100));
    const chartNodes = chartRefs.current.filter(Boolean);
    if (!chartNodes.length) return;
    // Get card size and aspect ratio
    const cardRect = chartNodes[0].getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    const aspect = cardWidth / cardHeight;
    // Use A4 or similar, but keep ratio
    const pdfWidth = 210; // mm (A4 width)
    const pdfHeight = pdfWidth / aspect;
    const pdf = new jsPDF({ orientation: aspect > 1 ? 'l' : 'p', unit: 'mm', format: [pdfWidth, pdfHeight] });
    for (let i = 0; i < chartNodes.length; i++) {
      if (i > 0) pdf.addPage([pdfWidth, pdfHeight], aspect > 1 ? 'l' : 'p');
      const canvas = await html2canvas(chartNodes[i], { backgroundColor: '#fff', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
    pdf.save('charts.pdf');
    setPrinting(false);
  };

  return (
    <div className="min-h-screen bg-background-color w-screen">
      <Toolbar
        onCreateChart={() => setCharts(prev => [defaultChartSettings(), ...prev])}
        onPrintPage={handlePrintPage}
      />
      <main className="w-full pt-18 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {charts.length === 0 ? (
          <div className="text-center text-caption-color">No charts. Add one!</div>
        ) : (
          charts.map((chart, idx) => (
            <div
              key={idx}
              ref={el => chartRefs.current[idx] = el}
              style={{ breakAfter: 'page', pageBreakAfter: 'always' }}
            >
              <ChartCard
                chartType={chart.chartType}
                setChartType={(v) => handleUpdate(idx, { chartType: v })}
                viewBy={chart.viewBy}
                setViewBy={(v) => handleUpdate(idx, { viewBy: v })}
                dateRangeType={chart.dateRangeType}
                setDateRangeType={(v) => handleUpdate(idx, { dateRangeType: v })}
                dateRangeValue={chart.dateRangeValue}
                setDateRangeValue={(v) => handleUpdate(idx, { dateRangeValue: v })}
                customStart={chart.customStart}
                setCustomStart={(v) => handleUpdate(idx, { customStart: v })}
                customEnd={chart.customEnd}
                setCustomEnd={(v) => handleUpdate(idx, { customEnd: v })}
                useCustom={chart.useCustom}
                setUseCustom={(v) => handleUpdate(idx, { useCustom: v })}
                chartTitle={chart.chartTitle}
                setChartTitle={(v) => handleUpdate(idx, { chartTitle: v })}
                expanded={chart.expanded}
                onToggleExpand={() => handleToggleExpand(idx)}
                onDuplicate={() => handleDuplicate(idx)}
                onMoveUp={() => handleMoveUp(idx)}
                onMoveDown={() => handleMoveDown(idx)}
                onDelete={() => handleDelete(idx)}
                isFirst={idx === 0}
                isLast={idx === charts.length - 1}
              />
            </div>
          ))
        )}
        {printing && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
            <div className="bg-white px-8 py-6 rounded-xl shadow text-text-color text-lg font-semibold">Generating PDF...</div>
      </div>
        )}
      </main>
      </div>
  );
};

export default App;
