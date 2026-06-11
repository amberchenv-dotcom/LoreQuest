/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import LucideIcon from './LucideIcon';

interface GameIntroProps {
  onConfirmCharacter: (characterIndex: number) => void;
  initialCharacterIndex?: number;
}

export const getRawImageUrl = (url?: string): string => {
  if (!url) return '';
  if (url.includes('github.com') && url.includes('/blob/')) {
    return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }
  return url;
};

export const CHARACTERS = [
  {
    roleKey: 'scholar_mage',
    name: 'Scholar Mage',
    nameZH: '学者法师',
    title: '智慧奥妙掌控者',
    avatar: 'GraduationCap',
    color: 'bg-indigo-600',
    borderColor: 'border-indigo-400',
    glowColor: 'shadow-indigo-500/30',
    lightBg: 'bg-indigo-50/50',
    textColor: 'text-indigo-600',
    statsText: '智力 ★★★★★ | 生命 ★★★',
    passiveTitle: 'Knowledge Blast',
    passiveDesc: '连续答对三题后，卡牌动作将凝聚超高能知识爆发，额外效果造成 1.5 倍爆发伤害！',
    passive: 'Knowledge Blast：连续答对三题后伤害 1.5 倍爆发！',
    maxHpBonus: 0,
    shieldBonus: 0,
    healBonus: 0,
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E5%AD%A6%E8%80%85%E6%B3%95%E5%B8%88%E8%A7%92%E8%89%B2Scholar%20Mage.png',
    motto: '“地道语言的演变皆有迹可循，看连击之风掀开误解的长卷！”',
    stats: {
      intelligence: 5,
      hp: 3,
      defense: 2,
      attack: 3,
      combo: 4
    }
  },
  {
    roleKey: 'knight_warrior',
    name: 'Knight Warrior',
    nameZH: '骑士',
    title: '理性格盾防御者',
    avatar: 'Shield',
    color: 'bg-blue-600',
    borderColor: 'border-blue-400',
    glowColor: 'shadow-blue-500/30',
    lightBg: 'bg-blue-50/50',
    textColor: 'text-blue-600',
    statsText: '防御 ★★★★★ | 攻击 ★★★★',
    passiveTitle: 'Shield of Wisdom',
    passiveDesc: '前两次答错时圣盾护身，全额挡下 100% 反噬伤害不扣血！且初始自带 4 盾保驾护航！',
    passive: 'Shield of Wisdom：答错前两次免伤，初始 +4 护盾！',
    maxHpBonus: 10,
    shieldBonus: 4,
    healBonus: 0,
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E9%AA%91%E5%A3%AB%E8%A7%92%E8%89%B2Knight%20Warrior.png',
    motto: '“身披逻辑的秘银重铠，世间偏见与直译怪兽绝难攻破我们的城防！”',
    stats: {
      intelligence: 3,
      hp: 5,
      defense: 5,
      attack: 4,
      combo: 2
    }
  },
  {
    roleKey: 'ranger_explorer',
    name: 'Ranger Explorer',
    nameZH: '探险家',
    title: '世界文明勘测者',
    avatar: 'Compass',
    color: 'bg-amber-500',
    borderColor: 'border-amber-400',
    glowColor: 'shadow-amber-500/30',
    lightBg: 'bg-amber-50/50',
    textColor: 'text-amber-600',
    statsText: '速度 ★★★★★ | 幸运 ★★★★★',
    passiveTitle: 'Lucky Guess',
    passiveDesc: '游历世界的野性直觉！使用卡牌攻击时有固定的 20% 概率触发致命暴击，造成 1.5 倍伤害！',
    passive: 'Lucky Guess：卡牌动作有 20% 概率触发 1.5 倍伤害暴击！',
    maxHpBonus: 5,
    shieldBonus: 0,
    healBonus: 0,
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E6%8E%A2%E9%99%A9%E5%AE%B6%E8%A7%92%E8%89%B2Ranger%20Explorer.png',
    motto: '“荒野的微风和古代遗迹，都在大声预示这道题目的精湛答案！”',
    stats: {
      intelligence: 4,
      hp: 3,
      defense: 2,
      attack: 3,
      combo: 3
    }
  },
  {
    roleKey: 'bard',
    name: 'Bard',
    nameZH: '吟游诗人',
    title: '和平圣歌咏唱者',
    avatar: 'Music',
    color: 'bg-rose-500',
    borderColor: 'border-rose-400',
    glowColor: 'shadow-rose-500/30',
    lightBg: 'bg-rose-50/50',
    textColor: 'text-rose-600',
    statsText: '连击 ★★★★★ | 魅力 ★★★★★',
    passiveTitle: 'Combo Song',
    passiveDesc: '连续答对时演奏激昂诗篇，全流程通关经验（EXP）200% 翻倍获取！守护友谊与歌谣！',
    passive: 'Combo Song：连续答对时通关经验 200% 加倍获取！',
    maxHpBonus: 0,
    shieldBonus: 0,
    healBonus: 2,
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E5%90%9F%E6%B8%B8%E8%AF%97%E4%BA%BA%E8%A7%92%E8%89%B2Bard.png',
    motto: '“用竖琴弹奏起浪漫的英伦风 and 节日的快乐颂，让我们踏歌而行！”',
    stats: {
      intelligence: 3,
      hp: 3,
      defense: 2,
      attack: 2,
      combo: 5
    }
  }
];

