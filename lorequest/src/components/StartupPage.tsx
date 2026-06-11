/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import LucideIcon from './LucideIcon';
// @ts-ignore
import startupBg from '../assets/images/lorequest_startup_bg_1780588987485.png';

interface StartupPageProps {
  onStartGame: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export default function StartupPage({
  onStartGame,
  isPlayingMusic,
  onToggleMusic
}: StartupPageProps) {
  // Cartoonish 3D Arcade text shadows
  const orangeTitleStyle: React.CSSProperties = {
    fontFamily: '"Impact", "Microsoft YaHei", "ZCOOL KuaiLe", sans-serif',
    textShadow: `
      2px 2px 0px #c04000, 
      -2px -2px 0px #c04000, 
      2px -2px 0px #c04000, 
      -2px 2px 0px #c04000, 
      0px 2px 0px #c04000, 
      2px 0px 0px #c04000, 
      -2px 0px 0px #c04000, 
      0px -2px 0px #c04000, 
      4px 4px 0px #1e3a8a, 
      5px 5px 0px #1e3a8a, 
      6px 6px 0px #1e3a8a,
      0px 8px 16px rgba(15, 23, 42, 0.45)
    `,
    backgroundImage: 'linear-gradient(to bottom, #ffe066 10%, #ff8c00 50%, #ff3c00 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const blueTitleStyle: React.CSSProperties = {
    fontFamily: '"Impact", "Microsoft YaHei", "ZCOOL KuaiLe", sans-serif',
    textShadow: `
      2.5px 2.5px 0px #ffffff, 
      -2.5px -2.5px 0px #ffffff, 
      2.5px -2.5px 0px #ffffff, 
      -2.5px 2.5px 0px #ffffff, 
      0px 2.5px 0px #ffffff, 
      2.5px 0px 0px #ffffff, 
      -2.5px 0px 0px #ffffff, 
      0px -2.5px 0px #ffffff, 
      4px 4px 0px #2563eb, 
      5px 5px 0px #2563eb, 
      6px 6px 0px #2563eb,
      0px 8px 16px rgba(15, 23, 42, 0.45)
    `,
    backgroundImage: 'linear-gradient(to bottom, #dbeafe 10%, #60a5fa 50%, #2563eb 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div
      id="startup-page-viewport"
      className="relative flex flex-col items-center justify-between min-h-[640px] md:min-h-[720px] py-14 px-6 overflow-hidden rounded-[40px] border-8 border-slate-900/10 shadow-2xl bg-sky-200"
    >
      {/* High-Resolution Landscape Ghibli Background Portrait */}
      <div className="absolute inset-0 z-0">
        <img
          src={startupBg}
          alt="LoreQuest Beautiful Grass Hills Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none"
        />
        {/* Soft atmospheric radial gradient flare in the absolute center to highlight text */}
        <div className="absolute inset-0 bg-radial-gradient from-white/30 via-transparent to-black/15 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Auxiliary Floating Music & System controls right side alignment */}
      <div className="absolute top-6 right-6 z-25 flex items-center gap-3">
        <button
          onClick={onToggleMusic}
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
            isPlayingMusic
              ? 'bg-amber-400 border-white text-brown-900 animate-spin-slow shadow-amber-400/30'
              : 'bg-white/90 border-slate-200 text-slate-500 hover:text-slate-800'
          } cursor-pointer`}
          title={isPlayingMusic ? '暂停背景音乐' : '播放背景音乐'}
        >
          <LucideIcon name={isPlayingMusic ? 'Music' : 'VolumeX'} size={16} />
        </button>
      </div>

      {/* Brand Lore Subtitle Badge at the high top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/70 backdrop-blur-md border border-white/80 rounded-full text-slate-700 text-[11px] font-black tracking-widest uppercase shadow-md select-none"
      >
        <LucideIcon name="Crown" size={13} className="text-amber-500 animate-pulse" />
        <span>LoreQuest · 传说之旅</span>
      </motion.div>

      {/* Title block centering */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 my-auto pb-4">
        {/* Row 1: "LoreQuest" Orange title with intense outlines */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="select-none text-center"
        >
          <h1
            style={orangeTitleStyle}
            className="text-5xl sm:text-6xl md:text-7xl font-sans font-black tracking-wider pb-2 leading-none"
          >
            LoreQuest
          </h1>
        </motion.div>

        {/* Row 2: "传说之旅" Blue title spacing */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="select-none text-center mt-3"
        >
          <h2
            style={blueTitleStyle}
            className="text-5xl sm:text-6xl md:text-7xl font-sans font-black tracking-wider pb-2 leading-none"
          >
            传说之旅
          </h2>
        </motion.div>

        {/* English or Subtitles fusion underneath */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-slate-800 font-extrabold text-xs sm:text-sm bg-white/85 border border-white px-4 py-1.5 rounded-full shadow-md tracking-wider mt-6 backdrop-blur-xs flex items-center gap-1.5"
        >
          <span>LOREQUEST: ADVENTURE OF SAGES</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>英语百科知识</span>
        </motion.p>
      </div>

      {/* Button & CTA segment */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Giant Pulsing Interactive CTA Golden-Yellow Button like reference image */}
        <motion.button
          id="btn-startup-start-adventure"
          onClick={onStartGame}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="group relative px-12 py-4.5 bg-gradient-to-b from-[#ffea53] to-[#f5b807] text-[#542100] font-black text-xl sm:text-2xl rounded-2xl border-2 border-[#fff799] shadow-[0_8px_0_#bd7c00,0_16px_25px_rgba(0,0,0,0.35)] transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer select-none active:translate-y-1.5 active:shadow-[0_2px_0_#bd7c00,0_4px_12px_rgba(0,0,0,0.25)]"
        >
          {/* Flat black/brown play triangle symbol matching image exactly */}
          <span className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-[#541200] border-b-[8px] border-b-transparent mr-1.5" />
          <span>开始冒险</span>
        </motion.button>

        {/* Tactical status string */}
        <p className="mt-8 text-slate-800 font-extrabold text-[10px] tracking-widest uppercase select-none flex items-center gap-1.5 bg-white/50 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>SERVER ONLINE // v2.6.4 READY TO START</span>
        </p>
      </div>
    </div>
  );
}
