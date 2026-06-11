/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CHARACTERS, getRawImageUrl } from './GameIntro';
import { BOSS_LIST, getBossForSubject } from '../data/bosses';
import { GradeLevel, Subject } from '../types';
import LucideIcon from './LucideIcon';

interface LoadingPageProps {
  gradeLevel: GradeLevel;
  subject: Subject;
  characterIndex: number;
  onLoadingComplete: () => void;
}

const TIPS_POOL = [
  "💡 答对题目，智慧卡牌才能100%威力爆发痛击误解怪兽！",
  "📚 单词‘Salary’（薪水）最早在古罗马是指用来买‘食盐 (Salt)’的津贴哦！",
  "🛡️ 跨文化沟通卫士张小智，能在每回合开局自动凝聚2层礼仪护盾护胸！",
  "💖 李小美是节日探索家，答对时触发快乐药剂瞬间回复 +3 生命值！",
  "⚔️ 英美车辆靠马路【左侧】行驶，而拍照合影时高呼‘Cheese’是为了展示微笑！",
  "💥 雷、火、水、微光五大卡牌魔法，让你的跨文化对决特效华丽翻倍！",
  "🎵 伦敦‘大本钟’(Big Ben) 是英国泰晤士河畔雷鸣般的标志性历史艺术钟楼！"
];

