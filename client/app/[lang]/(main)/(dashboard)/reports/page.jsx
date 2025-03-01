"use client";
import React, { useState } from "react";

import DemoReport from "@/components/Reports/DemoReport";
import { FileText } from "lucide-react";

const FinancialDashboard = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState(null);

  const generateReport = async () => {
    setIsGeneratingReport(true);

    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/portfolio_generation"
      );
      setReport(response?.data?.portfolio_data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const formatText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|\*)/g).filter(Boolean);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={index} className="font-bold">
            {part.slice(2, -2)}
          </span>
        );
      } else if (part === "*") {
        return <br key={index} />;
      } else {
        return part;
      }
    });
  };

  return (
    <div className="h-screen overflow-scroll bg-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Smart Reports Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Key insights and recommendations for your portfolio
            </p>
          </div>

          {/* Generate Report Button */}
          <button
            onClick={generateReport}
            disabled={isGeneratingReport}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:bg-gray-400"
          >
            <FileText className="w-4 h-4" />
            {isGeneratingReport ? "Generating Report..." : "Generate Report"}
          </button>
        </div>

        <DemoReport />
      </div>
    </div>
  );
};

export default FinancialDashboard;