export default function GameIntro({ onConfirmCharacter, initialCharacterIndex = 0 }: GameIntroProps) {
  const [charIndex, setCharIndex] = useState<number>(initialCharacterIndex);

  const handleConfirm = (index: number) => {
    onConfirmCharacter(index);
  };

  return (
    <div id="game-intro-viewport" className="max-w-6xl mx-auto py-4 px-4 md:px-6">
      {/* Dynamic Header */}
      <motion.div
        id="game-logo-banner"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <div id="intro-badge" className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full py-1 px-4 mb-3 text-indigo-700 text-xs font-bold shadow-sm">
          <LucideIcon name="Shield" className="text-indigo-600 animate-pulse" size={13} />
          CULTURE WARRIOR · 文化勇士奇袭录
        </div>
        <h1 id="intro-title" className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">
          请选择出战的<span className="text-indigo-600">文化勇士卡牌</span>
        </h1>
      </motion.div>

      {/* Collectible Cards Selector Row */}
      <div id="character-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-8">
        {CHARACTERS.map((char, index) => {
          const isSelected = charIndex === index;
          const isKnight = char.roleKey === 'knight_warrior';

          return (
            <div
              key={char.roleKey}
              id={`game-selection-card-${char.roleKey}`}
              className="flex flex-col h-[475px] group"
              style={{ perspective: 1200 }}
              onClick={() => setCharIndex(index)}
            >
              {/* Card Container capable of 3D Turn */}
              <motion.div
                className="w-full h-[415px] relative cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isSelected ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                
                {/* CARD FRONT SIDE (Covered with full-size character photo) */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-2xl p-5 border-2 flex flex-col justify-between overflow-hidden shadow-lg ${
                    isKnight
                      ? (isSelected ? 'border-amber-400 bg-black ring-4 ring-amber-400/20' : 'border-slate-800 bg-black hover:border-slate-650')
                      : (isSelected ? 'border-indigo-500 ring-4 ring-indigo-500/25 bg-slate-900' : 'border-slate-700 bg-slate-900 hover:border-slate-500 hover:shadow-2xl')
                  }`}
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                  
                  {/* FULL-BLEED CHARACTER PORTRAIT BACKGROUND */}
                  {char.imageUrl ? (
                    <div className={`absolute inset-0 w-full h-full z-0 overflow-hidden ${isKnight ? 'bg-black' : 'bg-slate-950'}`}>
                      <img
                        src={getRawImageUrl(char.imageUrl)}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isKnight ? 'brightness-90 contrast-110' : ''}`}
                      />
                      {/* Rich darkening overlay at bottom & top for contrast */}
                      <div className={`absolute inset-0 z-10 ${
                        isKnight
                          ? 'bg-gradient-to-t from-black via-black/50 to-black/20'
                          : 'bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/25'
                      }`} />
                    </div>
                  ) : (
                    <div className={`absolute inset-0 w-full h-full z-0 flex items-center justify-center ${isKnight ? 'bg-black' : 'bg-slate-900'}`}>
                      <LucideIcon name={char.avatar} size={72} className="text-slate-700/50" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
                    </div>
                  )}

                  {/* Relative content sitting above the portrait backdrop */}
                  <div className="relative z-20 flex flex-col justify-between h-full w-full">
                    <div>
                      {/* Floating selection indicator/pin at top right for pristine aesthetic */}
                      <div className="absolute top-0 right-0 z-30">
                        {isSelected ? (
                          <span className="w-6 h-6 bg-indigo-500 border-2 border-white text-white rounded-full flex items-center justify-center shadow-md animate-scaleUp">
                            <LucideIcon name="Check" size={12} />
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full border-2 border-white/45 bg-black/20 flex items-center justify-center hover:bg-black/40 transition-colors" />
                        )}
                      </div>

                      {/* Spacer to show off the gorgeous center artwork */}
                      <div className="h-[210px]" />

                      {/* Class Details labels overlay over lower chest area */}
                      <div className={`text-center p-2.5 rounded-xl border shadow-lg mt-2 ${
                        isKnight 
                          ? 'bg-black/95 border-amber-500/30' 
                          : 'bg-slate-950/80 border-white/10'
                      }`}>
                        <h3 className="font-black text-white text-base leading-tight tracking-wide drop-shadow">
                          {char.name}
                        </h3>
                        <h4 className="font-extrabold text-amber-300 text-xs mt-0.5 tracking-wider">
                          {char.nameZH}
                        </h4>
                      </div>

                      {/* Motto over dark gradient bottom */}
                      <p className="text-center text-slate-200 italic text-[10.5px] leading-relaxed max-w-[220px] mx-auto mt-2.5 truncate font-medium drop-shadow-md">
                        {char.motto}
                      </p>
                    </div>

                    {/* Active call indicator banner at deep bottom */}
                    <div className="border-t border-white/10 pt-3 flex items-center justify-between mt-auto">
                      <span className="text-[9px] font-black text-amber-300 bg-amber-950/70 uppercase border border-amber-500/25 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                        {char.roleKey === 'scholar_mage' ? '⚡ 答对超杀' : char.roleKey === 'knight_warrior' ? '🛡️ 答错防扣' : char.roleKey === 'ranger_explorer' ? '🎯 随机暴击' : '🎵 双倍经验'}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-extrabold animate-pulse flex items-center gap-0.5">
                        <span>已选中卡牌</span>
                        <LucideIcon name="ChevronRight" size={10} />
                      </span>
                    </div>
                  </div>

                </div>

                {/* CARD BACK SIDE */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-2xl p-5 border-2 flex flex-col justify-between overflow-hidden shadow-2xl ${
                    isKnight
                      ? (isSelected ? 'border-amber-400 bg-gradient-to-b from-black via-slate-950 to-black text-slate-100 ring-4 ring-amber-400/25' : 'border-slate-800 bg-black text-slate-350')
                      : (isSelected ? 'border-indigo-600 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-slate-200 ring-4 ring-indigo-200' : 'border-slate-800 bg-slate-900 text-slate-350')
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="w-full flex-1 flex flex-col justify-between">
                    <div>
                      {/* Header profile label */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                        <span className="text-[9px] font-black text-amber-400 block uppercase tracking-wider">
                          勇士能力档案 · ENCRYPTED REGISTRY
                        </span>
                        <LucideIcon name="Award" size={11} className="text-amber-400 animate-bounce" />
                      </div>

                      {/* Stats Level Rating Indicator */}
                      <div className="space-y-1.5 text-xs bg-black/30 p-2.5 rounded-xl border border-white/5 mb-3">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-white/5 pb-1 mb-1 font-bold">
                          <span>能力阶梯分布</span>
                          <span className="font-mono text-amber-400">STATE STARS</span>
                        </div>
                        
                        {Object.entries(char.stats).map(([k, val]) => {
                          const labels: Record<string, string> = {
                            intelligence: '🧠 智力因子',
                            hp: '💖 契约生命',
                            defense: '🛡️ 被动护壁',
                            attack: '⚔️ 卡牌威力',
                            combo: '⚡ 连击熟练'
                          };
                          return (
                            <div key={k} className="flex items-center gap-1.5">
                              <span className="w-16 text-[9px] font-extrabold text-slate-block block truncate">{labels[k]}</span>
                              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div style={{ width: `${val * 20}%` }} className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                              </div>
                              <span className="font-mono text-[8px] text-amber-300 w-3 font-semibold text-right">★{val}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Passive Description frame */}
                    <div className={`border rounded-xl p-2.5 ${
                      isKnight 
                        ? 'bg-amber-950/20 border-amber-500/30' 
                        : 'bg-indigo-950/70 border-indigo-500/30'
                    }`}>
                      <div className="flex items-center gap-1.5 font-black text-amber-300 text-[10px] mb-1">
                        <span className="flex items-center justify-center w-4 h-4 rounded bg-amber-400/20 text-amber-400">
                          <LucideIcon name="Sparkle" size={10} className="animate-pulse" />
                        </span>
                        <span>被动: {char.passiveTitle}</span>
                      </div>
                      <p className="text-slate-300 text-[10px] leading-relaxed font-semibold pl-5 text-pretty">
                        {char.passiveDesc}
                      </p>
                    </div>
                  </div>

                </div>

              </motion.div>

              {/* Selection Status Indicator Underneath Card */}
              <div className="text-center mt-3 select-none">
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-250 px-3.5 py-1 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    已选中 ACTIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-slate-650 bg-slate-50 border border-slate-200 px-3.5 py-1 rounded-full transition-all">
                    <LucideIcon name="MousePointerClick" size={11} className="text-slate-300" />
                    <span>选择该勇士</span>
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Unified Prominent CTA Button Below the Cards Grid */}
      <div id="unified-confirm-wrapper" className="flex flex-col items-center justify-center mt-10 mb-8">
        <button
          id="btn-unified-hero-confirm"
          onClick={() => handleConfirm(charIndex)}
          className="px-12 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-650 text-white font-black text-base rounded-2xl shadow-xl shadow-amber-500/25 hover:scale-[1.04] active:scale-98 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer min-w-[320px] border border-amber-400/40 group uppercase tracking-wider text-shadow-sm"
        >
          <LucideIcon name="Flame" size={20} className="text-white animate-bounce" />
          <span>确认选择，派【{CHARACTERS[charIndex].nameZH}】出战！</span>
          <LucideIcon name="ArrowRight" size={18} className="translate-x-0 group-hover:translate-x-1.5 transition-transform" />
        </button>
        <p className="text-[11px] text-slate-400 font-bold mt-3.5 flex items-center gap-1 select-none">
          <LucideIcon name="Sparkles" size={11} className="text-amber-500" />
          获得天赋优势: <span className="text-indigo-600">{CHARACTERS[charIndex].passive}</span>
        </p>
      </div>

      {/* Guidelines Notice */}
      <div id="intro-tactical-bottom-card" className="max-w-4xl mx-auto p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-3.5 text-slate-600 text-xs leading-relaxed shadow-sm items-center">
        <div className="w-10 h-10 rounded-xl bg-warm border border-amber-200/70 shadow-sm flex items-center justify-center shrink-0 bg-amber-100/50">
          <LucideIcon name="Info" className="text-amber-500" size={18} />
        </div>
        <div>
          <span className="font-extrabold text-amber-800 block mb-0.5">🎮 战神对决机制 (CULTURE ARENA RULE)</span>
          答题和动作卡牌是唯一的战斗武器！消耗能量打出技能卡片并完成地道真知问答。
          <strong className="text-slate-800">答对：</strong>动作顺利激活痛击魔王！
          <strong className="text-slate-800">答错：</strong>产生深渊反噬消耗魔力！灵活点击上方角色，查看被动保驾护航。
        </div>
      </div>
    </div>
  );
}
