import React, { useState } from 'react';
import { downloadFullPagePDF } from "../utils/pdfGenerator";

// Toolbar.jsx
// Top navigation bar for the dashboard, with avatar, tabs, and action buttons.
const Toolbar = ({ onCreateChart, onPrintPage }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // You can add tab logic here
  };

  const handlePrint = () => {
    if (onPrintPage) {
      onPrintPage();
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsLoadingPDF(true);
      await downloadFullPagePDF();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsLoadingPDF(false);
    }
  };

  return (
    <header className="w-full bg-[#F9FBFC] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Avatar */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full border border-gray-400 text-gray-700 font-semibold flex items-center justify-center">
              E
            </div>
          </div>

          {/* Center: Tabs */}
          <nav className="flex space-x-8 text-sm font-medium ml-64">
            <div
              onClick={() => handleTabClick('analytics')}
              className={`cursor-pointer pb-1 ${
                activeTab === 'analytics'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Analytics
            </div>
            <div
              onClick={() => handleTabClick('tbd1')}
              className={`cursor-pointer pb-1 ${
                activeTab === 'tbd1'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              TBD
            </div>
            <div
              onClick={() => handleTabClick('tbd2')}
              className={`cursor-pointer pb-1 ${
                activeTab === 'tbd2'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              TBD
            </div>
          </nav>

          {/* Right: Create Chart + Share + Print */}
          <div className="flex">
            <div
              onClick={onCreateChart}
              className="px-3 py-1.5 text-sm rounded text-gray-600 hover:text-[#3398FF] cursor-pointer flex items-center gap-2"
            >
              <img src="/add.svg" alt="Add" className="w-6 h-6" />
              Create Chart
            </div>
            <div
              onClick={handleDownloadPDF}
              className="px-2 py-1.5 text-sm rounded text-gray-600 hover:text-[#3398FF] cursor-pointer flex items-center gap-2 min-w-[180px]"
            >
              {isLoadingPDF ? (
                <span className="w-6 h-6 inline-block animate-spin border-2 border-gray-300 border-t-[#3398FF] rounded-full"></span>
              ) : (
                <span className="w-6 h-6"> <img src="/download.svg" alt="Download" className='w-full'/></span>
              )}
              Download Report PDF
            </div>
            <div
            //   onClick={() => alert('Share placeholder')}
              className="px-3 py-1.5 text-sm rounded text-gray-600 hover:text-[#3398FF] cursor-pointer flex items-center gap-2"
            >
              <span className="w-6 h-6"> <img src="/share.svg" alt="Download" className='w-full'/></span>
              Share
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Toolbar;