export default function LoadingPage({
  gradeLevel,
  subject,
  characterIndex,
  onLoadingComplete
}: LoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [bossImageError, setBossImageError] = useState(false);

  const hero = CHARACTERS[characterIndex] || CHARACTERS[0];
  // Showcase the correct boss for the active subject being challenged
  const boss = getBossForSubject(subject);

  const getSubjectName = (sub: Subject) => {
    switch (sub) {
      case 'culture': return '英语国家文化大陆';
      case 'origin': return '单词起源探秘遗迹';
      case 'festival': return '节日知识百科乐园';
      case 'communication': return '地道跨文化交流沙龙';
      case 'general': return '基础英语常识神殿';
    }
  };

  const getGradeText = (grade: GradeLevel) => {
    switch (grade) {
      case 'junior': return '低年级副本';
      case 'middle': return '中年级关卡';
      case 'senior': return '高年级挑战';
    }
  };

  // Organic progress bar loader simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Organic steps
        const step = Math.floor(Math.random() * 8) + 4;
        const next = prev + step;
        if (next >= 100) {
          return 100;
        }
        return next;
      });
    }, 90);

    return () => clearInterval(timer);
  }, []);

  // Trigger loading complete after progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      const completionTimer = setTimeout(() => {
        onLoadingComplete();
      }, 200);
      return () => clearTimeout(completionTimer);
    }
  }, [progress, onLoadingComplete]);

  // Tip slider
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS_POOL.length);
    }, 1800);

    return () => clearInterval(tipTimer);
  }, []);

  return (
    <div
      id="magical-loading-page"
      className="fixed inset-0 bg-[#f0f4fa] bg-[radial-gradient(#c2daf8_2px,transparent_2px)] [background-size:24px_24px] z-50 flex flex-col justify-between p-6 select-none overflow-y-auto"
    >
      {/* Upper header space */}
      <div className="w-full flex justify-between items-center max-w-4xl mx-auto pt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
        <span>KIDS TRIVIA ENGINE</span>
        <div className="flex items-center gap-1.5 text-indigo-600 font-extrabold bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 animate-pulse">
          <LucideIcon name="Sparkles" size={12} className="animate-spin-slow" />
          <span>正在开辟传送通道</span>
        </div>
      </div>

      {/* Main center section containing mock-up style cards */}
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center py-6">
        
        {/* Immersive rounded high-contrast Purple Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-[42px] font-black text-[#3f3d99] tracking-wider mb-2 text-center drop-shadow-sm leading-tight"
        >
          {getSubjectName(subject)}
        </motion.h1>
        
        <p className="text-[13px] text-indigo-600 font-extrabold tracking-widest uppercase mb-10 text-center bg-indigo-100/40 px-4 py-1.5 rounded-full border border-indigo-200/40">
          📍 守护地道常识 · 勇气磁场凝聚中...
        </p>

        {/* Beautiful Duplex Mock-up Cards row matching "选择你的英雄" photo style exactly */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full mb-10 relative">
          
          {/* Card 1: Selected Hero */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[32px] border-4 border-[#edf2f9] shadow-[0_20px_45px_0_rgba(155,180,215,0.45)] p-6 sm:p-7 flex flex-col items-center w-[230px] text-center shrink-0 relative group"
          >
            {/* Soft blue character circle spotlight matching mockup */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-b from-[#f0f4ff] to-[#d9e6f9] border-4 border-indigo-100 flex items-center justify-center relative shadow-inner overflow-visible mb-5">
              {hero.imageUrl ? (
                <img
                  src={getRawImageUrl(hero.imageUrl)}
                  alt={hero.name}
                  referrerPolicy="no-referrer"
                  className="absolute -bottom-1 h-[115%] w-auto object-contain filter drop-shadow-md bg-transparent"
                />
              ) : (
                <LucideIcon name={hero.avatar} size={50} className={hero.textColor} />
              )}
            </div>

            {/* Bold stylized pill badge button matching the "我是小威" exactly */}
            <div className="bg-[#2a7df5] text-white font-black text-xs sm:text-sm py-2 px-6 rounded-full shadow-lg shadow-blue-500/15 mb-3 select-none leading-none w-full">
              我是{hero.name}
            </div>

            {/* Sub-label showing class role with emoji */}
            <div className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg">
              {hero.title} ⚔️
            </div>

            <span className="absolute -top-3.5 -right-3 px-3 py-1 bg-amber-400 border border-white text-[9px] font-black italic rounded-full text-slate-900 shadow-md">
              PLAYER HERO
            </span>
          </motion.div>

          {/* Golden Magical "VS" Seal connecting them */}
          <div className="relative z-10 my-1 md:my-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-400 to-amber-500 border-4 border-white text-slate-900 font-black text-sm flex items-center justify-center shadow-lg animate-bounce-slow">
              VS
            </div>
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md animate-ping" />
          </div>

          {/* Card 2: Chosen Subject Castle Boss guard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[32px] border-4 border-[#fff0f4] shadow-[0_20px_45px_0_rgba(215,155,170,0.3)] p-6 sm:p-7 flex flex-col items-center w-[230px] text-center shrink-0 relative group"
          >
            {/* Soft pink boss spot spotlight matching style, scaled up for majestic boss stature */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#fdf2f4] to-[#fce4e8] border-4 border-rose-100 flex items-center justify-center relative shadow-inner overflow-visible mb-1 shadow-md">
              {boss.imageUrl && !bossImageError ? (
                <img
                  src={getRawImageUrl(boss.imageUrl)}
                  alt={boss.name}
                  referrerPolicy="no-referrer"
                  onError={() => {
                    setBossImageError(true);
                  }}
                  className="absolute -bottom-1.5 h-[130%] w-auto object-contain filter drop-shadow-lg bg-transparent hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <LucideIcon name={boss.avatar} size={56} className="text-rose-500 fill-rose-100" />
              )}
            </div>

            {/* Spacer to align buttons perfectly with Hero Card's contents */}
            <div className="h-4" />

            {/* Bold stylized red pill badge button exactly matching the "我是小芽" style theme */}
            <div className="bg-[#f0436d] text-white font-black text-xs sm:text-sm py-2 px-6 rounded-full shadow-lg shadow-rose-500/15 mb-3 select-none leading-none w-full">
              {boss.name}
            </div>

            {/* Sub-label showing class level badge with emoji */}
            <div className="text-[11px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-lg">
              {boss.title} 🏰
            </div>

            <span className="absolute -top-3.5 -left-3 px-3 py-1 bg-rose-600 border border-white text-[9px] font-black italic rounded-full text-white shadow-md">
              CASTLE GUARD
            </span>
          </motion.div>

        </div>

        {/* Progress Bar Loader Container */}
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl p-4.5 rounded-3xl relative">
          
          {/* Progress information text line */}
          <div className="flex items-center justify-between text-slate-600 font-extrabold text-xs mb-2 px-1">
            <span className="flex items-center gap-1.5">
              <LucideIcon name="Settings2" size={13} className="text-indigo-500 animate-spin-slow" />
              <span>载入进度： {Math.min(progress, 100)} %</span>
            </span>
            <span className="text-[10px] text-indigo-600 font-mono tracking-wider">LOADING...</span>
          </div>

          {/* Actual progress bar */}
          <div className="w-full h-3.5 bg-slate-100 border border-slate-200/60 rounded-full overflow-hidden relative p-0.5 shadow-inner">
            <motion.div
              style={{ width: `${Math.min(progress, 100)}%` }}
              className="h-full bg-gradient-to-r from-indigo-505 via-blue-500 to-indigo-650 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.15)] relative"
            />
          </div>

          {/* Tip slider container with smooth transition */}
          <div className="mt-3 text-center border-t border-dashed border-slate-100 pt-3">
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[11px] text-slate-500 font-semibold leading-relaxed"
              >
                {TIPS_POOL[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Low-profile system copyright */}
      <div className="w-full text-center text-[10px] text-slate-400 font-black tracking-widest pb-3 uppercase">
        © 2026 KIDS TRIVIA CASTLE INC. ALL BRAINPOWER SECURED.
      </div>
    </div>
  );
}
