/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CHARACTERS, getRawImageUrl } from './GameIntro';
import LucideIcon from './LucideIcon';

interface LorePageProps {
  onConfirmLore: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

const LORE_SCENES = [
  {
    id: 1,
    text: "突然，混沌降临！",
    speaker: "传说预言",
    mood: "threat"
  },
  {
    id: 2,
    text: "智慧水晶破碎，",
    speaker: "传说预言",
    mood: "shatter"
  },
  {
    id: 3,
    text: "失落的知识散落世界各地。",
    speaker: "系统播报",
    mood: "darkness"
  },
  {
    id: 4,
    text: "成为 LoreQuest 勇士，",
    speaker: "智慧猫头鹰 Professor Owl",
    mood: "wisdom"
  },
  {
    id: 5,
    text: "在冒险中学习，在探索中成长！去寻找那些神秘的文化故事，",
    speaker: "智慧猫头鹰 Professor Owl",
    mood: "stories"
  },
  {
    id: 6,
    text: "用心去探索英语中妙趣横生的单词起源，",
    speaker: "智慧猫头鹰 Professor Owl",
    mood: "words"
  },
  {
    id: 7,
    text: "一同畅游、深度地了解西方节日传统，",
    speaker: "智慧猫头鹰 Professor Owl",
    mood: "festivals"
  },
  {
    id: 8,
    text: "点亮那重现荣光的智慧之光，开启奇思妙想的英语大冒险！",
    speaker: "智慧猫头鹰 Professor Owl",
    mood: "light"
  }
];

export default function LorePage({ onConfirmLore, isPlayingMusic, onToggleMusic }: LorePageProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showEpicButton, setShowEpicButton] = useState(false);

  // Typewriter text generator
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = LORE_SCENES[lineIndex].text;
    setTypedText("");
    setIsTypingComplete(false);
    
    let index = 0;
    timer = setInterval(() => {
      if (index < fullText.length) {
        const nextChar = fullText[index];
        if (nextChar !== undefined) {
          setTypedText((prev) => prev + nextChar);
        }
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
        // Automatically make sure button is visible since it's the epic homepage style
        if (lineIndex === LORE_SCENES.length - 1) {
          setShowEpicButton(true);
        }
      }
    }, 45); // comfortable letter speed

