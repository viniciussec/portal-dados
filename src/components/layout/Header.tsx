"use client";

import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="w-full flex flex-col sticky top-0 z-50 shadow-md font-sans">
      {/* Top Bar - Acessibilidade/Portal */}
      <div className="w-full bg-[#2e5b3b] text-white py-1.5 px-4 sm:px-6 lg:px-8 text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
        <div className="max-w-6xl mx-auto w-full flex justify-between opacity-95">
          <span>Portal do Governo</span>
          <span className="hidden sm:inline">Acessibilidade</span>
        </div>
      </div>
      
      {/* Main Header - Casa Civil Style */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6" style={{ background: "linear-gradient(to right, #009a4d, #008141)" }}>
        <div className="max-w-6xl mx-auto w-full relative flex justify-center items-center py-2 min-h-[5rem]">
          
          {/* Centered Logo Governo / Casa Civil */}
          <Link href="/" className="flex flex-col items-center justify-center group z-10">
            <img 
              src="/logotipo-casacivil.svg" 
              alt="Casa Civil - Governo do Estado do Ceará" 
              className="h-10 sm:h-12 lg:h-[4rem] w-auto drop-shadow-md group-hover:scale-105 transition-transform" 
            />
          </Link>
          
          {/* Logo Projeto (Branco estratégico - Right side) */}
          <div className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-center justify-center border-l border-white/20 pl-4 sm:pl-6 ml-2 sm:ml-4 z-20">
            <img 
              src="/logo2.png" 
              alt="Interoperabilidade" 
              className="h-8 sm:h-12 w-auto opacity-95 brightness-0 invert drop-shadow hover:opacity-100 transition-opacity" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-[9px] sm:text-[10px] text-white/80 mt-1.5 uppercase tracking-[0.2em] font-bold">Interoperabilidade</span>
          </div>

        </div>
      </div>
      
      {/* Ceará Colored Details - subtle bottom border */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#10b981]"></div>
        <div className="flex-1 bg-[#f59e0b]"></div>
        <div className="flex-1 bg-[#0ea5e9]"></div>
        <div className="flex-1 bg-[#ef4444]"></div>
      </div>
    </header>
  );
}
