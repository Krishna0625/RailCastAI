import React, { useState } from 'react';
import {
  Radio,
  AlertTriangle,
  Train,
  Sliders,
  Building2,
  BarChart2,
  Layers,
  Mic,
  Clock,
  ChevronDown,
  Sparkles,
  Info,
} from 'lucide-react';
import { ConsumerTab } from '../types/railway';

interface HeaderProps {
  activeTab: ConsumerTab;
  onTabChange: (tab: ConsumerTab) => void;
  isTechnicalMode: boolean;
  onToggleTechnicalMode: () => void;
  onOpenSixtySecondExplainer: () => void;
  isPlaying: boolean;
  totalDelay: number;
  simTimeFormatted: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isTechnicalMode,
  onToggleTechnicalMode,
  onOpenSixtySecondExplainer,
  isPlaying,
  totalDelay,
  simTimeFormatted,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Group definitions matching Prompt Section 9:
  // 🏠 Overview (Main dashboard, Guided demo)
  // 🚆 Live Train (Train analysis, Passenger view)
  // ⚡ Events & Simulation (Simulation controls, Operational events)
  // 🏢 Operations (Station display, Control room, Multi-train fleet)
  // 📊 Analytics (Network analytics, Prediction vs actual, Residual feedback)
  // 🧩 System (Architecture, API demonstration)
  // 🎤 SIH Demo Script

  const isOverview = activeTab === 'live_operations';
  const isLiveTrain = activeTab === 'passenger_view' || activeTab === 'train_analysis';
  const isEvents = false; // Events are accessible on Overview or through Controls
  const isOperations = activeTab === 'station_display' || activeTab === 'control_room' || activeTab === 'multi_train';
  const isAnalytics = activeTab === 'network_analytics';
  const isSystem = activeTab === 'system_architecture' || activeTab === 'api_docs';
  const isDemoScript = activeTab === 'demo_script';

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      {/* Top Operational Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="font-bold tracking-wide text-amber-950">DEMO / SIMULATED RAILWAY DATA</span>
          <span className="text-amber-400">|</span>
          <span className="text-amber-800">
            Smart India Hackathon 2026 · Problem Statement 26028 · Ministry of Railways
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-amber-900">
          <button
            onClick={onOpenSixtySecondExplainer}
            className="font-bold underline hover:text-amber-950 cursor-pointer flex items-center gap-1"
          >
            <span>⚡ 60-Second Pitch</span>
          </button>
          <span>·</span>
          <span>Prototype Environment</span>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark & Brand title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('live_operations')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  RailCast AI
                </span>
                <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                  SIH 26028
                </span>
              </div>
              <div className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-none">
                Dynamic & Explainable ETA Intelligence
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Categorized Navigation Links (6 Groups + Demo Script) */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {/* 1. 🏠 Overview */}
          <button
            onClick={() => onTabChange('live_operations')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              isOverview
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            🏠 Overview
          </button>

          {/* 2. 🚆 Live Train Dropdown / Selector */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'live_train' ? null : 'live_train')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                isLiveTrain
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>🚆 Live Train</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === 'live_train' && (
              <div
                className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 text-xs"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => {
                    onTabChange('passenger_view');
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'passenger_view' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Passenger View
                </button>
                <button
                  onClick={() => {
                    onTabChange('train_analysis');
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'train_analysis' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Train Kinematics
                </button>
              </div>
            )}
          </div>

          {/* 3. 🏢 Operations Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'operations' ? null : 'operations')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                isOperations
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>🏢 Operations</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === 'operations' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 text-xs"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => {
                    onTabChange('station_display');
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'station_display' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Station Master Board
                </button>
                <button
                  onClick={() => {
                    onTabChange('control_room');
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'control_room' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Section Control Room
                </button>
                <button
                  onClick={() => {
                    onTabChange('multi_train');
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'multi_train' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Multi-Train Fleet
                </button>
              </div>
            )}
          </div>

          {/* 4. 📊 Analytics */}
          <button
            onClick={() => onTabChange('network_analytics')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              isAnalytics
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            📊 Analytics
          </button>

          {/* 5. 🧩 System Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'system' ? null : 'system')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                isSystem
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>🧩 System</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === 'system' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 text-xs"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => {
                    onTabChange('system_architecture');
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'system_architecture' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Proposed Architecture
                </button>
                <button
                  onClick={() => {
                    onTabChange('api_docs');
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'api_docs' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Real-Time REST APIs
                </button>
              </div>
            )}
          </div>

          {/* 6. 🎤 SIH Demo Script (Dedicated Prominent Item) */}
          <button
            onClick={() => onTabChange('demo_script')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              isDemoScript
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-current" />
            <span>SIH Demo Script</span>
          </button>
        </nav>

        {/* Zone 3: Mode Toggle (DEMO | TECHNICAL) + Clock */}
        <div className="flex items-center gap-3 shrink-0">
          {/* DEMO MODE | TECHNICAL MODE Segmented Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => {
                if (isTechnicalMode) onToggleTechnicalMode();
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                !isTechnicalMode
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demo Mode
            </button>
            <button
              onClick={() => {
                if (!isTechnicalMode) onToggleTechnicalMode();
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                isTechnicalMode
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Technical Mode
            </button>
          </div>

          {/* Simulated Clock & Delay Status Badge */}
          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">
                Simulated Clock
              </div>
              <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                {simTimeFormatted} IST
              </div>
            </div>

            <div
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
                totalDelay > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  totalDelay > 0 ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
                }`}
              />
              <span>{totalDelay > 0 ? `+${totalDelay}m Delay` : 'On Time'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
