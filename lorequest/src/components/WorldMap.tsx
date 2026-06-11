/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Subject, GradeLevel } from '../types';
import { CHARACTERS, getRawImageUrl } from './GameIntro';
import LucideIcon from './LucideIcon';

interface WorldMapProps {
  characterIndex: number;
  scoreHistory: Array<{ subject: Subject; accuracy: number }>;
  onSelectCountry: (subject: Subject) => void;
  onChangeHero: () => void;
}

interface MonsterConfig {
  id: Subject;
  elementId: string;
  name: string;
  title: string;
  avatar: string; // Lucide icon name
  imageUrl?: string;
  desc: string;
  maxHp: number;
  attackValue: number;
  bgColor: string; // Dark gradient base matching monster theme
  borderColor: string;
  accentColor: string; // Badge branding class
  subjectName: string;
}

const MONSTERS: MonsterConfig[] = [
  {
    id: 'origin',
    elementId: 'boss-goblin',
    name: '词汇哥布林',
    title: 'LV1 词义捣蛋鬼',
    avatar: 'Smile',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/Word%20Goblin%E5%8D%95%E8%AF%8D%E5%93%A5%E5%B8%83%E6%9E%97.png',
    desc: '喜欢偷取跟篡改地道英语单词词源的淘气小妖！它最怕你揭开词根背后的神秘起源故事。',
    maxHp: 50,
    attackValue: 7,
    bgColor: 'from-emerald-950/80 via-slate-900 to-slate-900',
    borderColor: 'border-emerald-500/20 hover:border-emerald-500/60 hover:shadow-emerald-950/50',
    accentColor: 'text-emerald-400 bg-emerald-950/90 border-emerald-500/30',
    subjectName: '📖 单词词源起源'
  },
  {
    id: 'communication',
    elementId: 'boss-ghost',
    name: '排队幽灵',
    title: 'LV2 礼仪审判员',
    avatar: 'Ghost',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/Queue%20Ghost%E6%8E%92%E9%98%9F%E5%B9%BD%E7%81%B5.png',
    desc: '在日常会话、求助与生活问候中设置直译怪圈的傲娇幽灵！掌握跨文化得体礼仪才能收复它。',
    maxHp: 75,
    attackValue: 11,
    bgColor: 'from-sky-950/80 via-slate-900 to-slate-900',
    borderColor: 'border-sky-505/20 border-sky-500/20 hover:border-sky-500/60 hover:shadow-sky-950/50',
    accentColor: 'text-sky-400 bg-sky-905 bg-sky-950/90 border-sky-500/30',
    subjectName: '💬 地道跨文化应用'
  },
  {
    id: 'festival',
    elementId: 'boss-dragon',
    name: '节日狂龙',
    title: 'LV3 庆典破坏者',
    avatar: 'Flame',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/Festival%20Dragon%E8%8A%82%E6%97%A5%E5%B7%A8%E9%BE%99.png',
    desc: '试图用极高难度的西方大型佳节与民俗百科考倒你的爆裂狂龙！准备好你的南瓜与火鸡了吗？',
    maxHp: 95,
    attackValue: 15,
    bgColor: 'from-rose-950/80 via-slate-900 to-slate-900',
    borderColor: 'border-rose-500/20 hover:border-rose-500/60 hover:shadow-rose-950/50',
    accentColor: 'text-rose-400 bg-rose-950/90 border-rose-500/30',
    subjectName: '🎁 节庆风俗百科'
  },
  {
    id: 'culture',
    elementId: 'boss-moro',
    name: '混沌魔王莫罗',
    title: 'LV4 终极混沌星主',
    avatar: 'Skull',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/Chaos%20Lord%20Moros%E6%B7%B7%E4%B8%96%E9%AD%94%E7%8E%8B%E8%8E%AB%E7%BD%97%E6%96%AF.png',
    desc: '笼罩整个文化大陆的终极黑幕魔王！它掌握着最深度、最完备的英语国家风俗、社会常识。',
    maxHp: 125,
    attackValue: 20,
    bgColor: 'from-purple-950/80 via-slate-900 to-slate-900',
    borderColor: 'border-purple-500/20 hover:border-purple-500/60 hover:shadow-purple-950/50',
    accentColor: 'text-purple-400 bg-purple-950/90 border-purple-500/30',
    subjectName: '👑 综合社会习俗常识'
  }
];