    return () => clearInterval(timer);
  }, [lineIndex]);

  const handleNextLine = () => {
    if (!isTypingComplete) {
      // Fast skip typewriter to full text
      setTypedText(LORE_SCENES[lineIndex].text);
      setIsTypingComplete(true);
      if (lineIndex === LORE_SCENES.length - 1) {
        setShowEpicButton(true);
      }
      return;
    }

    if (lineIndex < LORE_SCENES.length - 1) {
      setLineIndex((prev) => prev + 1);
    } else {
      setShowEpicButton(true);
    }
  };

  const handleSkipAll = () => {
    setLineIndex(LORE_SCENES.length - 1);
    setTypedText(LORE_SCENES[LORE_SCENES.length - 1].text);
    setIsTypingComplete(true);
    setShowEpicButton(true);
  };

  const currentMood = LORE_SCENES[lineIndex].mood;

  return (
    <div
      id="lore-page-viewport"
      className="relative flex flex-col justify-between min-h-[680px] md:min-h-[760px] py-10 px-4 md:px-8 overflow-hidden rounded-[40px] bg-gradient-to-b from-[#1c0d38] via-[#240e4f] to-[#120524] border-8 border-purple-950/40 shadow-2xl text-white select-none"
    >
      {/* 1. ATMOSPHERE PARTICLES & STARS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Sky Background Stars */}
        <div className="absolute top-[10%] left-[10%] w-[3px] h-[3px] bg-amber-200 rounded-full animate-ping [animation-duration:3s]" />
        <div className="absolute top-[25%] right-[15%] w-[4px] h-[4px] bg-sky-200 rounded-full animate-ping [animation-duration:4s]" />
        <div className="absolute top-[40%] left-[22%] w-[2px] h-[2px] bg-pink-200 rounded-full animate-pulse [animation-duration:2.5s]" />
        <div className="absolute top-[15%] right-[40%] w-[3px] h-[3px] bg-yellow-200 rounded-full animate-pulse [animation-duration:5s]" />
        <div className="absolute bottom-[35%] left-[8%] w-[4px] h-[4px] bg-purple-350 rounded-full animate-ping [animation-duration:6s]" />
        <div className="absolute bottom-[30%] right-[25%] w-[2px] h-[2px] bg-indigo-300 rounded-full animate-pulse [animation-duration:2s]" />

        {/* Floating clouds like Dragon Quest */}
        <motion.div
          animate={{ x: [-100, 1920] }}
          transition={{ repeat: Infinity, duration: 65, ease: 'linear' }}
          className="absolute top-[22%] left-0 w-44 h-16 bg-white/5 rounded-full blur-md opacity-35"
        />
        <motion.div
          animate={{ x: [1200, -200] }}
          transition={{ repeat: Infinity, duration: 55, ease: 'linear' }}
          className="absolute bottom-[40%] left-0 w-64 h-20 bg-purple-500/5 rounded-full blur-lg opacity-40"
        />

        {/* Ambient Magic Orbs */}
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-80 h-80 bg-red-650/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[10%] left-[20%] w-72 h-72 bg-blue-500/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[20%] w-72 h-72 bg-pink-500/10 rounded-full blur-[110px] pointer-events-none" />
      </div>

      {/* 2. HEADER BLOCK WITH USER SUBTITLE */}
      <div className="relative z-20 flex flex-col items-center w-full pb-4 border-b border-white/5 mt-1">
        <div className="flex items-center justify-between w-full mb-3">
          {/* Left indicator tag */}
          <div className="flex items-center gap-1.5 bg-purple-950/55 border border-purple-500/20 rounded-full px-3 py-1">
            <LucideIcon name="Crown" className="text-amber-400 animate-pulse" size={13} />
            <span className="text-[10px] tracking-widest text-slate-300 font-black">LORE STORY</span>
          </div>
          
          {/* Right sound controller & Skip Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onConfirmLore}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-red-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-white/20 hover:scale-105 active:scale-95"
              title="跳过介绍，直接开始游戏"
            >
              <span>跳过介绍 (Skip)</span>
              <LucideIcon name="ChevronRight" size={12} />
            </button>
            <button
              onClick={onToggleMusic}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all shadow-md ${
                isPlayingMusic
                  ? 'bg-[#ec4899]/20 border-pink-500/40 text-pink-300 animate-spin-slow'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              } cursor-pointer`}
              title="播放/暂停背景音乐"
            >
              <LucideIcon name={isPlayingMusic ? 'Music' : 'VolumeX'} size={14} />
            </button>
          </div>
        </div>

        {/* Brand Title Display exact: LoreQuest：传说之旅 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-pink-300 drop-shadow-lg uppercase leading-none select-none">
            LoreQuest：传说之旅
          </h1>
          <p className="text-slate-300 text-xs md:text-sm font-semibold tracking-widest mt-1.5">
            在冒险中学习，在探索中成长。
          </p>
        </motion.div>
      </div>

      {/* 3. CENTER GRAPHICS WITH CHAOS LORD MOROS SURROUNDED BY FOUR HEROES */}
      <div id="lore-center-theatre" className="relative z-10 flex flex-col items-center max-w-4xl w-full mx-auto py-2.5 my-2">
        <div className="relative w-full max-w-[520px] h-[330px] sm:h-[360px] flex items-center justify-center overflow-visible">
          
          {/* Central Threat: Chaos Lord Moros */}
          <motion.div
            animate={{
              scale: [0.96, 1.04, 0.96],
              rotate: [-1, 1, -1]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
            className="absolute z-20 flex flex-col items-center justify-center"
          >
            {/* Soft ambient purple magical glowing background orb without harsh boundaries */}
            <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-purple-600/25 blur-3xl pointer-events-none animate-pulse" />
            
            <div className="relative flex items-center justify-center overflow-visible">
              <img
                src={getRawImageUrl("https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/Chaos%20Lord%20Moros%E6%B7%B7%E4%B8%96%E9%AD%94%E7%8E%8B%E8%8E%AB%E7%BD%97%E6%96%AF.png")}
                alt="混沌魔王莫罗"
                referrerPolicy="no-referrer"
                className="h-44 sm:h-56 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] select-none hover:scale-105 transition-all duration-300"
              />
            </div>
            
            {/* Chaos Lord label tag */}
            <span className="text-[10px] sm:text-xs font-black text-amber-300 bg-purple-950/95 border border-purple-500/40 px-3.5 py-1 rounded-full mt-2 uppercase tracking-wider shadow-2xl select-none">
              👿 混世魔王莫罗 / CHAOS LORD MOROS
            </span>
          </motion.div>

          {/* Hero 1: Scholar Mage (学者法师) - Top Left */}
          <motion.div
            animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="absolute top-[-5px] left-[-5px] sm:top-[-10px] sm:left-2 z-10 flex flex-col items-center w-24 sm:w-32 text-center"
          >
            <div className="relative flex items-center justify-center overflow-visible bg-transparent">
              <img
                src={getRawImageUrl("https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E5%AD%A6%E8%80%85%E6%B3%95%E5%B8%88%E8%A7%92%E8%89%B2Scholar%20Mage.png")}
                alt="学者法师"
                referrerPolicy="no-referrer"
                className="h-28 sm:h-36 w-auto object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] bg-transparent select-none hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-indigo-300 mt-1 bg-purple-950/85 px-2.5 py-0.5 rounded-full border border-indigo-550/20 shadow-md">
              学者法师
            </span>
          </motion.div>

          {/* Hero 2: Knight Warrior (骑士) - Bottom Left */}
          <motion.div
            animate={{ y: [4, -4, 4], rotate: [2, -2, 2] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
            className="absolute bottom-[-10px] left-[-5px] sm:bottom-[-15px] sm:left-2 z-10 flex flex-col items-center w-24 sm:w-32 text-center"
          >
            <div className="relative flex items-center justify-center overflow-visible bg-transparent">
              <img
                src={getRawImageUrl("https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E9%AA%91%E5%A3%AB%E8%A7%92%E8%89%B2Knight%20Warrior.png")}
                alt="骑士"
                referrerPolicy="no-referrer"
                className="h-28 sm:h-36 w-auto object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] bg-transparent select-none hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-blue-300 mt-1 bg-purple-950/85 px-2.5 py-0.5 rounded-full border border-blue-550/20 shadow-md">
              理型骑士
            </span>
          </motion.div>

          {/* Hero 3: Ranger Explorer (探险家) - Top Right */}
          <motion.div
            animate={{ y: [-4, 4, -4], rotate: [1.5, -1.5, 1.5] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[-5px] right-[-5px] sm:top-[-10px] sm:right-2 z-10 flex flex-col items-center w-24 sm:w-32 text-center"
          >
            <div className="relative flex items-center justify-center overflow-visible bg-transparent">
              <img
                src={getRawImageUrl("https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E6%8E%A2%E9%99%A9%E5%AE%B6%E8%A7%92%E8%89%B2Ranger%20Explorer.png")}
                alt="探险家"
                referrerPolicy="no-referrer"
                className="h-28 sm:h-36 w-auto object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] bg-transparent select-none hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-amber-300 mt-1 bg-purple-950/85 px-2.5 py-0.5 rounded-full border border-amber-550/20 shadow-md">
              探险家
            </span>
          </motion.div>

          {/* Hero 4: Bard (诗人) - Bottom Right */}
          <motion.div
            animate={{ y: [4, -4, 4], rotate: [-1.5, 1.5, -1.5] }}
            transition={{ repeat: Infinity, duration: 4.6, ease: "easeInOut", delay: 0.6 }}
            className="absolute bottom-[-10px] right-[-5px] sm:bottom-[-15px] sm:right-2 z-10 flex flex-col items-center w-24 sm:w-32 text-center"
          >
            <div className="relative flex items-center justify-center overflow-visible bg-transparent">
              <img
                src={getRawImageUrl("https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E5%90%9F%E6%B8%B8%E8%AF%97%E4%BA%BA%E8%A7%92%E8%89%B2Bard.png")}
                alt="吟游诗人"
                referrerPolicy="no-referrer"
                className="h-28 sm:h-36 w-auto object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] bg-transparent select-none hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-rose-300 mt-1 bg-purple-950/85 px-2.5 py-0.5 rounded-full border border-rose-550/20 shadow-md">
              吟游诗人
            </span>
          </motion.div>

        </div>
      </div>

      {/* 4. MAIN RED ROUNDED CORNER DIALOG DIALOGUE BOX */}
      <div id="lore-dialogue-station" className="relative z-20 max-w-2.5xl mx-auto w-full my-3">
        {/* Large red rounded dialogue bubble styled as RPG retro dialogue menu with gold outlines */}
        <div
          onClick={handleNextLine}
          className="relative min-h-[145px] md:min-h-[160px] p-5.5 bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-[#cc1111] rounded-[30px] border-4 border-amber-400 shadow-[0_12px_36px_rgba(239,68,68,0.3),inset_0_4px_0_rgba(255,255,255,0.35)] hover:border-amber-300 active:scale-[0.99] transition-all cursor-pointer overflow-hidden group"
        >
          {/* Subtle decorative background patterns inside dialogue */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.04] pointer-events-none" />

          {/* Current speaker identity tag card */}
          <div className="absolute -top-3.5 left-8 bg-amber-400 text-red-950 border-2 border-slate-900 px-5 py-0.5 rounded-full text-xs font-black shadow-md uppercase tracking-wider flex items-center gap-1.5 select-none animate-bounce [animation-duration:5s]">
            <LucideIcon name={
              LORE_SCENES[lineIndex].speaker.includes("Owl") ? "GraduationCap" : 
              LORE_SCENES[lineIndex].speaker.includes("预言") ? "Sparkles" : "Sparkle"
            } size={11} className="text-red-950" />
            <span>{LORE_SCENES[lineIndex].speaker}</span>
          </div>

          {/* Typewriter message string */}
          <div className="pt-3.5 px-2">
            <p className="text-sm md:text-base leading-relaxed text-white font-black tracking-wide drop-shadow select-none">
              {typedText}
              {/* Blinking game style cursor */}
              {!isTypingComplete && (
                <span className="inline-block w-2.5 h-4.5 bg-white ml-1 animate-pulse" />
              )}
            </p>
          </div>

          {/* Advancing Indicator prompt */}
          <div className="absolute bottom-3 right-6 flex items-center gap-1 font-black text-[9.5px] text-amber-100 select-none bg-red-950/70 border border-white/10 px-3 py-1 rounded-full group-hover:bg-red-950/90 transition-colors">
            <span>{isTypingComplete ? '点击此处继续下一帧' : '跳过打字动画'}</span>
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[7px] border-t-amber-300 ml-1.5"
            />
          </div>
        </div>
      </div>

      {/* Mobile-only horizontal characters representation bar */}
      <div id="heroes-mobile-view" className="relative z-10 w-full flex md:hidden justify-between items-center max-w-sm mx-auto px-4 pointer-events-none mb-2 mt-1">
        <div className="flex items-center gap-2 bg-blue-900/60 border border-blue-500/20 px-3 py-1 rounded-full">
          <LucideIcon name="Shield" className="text-blue-200 animate-pulse" size={13} />
          <span className="text-[10px] font-black text-white">骑士 (Knight)</span>
        </div>
        
        {/* Step dots */}
        <div className="flex gap-1">
          {LORE_SCENES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === lineIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 bg-pink-900/60 border border-pink-500/20 px-3 py-1 rounded-full">
          <LucideIcon name="GraduationCap" className="text-pink-200 animate-pulse" size={13} />
          <span className="text-[10px] font-black text-white">学者 (Scholar Mage)</span>
        </div>
      </div>

      {/* 5. BOTTOM MASSIVE GOLDEN GLOWING KEY ACTION BUTTON: 【开启传说之旅】 */}
      <AnimatePresence>
        {(showEpicButton || lineIndex === LORE_SCENES.length - 1) && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className="relative z-30 w-full flex flex-col items-center mt-4"
          >
            {/* Glowing magic halo behind the main action CTA */}
            <div className="absolute inset-0 -top-2 max-w-sm mx-auto h-16 bg-amber-500/40 rounded-full blur-xl animate-ping opacity-60 pointer-events-none" />

            <button
              id="lore-page-confirm-cta"
              onClick={onConfirmLore}
              className="w-full max-w-xs sm:max-w-md py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 text-red-950 font-black text-lg sm:text-2xl rounded-2xl border-2 border-white shadow-[0_8px_0_#bd7c00,0_20px_35px_rgba(245,158,11,0.5)] transition-all duration-100 flex items-center justify-center gap-2.5 cursor-pointer select-none active:translate-y-1 active:shadow-[0_4px_0_#bd7c00,0_8px_15px_rgba(0,0,0,0.3)] touch-manipulation hover:scale-[1.03] uppercase tracking-wider"
            >
              <LucideIcon name="Swords" className="text-red-950 animate-bounce" size={20} />
              <span>开启传说之旅 (START GAME)</span>
              <LucideIcon name="ChevronRight" className="text-red-950" size={22} />
            </button>

            {/* Bottom auxiliary hints */}
            <p className="text-[10px] font-extrabold text-amber-300/80 mt-3.5 select-none flex items-center gap-1.5 bg-purple-950/40 px-3.5 py-1 rounded-full border border-purple-500/10">
              <LucideIcon name="Sparkle" size={10} className="text-amber-400 animate-pulse" />
              <span>勇士：已经集结，真正的智慧之战，即刻奏响！</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
