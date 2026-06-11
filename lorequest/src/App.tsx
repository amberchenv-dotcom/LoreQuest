/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import GameIntro from './components/GameIntro';
import StartupPage from './components/StartupPage';
import LorePage from './components/LorePage';
import WorldMap from './components/WorldMap';
import BattleZone from './components/BattleZone';
import LoadingPage from './components/LoadingPage';
import LucideIcon from './components/LucideIcon';
import { GradeLevel, Subject } from './types';

interface ScoreRecord {
  gradeLevel: GradeLevel;
  subject: Subject;
  accuracy: number;
  character: string;
  date: string;
  expEarned?: number;
}

export default function App() {
  const [gameState, setGameState] = useState<'startup' | 'lore' | 'intro' | 'map' | 'loading' | 'battle'>('startup');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('junior');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('culture');
  const [charIndex, setCharIndex] = useState<number>(0);
  const [scoreList, setScoreList] = useState<ScoreRecord[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioObj] = useState<HTMLAudioElement>(() => {
    const audio = new Audio('https://raw.githubusercontent.com/amberchenv-dotcom/gamepicture/main/Moonlit%20Quiz%20Hall.mp3');
    audio.loop = true;
    return audio;
  });

  const toggleMusic = () => {
    if (isPlaying) {
      audioObj.pause();
      setIsPlaying(false);
    } else {
      audioObj.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio play blocked:', err);
      });
    }
  };

  useEffect(() => {
    return () => {
      audioObj.pause();
    };
  }, [audioObj]);

  // Load local achievement scores on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem('trivia_cards_scores');
      if (stored) {
        setScoreList(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load score history:', e);
    }
  }, [gameState]);

  const handleConfirmCharacter = (characterIndex: number) => {
    setCharIndex(characterIndex);
    setGameState('map');
  };

  const handleSelectCountry = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedGrade('junior'); // default junior for internal question structures
    setGameState('loading');
  };

  const clearScores = () => {
    if (window.confirm('确认要清空目前积攒的所有荣耀徽章和历史答题成就吗？')) {
      localStorage.removeItem('trivia_cards_scores');
      setScoreList([]);
    }
  };

  const getSubjectIcon = (subj: Subject) => {
    switch (subj) {
      case 'culture': return 'Globe';
      case 'origin': return 'Compass';
      case 'festival': return 'Gift';
      case 'communication': return 'MessagesSquare';
      case 'general': return 'Sparkles';
    }
  };

  const getSubjectColor = (subj: Subject) => {
    switch (subj) {
      case 'culture': return 'text-sky-600 bg-sky-50 border-sky-200';
      case 'origin': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'festival': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'communication': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'general': return 'text-violet-600 bg-violet-50 border-violet-200';
    }
  };

  const getGradeText = (grade: GradeLevel) => {
    switch (grade) {
      case 'junior': return '一、二年级';
      case 'middle': return '三、四年级';
      case 'senior': return '五、六年级';
    }
  };

  return (
    <div id="main-applet-viewport" className="min-h-screen bg-slate-50 text-slate-700 font-sans flex flex-col justify-between">
      
      {/* Global Header Bar */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 md:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setGameState('intro')}>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/10 hover:rotate-6 transition-all duration-150">
              <LucideIcon name="Sparkles" size={18} />
            </div>
            <div>
              <span className="font-black text-slate-800 text-sm md:text-base tracking-tight block">
                英语知识卡牌对战
              </span>
              <span className="text-[10px] text-indigo-600 font-bold tracking-wider block uppercase -mt-0.5">
                ENGLISH TRIVIA CARD BATTLE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold hidden lg:inline mr-2">
              智慧使我们强大，勇敢使我们前行 ✨
            </span>
            
            {/* Ambient Background Music Controls */}
            <button
              onClick={toggleMusic}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
                isPlaying
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 shadow-sm animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-250 text-slate-600 border-slate-205'
              }`}
              title="播放/暂停 Moonlit Quiz Hall 背景音乐"
            >
              <LucideIcon name={isPlaying ? 'Music' : 'VolumeX'} size={13} className={isPlaying ? 'text-amber-600 animate-spin-slow' : 'text-slate-400'} />
              <span>{isPlaying ? '背景音乐：播放中' : '播放背景伴奏'}</span>
            </button>

            <a
              href="https://ai.studio/build"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-slate-100 border border-slate-200/60 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-all flex items-center gap-1"
            >
              <LucideIcon name="HelpCircle" size={13} />
              <span>帮助</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main dynamic game area */}
      <main className={`flex-1 w-full mx-auto transition-all duration-300 ${
        gameState === 'battle' ? 'max-w-none px-4 md:px-8 py-3' : 'max-w-7xl p-4 md:p-6'
      }`}>
        {gameState === 'startup' ? (
          <StartupPage
            onStartGame={() => setGameState('lore')}
            isPlayingMusic={isPlaying}
            onToggleMusic={toggleMusic}
          />
        ) : gameState === 'lore' ? (
          <LorePage
            onConfirmLore={() => setGameState('intro')}
            isPlayingMusic={isPlaying}
            onToggleMusic={toggleMusic}
          />
        ) : gameState === 'intro' ? (
          <div className="space-y-8">
            <GameIntro onConfirmCharacter={handleConfirmCharacter} initialCharacterIndex={charIndex} />

            {/* Achievement Board displayed below Intro panel */}
            <div id="honor-glory-section" className="max-w-4xl mx-auto px-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-150 pb-3.5 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-150 text-indigo-600 flex items-center justify-center shrink-0">
                      <LucideIcon name="Award" size={16} />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base">勋章与答题荣耀榜</h3>
                      <p className="text-[10px] text-slate-400">你战胜过的所有魔王及成就记录都会载入此榜哦！</p>
                    </div>
                  </div>
                  {scoreList.length > 0 && (
                    <button
                      id="clear-records-btn"
                      onClick={clearScores}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/50 py-1.5 px-3 rounded-lg border border-rose-200/40 cursor-pointer"
                    >
                      清空我的成绩
                    </button>
                  )}
                </div>

                {scoreList.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                    <LucideIcon name="ShieldAlert" size={32} className="text-slate-300 animate-pulse" />
                    <span>还没有收复并净化任何文化大陆。加油吧，文化勇士！</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {scoreList.slice().reverse().map((record, index) => {
                      const subjColor = getSubjectColor(record.subject);
                      const subjIcon = getSubjectIcon(record.subject);

                      const getSubjectCHName = (sub: string) => {
                        switch (sub) {
                          case 'culture': return 'USA LAND 美国';
                          case 'origin': return 'UK KINGDOM 英国';
                          case 'festival': return 'CANADA LAND 加拿大';
                          case 'communication': return 'AUSTRALIA 澳大利亚';
                          default: return 'NEW ZEALAND 新西兰';
                        }
                      };

                      return (
                        <div
                          key={index}
                          id={`honor-badge-${index}`}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between items-start cursor-default shadow-sm hover:translate-y-[-2px] transition-all"
                        >
                          <div className="flex items-center justify-between w-full mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${subjColor}`}>
                              <LucideIcon name={subjIcon} size={10} />
                              {getSubjectCHName(record.subject)}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{record.date}</span>
                          </div>

                          <span className="font-black text-slate-800 text-sm">
                            🏆 成功净化：{getSubjectCHName(record.subject)}
                          </span>

                          <div className="mt-2.5 flex flex-col gap-1 w-full text-[11px] text-slate-500 bg-white border border-slate-100 p-1.5 rounded-lg">
                            <div className="flex justify-between items-center w-full">
                              <span>勇士: <strong className="text-slate-700">{record.character.split(' ')[0]}</strong></span>
                              <span>正确率: <strong className="text-emerald-600 font-extrabold">{record.accuracy}%</strong></span>
                            </div>
                            {typeof record.expEarned === 'number' && !isNaN(record.expEarned) && (
                              <div className="flex justify-between items-center w-full pt-1 border-t border-dashed border-slate-100">
                                <span className="text-slate-400">通关经验:</span>
                                <strong className="text-amber-500 font-black flex items-center gap-0.5">
                                  <LucideIcon name="Award" size={11} className="inline text-amber-500 fill-amber-500/10" />
                                  +{record.expEarned} EXP
                                </strong>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : gameState === 'map' ? (
          <WorldMap
            characterIndex={charIndex}
            scoreHistory={scoreList}
            onSelectCountry={handleSelectCountry}
            onChangeHero={() => setGameState('intro')}
          />
        ) : gameState === 'loading' ? (
          <LoadingPage
            gradeLevel={selectedGrade}
            subject={selectedSubject}
            characterIndex={charIndex}
            onLoadingComplete={() => setGameState('battle')}
          />
        ) : (
          <BattleZone
            gradeLevel={selectedGrade}
            subject={selectedSubject}
            characterIndex={charIndex}
            onExitGame={() => setGameState('map')}
          />
        )}
      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-slate-150 py-3 text-center text-[11px] text-slate-400 font-medium">
        <p>CULTURE WARRIOR · 文化勇士奇袭录 &copy; 2026. 答对地道英语常识，充能释放神奇动作卡牌，扫清误解与傲慢！</p>
      </footer>
    </div>
  );
}