export default function WorldMap({
  characterIndex,
  scoreHistory,
  onSelectCountry,
  onChangeHero
}: WorldMapProps) {
  const hero = CHARACTERS[characterIndex] || CHARACTERS[0];
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Check if a specific monster key has been cleared
  const checkMonsterLiberation = (monoId: Subject) => {
    // Moro correlates to general or culture
    if (monoId === 'culture') {
      return scoreHistory.some(s => s.subject === 'culture' || s.subject === 'general');
    }
    return scoreHistory.some(s => s.subject === monoId);
  };

  return (
    <div id="monster-board-viewport" className="max-w-6xl mx-auto py-5 px-4 md:px-6">
      
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-black mb-2 shadow-xs">
            <LucideIcon name="Sword" size={12} className="animate-pulse" />
            <span>突袭魔王殿 · BATTLE ARENA</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">CULTURE BOSS · 战役四大魔王</h2>
          <p className="text-slate-500 text-xs mt-1">请选择你要单挑、感化与净化的傲慢魔王，测试掌握的英语常识</p>
        </div>

        {/* Hero Quick Badge */}
        <div className="bg-white border-2 border-indigo-100/80 p-3.5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-indigo-100/40 transition-all select-none">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${hero.color} relative overflow-hidden ring-2 ring-white shadow-md`}>
              {hero.imageUrl ? (
                <img
                  src={getRawImageUrl(hero.imageUrl)}
                  alt={hero.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <LucideIcon name={hero.avatar} size={22} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block -mb-0.5">出战英雄：</span>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1 rounded">
                  {hero.roleKey === 'scholar_mage' ? '连击加伤' : hero.roleKey === 'knight_warrior' ? '盾牌抗伤' : hero.roleKey === 'ranger_explorer' ? '暴击奇袭' : '经验增幅'}
                </span>
              </div>
              <span className="text-sm font-black text-slate-800 leading-tight block">
                {hero.nameZH}
              </span>
            </div>
          </div>
          
          <button
            onClick={onChangeHero}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-205 text-slate-650 border border-slate-250 hover:border-slate-350 text-[11px] font-extrabold rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-97"
          >
            <LucideIcon name="RefreshCw" size={11} className="text-slate-500" />
            <span>更换英雄</span>
          </button>
        </div>
      </div>

      {/* Main Grid display four monsters directly */}
      <div className="p-6 md:p-8 bg-slate-900 bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] [background-size:16px_16px] rounded-[28px] shadow-2xl border-4 border-slate-800 flex flex-col gap-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {MONSTERS.map((mono, idx) => {
            const isCleared = checkMonsterLiberation(mono.id);

            return (
              <motion.div
                key={mono.id}
                id={mono.elementId}
                className="flex flex-col h-full justify-between bg-gradient-to-b from-slate-800 to-slate-850 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group min-h-[360px]"
                style={{ contentVisibility: 'auto' }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                
                {/* Glowing status halo on active/hover of cards */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 z-0 pointer-events-none" />

                <div className="p-5 flex flex-col flex-1 justify-between relative z-10">
                  <div>
                    {/* Top line header */}
                    <div className="flex items-center justify-between w-full mb-3.5 pb-2.5 border-b border-white/5">
                      <span className={`text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${mono.accentColor}`}>
                        LEVEL 0{idx + 1}
                      </span>
                      {isCleared ? (
                        <span className="text-[9px] font-black bg-emerald-950 border border-emerald-500/40 text-emerald-400 px-2 rounded-md flex items-center gap-0.5">
                          <LucideIcon name="CheckCircle2" size={9} />
                          <span>已收复</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-black bg-amber-950 border border-amber-500/40 text-amber-400 px-2 rounded-md flex items-center gap-0.5 animate-pulse">
                          <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
                          <span>突袭中</span>
                        </span>
                      )}
                    </div>

                    {/* Central Avatar Visual representation */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${idx === 0 ? 'from-emerald-400 to-green-600' : idx === 1 ? 'from-sky-400 to-indigo-600' : idx === 2 ? 'from-rose-500 to-red-600' : 'from-purple-600 to-indigo-800'} flex items-center justify-center text-white shadow-xl hover:scale-110 active:rotate-12 transition-all shrink-0 overflow-hidden`}>
                        {mono.imageUrl && !imageErrors[mono.elementId] ? (
                          <img
                            src={getRawImageUrl(mono.imageUrl)}
                            alt={mono.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={() => {
                              setImageErrors(prev => ({ ...prev, [mono.elementId]: true }));
                            }}
                          />
                        ) : (
                          <LucideIcon name={mono.avatar} size={28} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-extrabold text-base tracking-tight leading-tight">{mono.name}</h3>
                        <p className="text-amber-400 font-bold text-[10.5px] mt-0.5 uppercase tracking-wider">{mono.title}</p>
                      </div>
                    </div>

                    {/* Combat Stats Indicators */}
                    <div className="grid grid-cols-2 gap-2 bg-black/35 p-2 rounded-xl border border-white/5 mb-3.5 font-mono text-[10.5px] text-slate-300">
                      <div className="flex items-center gap-1 justify-center border-r border-white/5 py-0.5">
                        <LucideIcon name="Heart" size={11} className="text-rose-500 fill-rose-500/20" />
                        <span>HP: {mono.maxHp}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-center py-0.5">
                        <LucideIcon name="Swords" size={11} className="text-amber-400" />
                        <span>威力: {mono.attackValue}</span>
                      </div>
                    </div>

                    {/* Lore description content line */}
                    <p className="text-[11.5px] text-slate-400/90 leading-relaxed font-medium mb-3.5 block h-14 overflow-hidden text-ellipsis line-clamp-3">
                      {mono.desc}
                    </p>
                  </div>

                  {/* Subject Scope badge */}
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold mb-3 border-t border-white/5 pt-3.5 flex justify-between items-center">
                      <span>考查范围：</span>
                      <strong className="text-indigo-300 font-black tracking-wide">{mono.subjectName}</strong>
                    </div>

                    {/* High-visibility challenge CTA action trigger button */}
                    <button
                      onClick={() => onSelectCountry(mono.id)}
                      className={`w-full py-3 px-4 rounded-xl text-center text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md select-none border group hover:translate-y-[-1px] ${
                        isCleared
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 border-emerald-500/30 hover:border-emerald-400/50 text-white'
                          : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-450 hover:to-red-400 border-amber-500/30 hover:border-amber-400 text-white'
                      }`}
                    >
                      <LucideIcon name="Swords" size={13} className="text-white group-hover:rotate-12 transition-transform text-white" />
                      <span>{isCleared ? '重新净化该魔王' : '⚡ 开启对战 !'}</span>
                      <LucideIcon name="ArrowRight" size={11} className="translate-x-0 group-hover:translate-x-0.5 transition-transform text-white opacity-80" />
                    </button>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Footer Radar Comsat Connection */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-mono mt-2 pt-4 border-t border-slate-800/40 gap-2">
          <span>COMSAT CONNECTIVITY LINK // SECURE TRIVIA CORES ACTIVE</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>已净化魔王 (🏆)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>待收伏对手 (⚔️)</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
