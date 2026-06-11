/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Question, Character, BattleLog, GradeLevel, Subject, StatusEffect } from '../types';
import { CARD_LIBRARY, getRarityColor, getElementTheme, STARTER_DECK } from '../data/cards';
import { QUESTIONS } from '../data/questions';
import { BOSS_LIST, Boss, getBossForSubject } from '../data/bosses';
import { CHARACTERS, getRawImageUrl } from './GameIntro';
import LucideIcon from './LucideIcon';
import { playCorrectSound, playWrongSound, playCardSelectSound } from '../utils/audioHelper';

interface BattleZoneProps {
  gradeLevel: GradeLevel;
  subject: Subject;
  characterIndex: number;
  onExitGame: () => void;
}

export default function BattleZone({
  gradeLevel,
  subject,
  characterIndex,
  onExitGame
}: BattleZoneProps) {
  // Game Setup Configs
  const heroConfig = CHARACTERS[characterIndex];
  const subjectBosses = BOSS_LIST;

  const getBossIndexForSubject = (subj: Subject): number => {
    if (subj === 'origin') return 0;
    if (subj === 'communication') return 1;
    if (subj === 'festival') return 2;
    return 3; // culture / general
  };

  const initialBossIndex = getBossIndexForSubject(subject);
  const bossInit = BOSS_LIST[initialBossIndex] || BOSS_LIST[0];

  // States
  const [currentBossIndex, setCurrentBossIndex] = useState(initialBossIndex);
  const [activeBoss, setActiveBoss] = useState<Boss>(bossInit);

  // Dynamically filter questions by the active boss
  const getQuestionsForActiveBoss = (bossName: string): Question[] => {
    if (bossName === '排队幽灵') {
      return QUESTIONS.filter(q => q.subject === 'communication');
    } else if (bossName === '节日狂龙') {
      return QUESTIONS.filter(q => q.subject === 'festival');
    } else if (bossName === '混沌魔王莫罗') {
      return QUESTIONS.filter(q => q.subject === 'culture' || q.subject === 'general');
    }
    // Default or '词汇哥布林'
    return QUESTIONS.filter(q => q.subject === 'origin');
  };

  const questionsPool = getQuestionsForActiveBoss(activeBoss?.name || '词汇哥布林');

  // Characters State
  const [playerHp, setPlayerHp] = useState(50 + heroConfig.maxHpBonus);
  const [playerMaxHp] = useState(50 + heroConfig.maxHpBonus);
  const [playerShield, setPlayerShield] = useState(0);
  const [playerEffects, setPlayerEffects] = useState<StatusEffect[]>([]);

  const [bossHp, setBossHp] = useState(bossInit.maxHp);
  const [bossMaxHp, setBossMaxHp] = useState(bossInit.maxHp);

  // Deck & Combat Hand States
  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [energy, setEnergy] = useState(3);
  const [maxEnergy] = useState(3); // Standard 3 energy stars per turn
  const [turn, setTurn] = useState(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  // Active question state (Natively nested inside board card)
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // 30-Second Turn & Quiz Answering Phase Countdown Timer
  const [turnTimer, setTurnTimer] = useState<number>(30);

  // Visual effects state
  const [bossSpeech, setBossSpeech] = useState<string>('');
  const [playerSpeech, setPlayerSpeech] = useState<string>('');
  const [floatingText, setFloatingText] = useState<{ id: string; text: string; type: 'damage' | 'heal' | 'shield' | 'player'; isPlayer: boolean }[]>([]);
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([]);
  const [vibrateBoss, setVibrateBoss] = useState(false);
  const [bossImageError, setBossImageError] = useState(false);
  const [vibratePlayer, setVibratePlayer] = useState(false);
  const [attackFlash, setAttackFlash] = useState<'success' | 'failure' | null>(null);

  // RPG Onboarding Novice Guide Overlay States
  const [showNoviceGuide, setShowNoviceGuide] = useState(() => {
    try {
      return localStorage.getItem('culb_novice_battle_guide_completed') !== 'true';
    } catch {
      return true;
    }
  });
  const [guideStep, setGuideStep] = useState(0);

  // Instant Interactive Particles & Combo Popups for tactile kid feedback
  const [particles, setParticles] = useState<{ id: string; emoji: string; color: string; size: number; targetX: number; targetY: number; targetRotate: number }[]>([]);
  const [comboSplash, setComboSplash] = useState<{ count: number; text: string } | null>(null);

  const triggerParticles = (type: 'correct' | 'wrong' | 'combo') => {
    const count = type === 'combo' ? 24 : 12;
    const colors = type === 'correct' 
      ? ['#3b82f6', '#10b981', '#fbbf24', '#8b5cf6', '#ec4899'] 
      : type === 'combo'
      ? ['#f59e0b', '#ef4444', '#f43f5e', '#fbbf24', '#f97316']
      : ['#ef4444', '#94a3b8', '#64748b'];
    
    const emojis = type === 'correct' 
      ? ['⭐', '✨', '🌟', '🎉', '🌟'] 
      : type === 'combo'
      ? ['🔥', '💥', '⚡', '👑', '🏆']
      : ['❓', '❌', '🌪️', '💥'];

    const newParts = Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 150;
      return {
         id: `p_${Date.now()}_${Math.random()}`,
         emoji: emojis[Math.floor(Math.random() * emojis.length)],
         color: colors[Math.floor(Math.random() * colors.length)],
         size: 16 + Math.random() * 24,
         targetX: Math.cos(angle) * distance,
         targetY: Math.sin(angle) * distance - (30 + Math.random() * 50),
         targetRotate: (Math.random() - 0.5) * 360
      };
    });

    setParticles(newParts);
    setTimeout(() => {
      setParticles([]);
    }, 1300);
  };

  const triggerComboSplash = (count: number) => {
    if (count < 2) return;
    let phrase = '连对！超棒！';
    if (count === 2) phrase = '双连击 DOUBLE!';
    else if (count === 3) phrase = '天秀三连击 TRIPLE!';
    else if (count === 4) phrase = '智慧飞跃 ULTRA STREAK!';
    else if (count >= 5) phrase = '天下无敌 EXPERT SHINE! 🌟';

    setComboSplash({ count, text: phrase });
    setTimeout(() => {
      setComboSplash(null);
    }, 1300);
  };

  // Out-of-combat results
  const [battleOutcome, setBattleOutcome] = useState<'ongoing' | 'victory' | 'defeat'>('ongoing');
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);

  // Premium Character Passive States
  const [consecutiveCorrectCount, setConsecutiveCorrectCount] = useState<number>(0);
  const [knightShieldUses, setKnightShieldUses] = useState<number>(2);
  const [playerExp, setPlayerExp] = useState<number>(0);

  // Initialize Game on first launch & when Boss level shifts
  useEffect(() => {
    startNewBattle(currentBossIndex);
  }, [currentBossIndex]);

  const addBattleLog = (text: string, type: BattleLog['type']) => {
    const newLog: BattleLog = {
      id: `log_${Date.now()}_${Math.random()}`,
      text,
      type
    };
    setBattleLogs(prev => [newLog, ...prev].slice(0, 40)); // keep up to 40 logs
  };

  const triggerFloatingText = (text: string, type: 'damage' | 'heal' | 'shield' | 'player', isPlayer: boolean) => {
    const newFloat = {
      id: `float_${Date.now()}_${Math.random()}`,
      text,
      type,
      isPlayer
    };
    setFloatingText(prev => [...prev, newFloat]);
    setTimeout(() => {
      setFloatingText(prev => prev.filter(f => f.id !== newFloat.id));
    }, 1500);
  };

  const startNewBattle = (bossIdx: number) => {
    const targetBoss = subjectBosses[bossIdx] || subjectBosses[0];
    setActiveBoss(targetBoss);
    setBossImageError(false);
    setBossHp(targetBoss.maxHp);
    setBossMaxHp(targetBoss.maxHp);

    // Reset Hero health and combat session states (carry over maximum health configurations)
    setPlayerHp(playerMaxHp);
    setCorrectAnswersCount(0);
    setTotalQuestionsAnswered(0);
    setPlayerExp(0);
    setPlayerShield(heroConfig.shieldBonus || 0);
    setPlayerEffects([]);
    setConsecutiveCorrectCount(0);
    setKnightShieldUses(2);

    // Initialize Card Deck
    const rawDeck = [...STARTER_DECK];
    const shuffled = rawDeck.sort(() => Math.random() - 0.5);

    setDeck(shuffled.slice(4));
    setHand(shuffled.slice(0, 4));
    setDiscardPile([]);
    setEnergy(maxEnergy);
    setTurn(1);
    setIsPlayerTurn(true);
    setBattleOutcome('ongoing');
    setBossSpeech(targetBoss.dialogues.start);
    setPlayerSpeech('“准备大显身手咯，看我来解答魔王的难题！”');

    // Reset active question panel states
    setActiveCard(null);
    setActiveQuestion(null);
    setSelectedOption(null);
    setHasSubmitted(false);
    setTurnTimer(30);

    setBattleLogs([]);
    addBattleLog(`⚔️ 战斗开始：成功空降 ${subjectLabel(subject)}大陆！英勇迎战 [${targetBoss.name}] (${targetBoss.title})！`, 'system');
  };

  const subjectLabel = (sub: Subject) => {
    switch (sub) {
      case 'culture': return '英语国家文化';
      case 'origin': return '单词起源探秘';
      case 'festival': return '节日知识百科';
      case 'communication': return '跨文化交流';
      case 'general': return '地道英语常识';
    }
  };

  // Turn management: DRAW CARDS
  const drawCards = (count: number, currentDeck: Card[], currentDiscard: Card[]) => {
    let newDeck = [...currentDeck];
    let newDiscard = [...currentDiscard];
    let drawn: Card[] = [];

    for (let i = 0; i < count; i++) {
      if (newDeck.length === 0) {
        if (newDiscard.length === 0) {
          newDiscard = [...STARTER_DECK];
        }
        newDeck = [...newDiscard].sort(() => Math.random() - 0.5);
        newDiscard = [];
        addBattleLog('🔄 抽牌堆已空，进行洗牌重新装载！', 'system');
      }
      const nextCard = newDeck.pop();
      if (nextCard) {
        drawn.push(nextCard);
      }
    }

    return { drawn, remainingDeck: newDeck, remainingDiscard: newDiscard };
  };

  // CARD USAGE CLICK
  const handleCardClick = (card: Card) => {
    if (!isPlayerTurn || battleOutcome !== 'ongoing') return;

    if (energy < card.energyCost) {
      triggerFloatingText('星星能量不足！', 'player', true);
      setPlayerSpeech('“哎呀，我的魔法星星不太够释放这张卡牌呢...”');
      return;
    }

    // Pick a quiz question
    if (questionsPool.length === 0) {
      addBattleLog('⚠️ 题库中暂时没有该年级段或科目的题目！默认开启魔法直通车。', 'system');
      executeCardEffects(card, true);
      return;
    }

    // Filter available unused questions
    let availableQuestions = questionsPool.filter(q => !usedQuestionIds.includes(q.id));
    if (availableQuestions.length === 0) {
      setUsedQuestionIds([]);
      availableQuestions = questionsPool;
    }

    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    // Nest the state natively in parental component
    playCardSelectSound();
    setActiveCard(card);
    setActiveQuestion(randomQuestion);
    setSelectedOption(null);
    setHasSubmitted(false);
    setUsedQuestionIds(prev => [...prev, randomQuestion.id]);
    setTurnTimer(30);
  };

  // RESOLVING QUIZ RESULT
  const handleQuestionAnswer = (correct: boolean) => {
    if (!activeCard || !activeQuestion) return;

    // Increment answering statistics
    setTotalQuestionsAnswered(prev => prev + 1);

    let isCrit = false;
    let nextConsecutive = 0;

    if (correct) {
      playCorrectSound();
      setCorrectAnswersCount(prev => prev + 1);
      nextConsecutive = consecutiveCorrectCount + 1;
      setConsecutiveCorrectCount(nextConsecutive);

      // Trigger interactive feedback particles & splasher
      if (nextConsecutive >= 2) {
        triggerParticles('combo');
        triggerComboSplash(nextConsecutive);
      } else {
        triggerParticles('correct');
      }

      // Scholar Mage Skill: Knowledge Blast
      if (heroConfig.roleKey === 'scholar_mage' && nextConsecutive >= 3) {
        addBattleLog(`🔥 Scholar Mage 唤醒 [Knowledge Blast] 连击！当前连续答对 ${nextConsecutive} 题，卡牌动作伤害 ×1.5 爆发！`, 'buff');
      }

      // Ranger Explorer Skill: Lucky Guess (20% critical chance)
      if (heroConfig.roleKey === 'ranger_explorer' && Math.random() < 0.2) {
        isCrit = true;
        addBattleLog(`🏹 Ranger Explorer 触发地道直觉 [Lucky Guess] 暴击！获得 1.5 倍伤害提升！`, 'buff');
      }

      // Bard Skill: Combo Song (double XP on streak >= 2)
      let expAdd = 10;
      if (heroConfig.roleKey === 'bard') {
        if (nextConsecutive >= 2) {
          expAdd = 20;
          addBattleLog(`🎵 Bard 演奏 [Combo Song] 连唱：连续答对 ${nextConsecutive} 题，获得双倍经验 +20 EXP！`, 'buff');
        } else {
          addBattleLog(`🎵 Bard 答对，获得基础 +10 EXP！下一次连续答对即可翻倍！`, 'buff');
        }
      } else {
        addBattleLog(`💡 答对啦！获得 +10 知识经验！`, 'correct');
      }
      addBattleLog(`📖 【知识探讨 · 正确解答】问: "${activeQuestion.questionText}" ➔ 解析: ${activeQuestion.explanation}`, 'correct');
      setPlayerExp(prev => prev + expAdd);
      triggerFloatingText(`+${expAdd} EXP`, 'player', true);

    } else {
      // Wrong answer
      playWrongSound();
      setConsecutiveCorrectCount(0);
      triggerParticles('wrong');

      // Knight Warrior Skill: Shield of Wisdom (blocks penalty damage up to 2 times)
      if (heroConfig.roleKey === 'knight_warrior' && knightShieldUses > 0) {
        const nextUses = knightShieldUses - 1;
        setKnightShieldUses(nextUses);
        addBattleLog(`🛡️ Knight Warrior 的 [Shield of Wisdom] 亮起，吸收了 100% 魔法反噬伤害！(神圣护盾容量剩余: ${nextUses} 次)`, 'shield');
        triggerFloatingText('圣盾免伤', 'shield', true);
      } else {
        // Lose 5 HP penalty
        setPlayerHp(prev => {
          const nextHp = Math.max(0, prev - 5);
          if (nextHp === 0) {
            setBattleOutcome('defeat');
            setBossSpeech('“哈哈！这就是知识盲区的威力！”');
          }
          return nextHp;
        });
        addBattleLog(`💥 答错魔法反噬：受到了来自误解深渊 of 5 点生命损耗！`, 'damage_to_player');
        triggerFloatingText('-5 HP', 'damage', true);
      }
      addBattleLog(`❌ 【解惑纠偏 · 错误答录】问: "${activeQuestion.questionText}" ➔ 正确答案应为「${activeQuestion.options[activeQuestion.correctAnswerIndex]}」。解析纠偏: ${activeQuestion.explanation}`, 'wrong');
    }

    // Execute core battle card effects
    executeCardEffects(activeCard, correct, isCrit, nextConsecutive);
  };

  const executeCardEffects = (card: Card, correct: boolean, isCrit: boolean = false, currentConsecutive: number = 0) => {
    // Deduct turn energy point
    setEnergy(prev => Math.max(0, prev - card.energyCost));

    // Remove played card from hand, place into discard
    setHand(prev => prev.filter(c => c.id !== card.id));
    setDiscardPile(prev => [...prev, card]);

    if (correct) {
      // 1. Double Damage Buff Check
      let damageMultiplier = 1;
      const hasDoubleDmg = playerEffects.some(eff => eff.type === 'double_damage');
      if (hasDoubleDmg) {
        damageMultiplier = 2;
        setPlayerEffects(prev => prev.filter(eff => eff.type !== 'double_damage'));
        addBattleLog('🔥 触发 [爆攻倍化]，本发卡牌打出双倍威力炸裂！', 'buff');
      }

      // 2. Scholar Mage & Ranger Explorer Passives
      if (heroConfig.roleKey === 'scholar_mage' && currentConsecutive >= 3) {
        damageMultiplier *= 1.5;
      }
      if (heroConfig.roleKey === 'ranger_explorer' && isCrit) {
        damageMultiplier *= 1.5;
      }

      // 2. Playable Card Actions
      if (card.type === 'attack') {
        const dmg = card.value * damageMultiplier;
        setBossHp(prev => {
          const nextHp = Math.max(0, prev - dmg);
          if (nextHp === 0) {
            setBattleOutcome('victory');
            setBossSpeech(activeBoss.dialogues.defeat);
          }
          return nextHp;
        });
        setVibrateBoss(true);
        setTimeout(() => setVibrateBoss(false), 400);

        triggerFloatingText(`-${dmg} HP`, 'damage', false);
        setBossSpeech(activeBoss.dialogues.hit);
        addBattleLog(`🎉 成功！[${heroConfig.name}] 发动 [${card.name}] 痛击 [${activeBoss.name}] 造成了 ${dmg} 点伤害！`, 'damage_to_enemy');

        if (card.id === 'e_aurora_spin') {
          setPlayerShield(prev => prev + 8);
          triggerFloatingText('+8 护盾', 'shield', true);
          addBattleLog(`🛡️ [极光回旋极镖] 附赠福利：自动吸收星光为你生成了 8 点护盾！`, 'shield');
        }
      } 
      else if (card.type === 'shield') {
        const shieldVal = card.value;
        setPlayerShield(prev => prev + shieldVal);
        triggerFloatingText(`+${shieldVal} 盾`, 'shield', true);
        addBattleLog(`🛡️ 答对啦！[${heroConfig.name}] 召唤 [${card.name}] 获得了 ${shieldVal} 点魔法护盾！`, 'shield');
      } 
      else if (card.type === 'heal') {
        const healVal = card.value;
        setPlayerHp(prev => Math.min(playerMaxHp, prev + healVal));
        triggerFloatingText(`+${healVal} HP`, 'heal', true);
        addBattleLog(`❤️ 答对啦！[${heroConfig.name}] 释放 [${card.name}] 为自己回复了 ${healVal} 点生命！`, 'heal');
      } 
      else if (card.type === 'buff') {
        setPlayerEffects(prev => [...prev, { type: 'double_damage', duration: 1 }]);
        addBattleLog(`✨ 答对啦！[${card.name}] 增益开启：你的下一张攻击卡威力格档将提升一倍！`, 'buff');
      } 
      else if (card.type === 'drain') {
        const dmg = card.value;
        setBossHp(prev => {
          const nextHp = Math.max(0, prev - dmg);
          if (nextHp === 0) {
            setBattleOutcome('victory');
            setBossSpeech(activeBoss.dialogues.defeat);
          }
          return nextHp;
        });
        setPlayerHp(prev => Math.min(playerMaxHp, prev + dmg));
        setVibrateBoss(true);
        setTimeout(() => setVibrateBoss(false), 400);

        triggerFloatingText(`-${dmg} HP`, 'damage', false);
        triggerFloatingText(`+${dmg} HP`, 'heal', true);
        setBossSpeech(activeBoss.dialogues.hit);
        addBattleLog(`🦇 吸血奇袭！[${card.name}] 痛击对手 ${dmg} 点，同时为你回复 ${dmg} 点生命值！`, 'heal');
      }

      // Hero Passive: Happy Heal / Prayer
      if (heroConfig.healBonus > 0) {
        setPlayerHp(prev => Math.min(playerMaxHp, prev + heroConfig.healBonus));
        triggerFloatingText(`+${heroConfig.healBonus} 治疗被动`, 'heal', true);
        addBattleLog(`💖 [${heroConfig.name}] 被动圣能加持：触发额外回复了 ${heroConfig.healBonus} 点生命生命值！`, 'heal');
      }

      setPlayerSpeech('“完美！我的智慧在飞速燃烧，接招吧魔王！”');
    } else {
      addBattleLog(`❌ 答错啦！[${card.name}] 法术失控消散，未能产生攻击效果...`, 'wrong');
      triggerFloatingText('法术消散', 'player', true);
      setPlayerSpeech('“啊...这道题有些难，下一轮我一定聚精会神仔细计算！”');
      setBossSpeech('“哼哼！想用这种知识打败我？还要回去好好看书呀！”');
    }
  };

  // END TURN - TRIGGERS ENEMY BOSS ATTACK
  const handleEndTurn = () => {
    if (!isPlayerTurn || battleOutcome !== 'ongoing') return;

    setIsPlayerTurn(false);
    addBattleLog('🌙 玩家回合结束，进入魔王的反击时刻！', 'system');

    // Simulate Boss attacking action sequence
    setTimeout(() => {
      if (battleOutcome === 'victory') return;

      setBossSpeech(activeBoss.dialogues.attack);
      setVibratePlayer(true);
      setTimeout(() => setVibratePlayer(false), 400);

      // Resolve armor blocking health damage
      const rawBossDmg = activeBoss.attackValue;
      let actualDmgToHp = rawBossDmg;
      let updatedShield = playerShield;

      if (updatedShield > 0) {
        if (updatedShield >= rawBossDmg) {
          updatedShield -= rawBossDmg;
          actualDmgToHp = 0;
          addBattleLog(`🛡️ 你的星光护盾成功全部吸收！毫发未损格挡魔王的 ${rawBossDmg} 点强攻。`, 'shield');
        } else {
          actualDmgToHp = rawBossDmg - updatedShield;
          updatedShield = 0;
          addBattleLog(`💥 护盾被击碎！抵消部分伤害后受到了余下的 ${actualDmgToHp} 点物理冲击。`, 'damage_to_player');
        }
      } else {
        addBattleLog(`💥 呜哇！魔王发起冲击，使你受到了 ${rawBossDmg} 点直击生命伤害！`, 'damage_to_player');
      }

      setPlayerShield(updatedShield);
      setPlayerHp(prev => {
        const nextHp = Math.max(0, prev - actualDmgToHp);
        if (nextHp === 0) {
          setBattleOutcome('defeat');
        }
        return nextHp;
      });

      triggerFloatingText(`-${rawBossDmg} HP`, 'damage', true);

      // Start player's new turn after delay
      setTimeout(() => {
        if (playerHp - actualDmgToHp <= 0) return; // already dead

        // Draw fresh cards for next turn
        const newDiscard = [...discardPile, ...hand];
        const { drawn, remainingDeck, remainingDiscard } = drawCards(4, deck, newDiscard);

        setDeck(remainingDeck);
        setDiscardPile(remainingDiscard);
        setHand(drawn);

        // Turn counters
        setTurn(prev => prev + 1);
        setEnergy(maxEnergy);
        setTurnTimer(30);
        setIsPlayerTurn(true);

        // Reset speaking actions
        setBossSpeech('“继续出题！迎接你最后的对决时刻吧！”');
        setPlayerSpeech('“知识正是克敌制胜的最强法杖，放马过来！”');

        addBattleLog(`☀️ 回合 ${turn + 1} 开始！天空洒下金色星光，你回复了 3 星魔法值！`, 'system');

        // Passive check for Defense / Shield heroes
        if (heroConfig.shieldBonus > 0) {
          setPlayerShield(prev => prev + heroConfig.shieldBonus);
          triggerFloatingText(`+${heroConfig.shieldBonus} 被动盾`, 'shield', true);
          addBattleLog(`🛡️ [${heroConfig.name}] 职业高防被动：回合刚开始，圣光护手自动凝聚了 ${heroConfig.shieldBonus} 点防御星盾！`, 'shield');
        }

      }, 1500);

    }, 1200);
  };

  // Next Stage / Finish game win
  // Turn or Answering phase countdown timer ticking
  useEffect(() => {
    if (!isPlayerTurn || battleOutcome !== 'ongoing' || hasSubmitted) {
      return;
    }

    const ticker = setInterval(() => {
      setTurnTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(ticker);
  }, [isPlayerTurn, battleOutcome, hasSubmitted, activeCard]);

  // Handle what happens when timer hits 0
  useEffect(() => {
    if (isPlayerTurn && battleOutcome === 'ongoing' && !hasSubmitted && turnTimer === 0) {
      if (activeCard && activeQuestion) {
        setHasSubmitted(true);
        setSelectedOption(null);
        triggerFloatingText('时间到！', 'player', true);
        addBattleLog(`⏱️ 答题时间到！这张卡牌 [${activeCard.name}] 施法吟唱超时，未能形成攻击效果。`, 'wrong');
        
        setTimeout(() => {
          setAttackFlash('failure');
          handleQuestionAnswer(false);

          setActiveCard(null);
          setActiveQuestion(null);
          setSelectedOption(null);
          setHasSubmitted(false);
          setTurnTimer(30);

          setTimeout(() => {
            setAttackFlash(null);
          }, 1200);
        }, 1200);
      } else {
        triggerFloatingText('思考超时！', 'player', true);
        addBattleLog('⏱️ 思考回合时间到，魔王趁隙发起突袭！', 'system');
        handleEndTurn();
      }
    }
  }, [turnTimer, isPlayerTurn, battleOutcome, hasSubmitted, activeCard, activeQuestion]);

  const handleFinishBattle = () => {
    if (activeCard) setActiveCard(null);
    if (activeQuestion) setActiveQuestion(null);
    setSelectedOption(null);
    setHasSubmitted(false);

    const accuracy = Math.round((correctAnswersCount / Math.max(1, totalQuestionsAnswered)) * 100);
    const subjectMap: Record<number, Subject> = {
      0: 'origin',
      1: 'communication',
      2: 'festival',
      3: 'culture'
    };
    const currentSubject = subjectMap[currentBossIndex] || subject;

    const scoreRecord = {
      gradeLevel,
      subject: currentSubject,
      accuracy,
      character: heroConfig.name,
      date: new Date().toLocaleDateString(),
      expEarned: playerExp
    };
    const hist = JSON.parse(localStorage.getItem('trivia_cards_scores') || '[]');
    hist.push(scoreRecord);
    localStorage.setItem('trivia_cards_scores', JSON.stringify(hist));

    onExitGame();
  };

  return (
    <div id="battle-scene-wrapper" className="relative max-w-full mx-auto py-2 px-1 md:px-2 space-y-2">
      
      {/* RPG Onboarding Novice Guide Overlay */}
      <AnimatePresence>
        {showNoviceGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 rounded-3xl flex flex-col justify-center items-center p-4 text-white hover:cursor-default"
          >
            <div className="max-w-lg w-full bg-slate-900 border-2 border-amber-400 p-6 md:p-8 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-6 relative text-center">
              
              {/* Skip button in top right */}
              <button
                onClick={() => {
                  try {
                    localStorage.setItem('culb_novice_battle_guide_completed', 'true');
                  } catch (e) {}
                  setShowNoviceGuide(false);
                }}
                className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-white transition-all bg-white/5 py-1 px-2.5 rounded-full border border-white/10 hover:bg-white/10"
              >
                跳过引导
              </button>

              {/* Gold Crown / Sparkle badge */}
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <LucideIcon name="Sparkles" size={24} className="animate-pulse" />
              </div>

              {/* Dynamic steps text */}
              <AnimatePresence mode="wait">
                {guideStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <span className="text-amber-400 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                      第一步 · 了解城堡魔王
                    </span>
                    <h3 className="text-lg md:text-xl font-black text-slate-100 tracking-tight">
                      🏰 挑战神秘的城堡守卫
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                      右侧是各关城堡的守护魔王。关卡越高，魔王的血量和攻击力就越强大，答题时还会配合蓄力特殊技能，请格外当心防守！
                    </p>
                  </motion.div>
                )}

                {guideStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <span className="text-amber-400 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                      第二步 · 挑选卡牌、智慧答题
                    </span>
                    <h3 className="text-lg md:text-xl font-black text-slate-100 tracking-tight">
                      📖 挑选召唤你的魔法技能卡
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                      在下方区域挑选想打出的魔法卡牌！每张卡都蕴含雷电、烈火或流水等属性。点击卡牌后会弹出趣味文化常识题，答对即可点击【释放法术】痛击魔王！
                    </p>
                  </motion.div>
                )}

                {guideStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <span className="text-amber-400 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                      第三步 · 能量规划与连击机制
                    </span>
                    <h3 className="text-lg md:text-xl font-black text-slate-100 tracking-tight">
                      ⚡ 终极常识对战，策略制胜
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                      每张卡牌需要消耗左下方对应的<strong>星魔能</strong>。连续正确答对常识题会触发超炫的连击大招与双重粒子冲击特效，大幅提升爆发伤害！
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progression dot indicator */}
              <div className="flex justify-center items-center gap-2 pt-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === guideStep ? 'w-6 bg-amber-400' : 'w-2.5 bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* RPG buttons */}
              <div className="flex items-center justify-between pt-4 gap-4">
                {guideStep > 0 ? (
                  <button
                    onClick={() => setGuideStep(p => p - 1)}
                    className="py-2 px-5 bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    <LucideIcon name="ChevronLeft" size={12} />
                    <span>上一步</span>
                  </button>
                ) : (
                  <div className="w-1" />
                )}

                <button
                  onClick={() => {
                    if (guideStep < 2) {
                      setGuideStep(p => p + 1);
                    } else {
                      try {
                        localStorage.setItem('culb_novice_battle_guide_completed', 'true');
                      } catch (e) {}
                      setShowNoviceGuide(false);
                    }
                  }}
                  className="py-2.5 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 border border-amber-300 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <span>{guideStep === 2 ? '勇闯对战城堡！' : '下一步'}</span>
                  <LucideIcon name="ChevronRight" size={12} />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upper Navigation Bar - only keeping Left Back Button */}
      <div className="flex items-center justify-start py-0.5">
        <button
          id="quit-battle-btn"
          onClick={onExitGame}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-white shadow-sm cursor-pointer transition-all active:scale-95"
        >
          <LucideIcon name="ArrowLeft" size={14} className="text-slate-500" />
          <span>返回城堡大厅</span>
        </button>
      </div>

      {/* 1. IMMERSIVE cartoon staging arena backdrop (locked to glorious 16:9 aspect ratio to fit PC laptop/desktop screens perfectly) */}
      <div className="relative overflow-hidden w-full aspect-[16/9] min-h-[380px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[600px] xl:min-h-[660px] rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between p-3 sm:p-4 md:p-5 select-none text-white">
        
        {/* Battle Arena Background Image designed by User */}
        <img 
          src={getRawImageUrl("https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E6%B8%B8%E6%88%8F%E5%AF%B9%E6%88%98%E7%95%8C%E9%9D%A2%E8%83%8C%E6%99%AF.png")}
          onError={(e) => {
            const target = e.currentTarget;
            target.src = "https://raw.githubusercontent.com/amberchenv-dotcom/gamepicture/main/picture/%E6%B8%B8%E6%88%8F%E5%AF%B9%E6%88%98%E7%95%8C%E9%9D%A2%E8%83%8C%E6%99%AF.png";
          }}
          alt="Battle Arena Background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          referrerPolicy="no-referrer"
        />

        {/* Ambient atmospheric lighting over custom BG */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none z-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-56 bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent rounded-t-full border-t border-x border-indigo-400/5 pointer-events-none flex items-center justify-center overflow-hidden z-0">
          <div className="w-px h-full bg-indigo-500/5" />
          <div className="absolute w-full h-px bg-indigo-500/5" />
        </div>
        
        {/* Stained-Glass gothic windows background arches */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950/80 to-slate-950 opacity-90 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-56 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent rounded-t-full border-t-2 border-x-2 border-indigo-400/20 shadow-[0_0_40px_rgba(99,102,241,0.15)] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-px h-full bg-indigo-500/10" />
          <div className="absolute w-full h-px bg-indigo-505/10" />
        </div>

        {/* Real-time interactive Particles and Combo Splash Overlay */}
        <div className="absolute inset-0 pointer-events-none z-30 select-none flex items-center justify-center overflow-hidden">
          {/* Sparkly interactive target system particles */}
          <AnimatePresence>
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 0.1, x: 0, y: 0, rotate: 0 }}
                animate={{ 
                  opacity: [1, 1, 0.8, 0], 
                  scale: [0.3, 1.4, 1.2, 0.2], 
                  x: p.targetX, 
                  y: p.targetY, 
                  rotate: p.targetRotate 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="absolute text-2xl font-bold flex items-center justify-center filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                style={{ fontSize: `${p.size}px`, color: p.color }}
              >
                {p.emoji || '⭐'}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Epic burning 3D combo card pop-up splash */}
          <AnimatePresence>
            {comboSplash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.2, rotate: -15, y: -20 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.3, 1, 0.8],
                  rotate: [-15, 5, -2, 10],
                  y: [10, -10, -5, -45]
                }}
                exit={{ opacity: 0, scale: 0.5, y: -60 }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
                className="absolute bg-slate-950/80 backdrop-blur-md border-2 border-amber-400 py-3 px-6 rounded-3xl shadow-[0_0_35px_rgba(251,191,36,0.5)] text-center flex flex-col items-center gap-1 z-35 max-w-xs pointer-events-none"
              >
                <div className="flex items-center gap-1.5 justify-center">
                  <motion.span 
                    animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-3xl"
                  >
                    🔥
                  </motion.span>
                  <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-450 to-yellow-300 tracking-wider uppercase filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.5)]">
                    {comboSplash.count} COMBO!
                  </span>
                </div>
                <div className="text-[11px] md:text-xs font-black text-amber-200 tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/20 leading-tight">
                  {comboSplash.text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animated full stage Success Attack Effect Overlay */}
        {attackFlash === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.4, 0.8, 0] }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-cyan-400/40 to-indigo-500/10 mix-blend-screen pointer-events-none z-30 flex items-center justify-between px-10"
          >
            {/* Swirling projectile beam representing magical launch from player to boss */}
            <motion.div
              initial={{ x: '10%', scale: 0.2, opacity: 0 }}
              animate={{ x: '650%', scale: [0.8, 2, 0.5], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.95, ease: 'easeInOut' }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 via-amber-300 to-white shadow-[0_0_25px_rgba(34,211,238,0.8)] flex items-center justify-center"
            >
              <LucideIcon name="Sparkles" size={16} className="text-white animate-spin" />
            </motion.div>
            
            {/* Impact explosion at boss location */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: [0.4, 2.5, 3.2, 0], opacity: [0, 1, 1, 0] }}
              transition={{ delay: 0.45, duration: 0.65 }}
              className="absolute right-[16%] sm:right-[22%] w-12 h-12 rounded-full border-4 border-amber-400 bg-amber-400/30 shadow-[0_0_40px_rgb(251,191,36)] flex items-center justify-center"
            >
              <LucideIcon name="Swords" size={18} className="text-white animate-bounce-slow" />
            </motion.div>
          </motion.div>
        )}

        {/* Animated full stage Failure Counter-Impact Overlay */}
        {attackFlash === 'failure' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.95, 0.3, 0.85, 0] }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute inset-0 bg-red-950/40 mix-blend-color-burn pointer-events-none z-30 flex items-center justify-center"
          >
            {/* Shaking dark shadow ball projecting rebound from boss to player */}
            <motion.div
              initial={{ x: '120%', scale: 0.3, opacity: 0 }}
              animate={{ x: '-160%', scale: [0.8, 2, 0.5], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.95, ease: 'easeInOut' }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-600 to-slate-950 shadow-[0_0_25px_rgba(220,38,38,0.9)] flex items-center justify-center absolute right-[25%]"
            >
              <LucideIcon name="Activity" size={16} className="text-white animate-pulse" />
            </motion.div>

            {/* Impact explosion and crack indicator on Player avatar */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.5, 2.6, 3, 0], opacity: [0, 1, 1, 0] }}
              transition={{ delay: 0.45, duration: 0.65 }}
              className="absolute left-[16%] sm:left-[22%] w-12 h-12 rounded-full border-4 border-red-500 bg-red-600/40 shadow-[0_0_40px_rgb(239,68,68)] flex items-center justify-center"
            >
              <LucideIcon name="ShieldAlert" size={18} className="text-white font-extrabold" />
            </motion.div>
          </motion.div>
        )}

        {/* Torches / Candles on the wall */}
        <div className="absolute left-6 bottom-16 flex flex-col items-center opacity-70">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping absolute" />
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgb(245,158,11)]" />
          <div className="w-1.5 h-6 bg-gradient-to-b from-slate-700 to-slate-900 rounded-sm mt-0.5" />
        </div>
        <div className="absolute right-6 bottom-16 flex flex-col items-center opacity-70">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping absolute" />
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgb(245,158,11)]" />
          <div className="w-1.5 h-6 bg-gradient-to-b from-slate-700 to-slate-900 rounded-sm mt-0.5" />
        </div>

        {/* Floating Combat Damage / Life Indicators */}
        <div className="absolute inset-0 pointer-events-none z-20 select-none">
          <AnimatePresence>
            {floatingText.map(f => {
              // Align precisely over respective character coordinates (player left, boss right)
              const offsetAlign = f.isPlayer ? "left-[15%] sm:left-[22%]" : "left-[65%] sm:left-[72%]";
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 190, scale: 0.8 }}
                  animate={{ opacity: 1, y: 35, scale: 1.3 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 1.2, type: "spring" }}
                  className={`absolute ${offsetAlign} transform -translate-x-1/2 font-black text-2xl md:text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${
                    f.type === 'damage' 
                      ? 'text-rose-500' 
                      : f.type === 'heal' 
                      ? 'text-emerald-500' 
                      : f.type === 'shield'
                      ? 'text-sky-400'
                      : 'text-amber-400'
                  }`}
                >
                  {f.text}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Top Floating HUD bar with real-time stats inside stage canvas */}
        <div className="flex justify-between items-start w-full relative z-10 px-2 sm:px-4">
          
          {/* Top-Left: Player status (Hearts and Energy bars matching reference mockup) */}
          <div className="bg-slate-950/50 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-amber-500/20 text-white shadow-lg space-y-1.5 w-[145px] sm:w-[175px]">
            {/* HP Hearts */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-200 font-black tracking-wider flex items-center gap-1">
                <LucideIcon name="Heart" size={10} className="text-rose-400 fill-rose-100" />
                生命体力
              </span>
              <span className="font-mono text-xs font-black text-rose-300">{playerHp}/{playerMaxHp}</span>
            </div>
            {/* Health pill bar matching the mockup */}
            <div className="relative w-full h-3.5 bg-slate-900 rounded-full border border-rose-500/25 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
              />
            </div>

            {/* Armor Shields indicator */}
            <div className="flex items-center justify-between pt-0.5 border-t border-white/5">
              <span className="text-[10px] text-slate-200 font-black tracking-wider flex items-center gap-1">
                <LucideIcon name="Shield" size={10} className="text-sky-400 fill-sky-400 animate-pulse" />
                吸收护盾
              </span>
              <span className="font-mono text-xs font-black text-sky-300">+{playerShield}</span>
            </div>
            <div className="flex gap-0.5 items-center h-4 bg-slate-950/20 rounded p-0.5">
              {playerShield === 0 ? (
                <div className="text-[9px] text-slate-400/80 italic pl-1 leading-none font-sans">无护盾防护</div>
              ) : (
                Array.from({ length: Math.min(5, Math.ceil(playerShield / 5)) }).map((_, i) => (
                  <span key={i}>
                    <LucideIcon name="Shield" size={11} className="text-sky-400 fill-sky-450 animate-pulse" />
                  </span>
                ))
              )}
            </div>

            {/* Lightning star points progress bar */}
            <div className="pt-0.5 border-t border-white/5 space-y-0.5">
              <div className="flex justify-between items-center text-[10px] text-slate-200 font-semibold font-sans">
                <span className="flex items-center gap-1">
                  <LucideIcon name="Zap" size={10} className="text-amber-400 fill-amber-400 animate-bounce" />
                  可用魔晶
                </span>
                <span className="font-mono text-[9px] font-bold">{energy}/{maxEnergy} 星</span>
              </div>
              <div className="w-full bg-slate-950/40 h-1.5 rounded-full overflow-hidden border border-white/5 relative p-px">
                <div
                  className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(energy / maxEnergy) * 100}%` }}
                />
              </div>
            </div>

            {/* Character Passive Status Panel */}
            <div className="pt-1.5 border-t border-white/5 space-y-1 text-[9px] text-slate-350">
              <div className="flex justify-between items-center animate-pulse">
                <span className="flex items-center gap-1 text-slate-305 font-medium font-sans">
                  <LucideIcon name="Award" size={9} className="text-yellow-400 fill-yellow-400/20" />
                  通关经验
                </span>
                <span className="font-mono text-yellow-300">{playerExp} EXP</span>
              </div>
              
              {consecutiveCorrectCount > 0 && (
                <div className="flex justify-between items-center animate-pulse">
                  <span className="flex items-center gap-1 text-orange-400 font-bold font-sans">
                    <LucideIcon name="Flame" size={9} className="fill-orange-500 text-orange-400" />
                    答题连击
                  </span>
                  <span className="font-mono font-[#fcd34d] font-black">{consecutiveCorrectCount} 连</span>
                </div>
              )}

              {heroConfig.roleKey === 'knight_warrior' && (
                <div className="flex justify-between items-center font-sans">
                  <span className="flex items-center gap-1 text-blue-300 font-bold">
                    <LucideIcon name="ShieldCheck" size={9} className="text-blue-400 fill-blue-400/15" />
                    圣盾免伤
                  </span>
                  <span className="font-mono font-black text-blue-300">{knightShieldUses}/2 次</span>
                </div>
              )}
            </div>
          </div>

          {/* Top-Center: Middle turn widget - Chained pocket watch timer */}
          <div className="flex flex-col items-center relative -top-3 z-30">
            {/* Gold double hanging chains */}
            <div className="flex gap-2 justify-center -mb-1">
              <div className="w-0.5 h-6 bg-gradient-to-b from-slate-400 via-amber-450 to-amber-600" />
              <div className="w-0.5 h-6 bg-gradient-to-b from-slate-400 via-amber-450 to-amber-600" />
            </div>
            
            {/* Watch main body */}
            <div className="relative flex items-center justify-center">
              {/* Left and Right Golden Wings/Stars */}
              <div className="absolute -left-3 animate-pulse text-amber-400 opacity-80">
                <LucideIcon name="Sparkles" size={12} className="rotate-45" />
              </div>
              <div className="absolute -right-3 animate-pulse text-amber-400 opacity-80">
                <LucideIcon name="Sparkles" size={12} className="-rotate-45" />
              </div>
              
              {/* Pocket Watch Inner Circle with Dynamic Tension Scale Pulsing and Glowing Red Ring when under 10s */}
              <motion.div 
                animate={turnTimer <= 10 && isPlayerTurn ? {
                  scale: [1, 1.15, 1],
                  borderColor: ['#f59e0b', '#ef4444', '#f59e0b'],
                  boxShadow: ['0 4px 12px rgba(245,158,11,0.5)', '0 4px 24px rgba(239,68,68,0.85)', '0 4px 12px rgba(245,158,11,0.5)']
                } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
                className={`w-14 h-14 rounded-full border-4 p-0.5 shadow-md flex items-center justify-center transition-all duration-300 ${
                  turnTimer <= 10 && isPlayerTurn
                    ? 'border-red-500 bg-gradient-to-b from-red-500 via-rose-600 to-red-700'
                    : 'border-amber-500 bg-gradient-to-b from-amber-300 via-amber-450 to-amber-600'
                }`}
              >
                {/* Watch face container */}
                <div className={`w-full h-full rounded-full flex flex-col items-center justify-center font-black relative transition-colors duration-300 ${
                  turnTimer <= 10 && isPlayerTurn
                    ? 'bg-gradient-to-b from-red-50 to-red-100 text-red-950'
                    : 'bg-gradient-to-b from-amber-50 to-amber-100 text-amber-955'
                }`}>
                  {/* Top ring loop */}
                  <div className="absolute -top-3 w-3 h-2.5 border-2 border-amber-500 rounded-full" />
                  
                  {/* Countdown number text */}
                  <span className={`text-[13px] font-black tracking-tight leading-none ${
                    turnTimer <= 10 && isPlayerTurn ? 'text-red-650 animate-pulse' : 'text-amber-955'
                  }`}>
                    {isPlayerTurn ? `${turnTimer}s` : 'Zzz'}
                  </span>
                  <span className="text-[7px] font-bold opacity-75 tracking-wider leading-none mt-0.5">
                    {isPlayerTurn ? '倒计时' : '蓄力中'}
                  </span>
                </div>
              </motion.div>
            </div>
            
            {/* Round Turn Tag + Linear countdown bar underneath */}
            <div className="flex flex-col items-center gap-1 mt-1.5 w-full">
              <span className="text-[9px] font-black bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-400/30 text-slate-950 px-2.5 py-0.5 rounded-full shadow-sm">
                回合 {turn}
              </span>
              
              {/* Dynamic countdown visual progress track */}
              {isPlayerTurn && battleOutcome === 'ongoing' && (
                <div className="w-16 h-1 bg-slate-950/60 rounded-full border border-white/10 overflow-hidden shadow-inner flex relative">
                  <motion.div 
                    className={`h-full rounded-full ${
                      turnTimer <= 10 
                        ? 'bg-gradient-to-r from-red-500 to-rose-600 animate-pulse' 
                        : 'bg-gradient-to-r from-amber-400 to-yellow-300'
                    }`}
                    style={{ width: `${(turnTimer / 30) * 100}%` }}
                    animate={{ width: `${(turnTimer / 30) * 100}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Top-Right: Boss Health progress bar under activeBoss layout */}
          <div className="flex flex-col items-end w-[145px] sm:w-[175px]">
            <div className="bg-slate-950/50 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-purple-500/20 text-white shadow-lg space-y-1.5 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-300 truncate tracking-wide flex items-center gap-1 font-sans">
                  👾 {activeBoss.name}
                </span>
                <span className="text-[9px] font-black py-0.2 px-1.5 bg-rose-500/20 text-rose-200 border border-rose-500/30 rounded-full scale-90">
                  Lv.{currentBossIndex + 1}
                </span>
              </div>
              
              {/* Thick custom health progress bar matching boss hp style with icon */}
              <div className="relative w-full h-3.5 bg-slate-900 rounded-full border border-purple-500/25 overflow-hidden font-sans">
                <motion.div
                  animate={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 h-full rounded-full animate-pulse"
                />
              </div>
              <div className="flex justify-between items-center text-[9px] text-[#dac6e7] font-bold font-mono">
                <span>生命体力值</span>
                <span>{bossHp}/{bossMaxHp} HP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sprites Area representing characters on stage background (Left Player vs Middle Cards Hand vs Right Slime Boss) */}
        <div className="flex justify-between items-end w-full relative z-10 px-3 pb-5 gap-4 flex-1">
          
          {/* Player cartoon responsive display puppet */}
          <motion.div
            animate={vibratePlayer ? { x: [-8, 8, -6, 6, 0], y: [-2, 2, -2, 2, 0] } : {}}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-end md:origin-bottom relative md:w-1/4 gap-3 shrink-0"
          >
            {/* Floating dialog text - adjusted bottom distance for larger display sizing */}
            {playerSpeech && (
              <div className="absolute bottom-40 sm:bottom-52 md:bottom-68 lg:bottom-84 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-4 p-2 bg-white text-slate-800 text-[10px] md:text-xs rounded-2xl shadow-xl border border-slate-100 min-w-[120px] max-w-[150px] leading-snug font-bold animate-bounce-slow z-20">
                <p className="line-clamp-2 italic text-center md:text-left">{playerSpeech}</p>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-6 w-2 h-2 bg-white border-r border-b border-slate-100 transform rotate-45 translate-y-1" />
              </div>
            )}

            {/* Beautiful subtle cosmic shield glow aura (resized for scaled characters) */}
            {playerShield > 0 && (
              <div className="absolute w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-sky-500/10 border border-sky-450/40 animate-pulse pointer-events-none z-0 shadow-[0_0_25px_rgba(58,191,248,0.35)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            )}

            {/* Full-body standing representation - scaled up proportionally with the Boss */}
            <div className="relative h-[150px] sm:h-[205px] md:h-[280px] lg:h-[350px] w-[130px] sm:w-[180px] md:w-[240px] lg:w-[300px] flex items-end justify-center shrink-0">
              {/* Soft ground pedestal base shadow */}
              <div className="absolute bottom-0 w-[110px] sm:w-[150px] md:w-[200px] lg:w-[250px] h-3.5 sm:h-4 md:h-5 rounded-full bg-black/45 blur-md" />
              
              <div className="relative origin-bottom z-10 flex items-center justify-center">
                {heroConfig.imageUrl ? (
                  <img
                    src={getRawImageUrl(heroConfig.imageUrl)}
                    alt={heroConfig.name}
                    referrerPolicy="no-referrer"
                    className="max-h-[135px] sm:max-h-[185px] md:max-h-[255px] lg:max-h-[320px] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
                  />
                ) : (
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl ${heroConfig.color} border-4 border-amber-400 flex items-center justify-center text-white shadow-2xl`}>
                    <LucideIcon name={heroConfig.avatar} size={48} className="drop-shadow animate-pulse" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              {/* Star Badges */}
              <div className="flex gap-0.5 justify-center mt-1 scale-90 md:scale-100">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-amber-400 to-amber-500 border border-amber-300 flex items-center justify-center shadow-sm">
                    <LucideIcon name="Star" size={8} className="text-amber-955 fill-amber-955" />
                  </div>
                ))}
              </div>

              {/* Human Tag banner with hero name */}
              <span className="mt-1.5 text-[9px] md:text-[10px] font-black bg-indigo-950 border border-indigo-805 text-white py-0.5 px-2 rounded-full shadow leading-none">
                {heroConfig.name}
              </span>
            </div>
          </motion.div>

          {/* INNER CENTER COLUMN: CARDS HAND SELECTION DESK AREA (No Split screen, in the center of Hero & Monster!) */}
          <div className="flex-1 flex flex-col justify-end bg-black/60 p-2 text-slate-100 sm:p-3 md:p-4 rounded-2xl border border-amber-500/15 shadow-[inset_0_0_24px_rgba(0,0,0,0.9)] max-w-xl lg:max-w-3xl mx-auto w-full min-h-[200px] sm:min-h-[250px] md:min-h-[310px] lg:min-h-[365px] max-h-[220px] sm:max-h-[275px] md:max-h-[335px] lg:max-h-[395px]">
            <div className="flex flex-col px-1 border-b border-white/5 pb-1.5 mb-2 gap-1 bg-transparent">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-sm font-black text-amber-300 tracking-wider flex items-center gap-1 uppercase">
                  <LucideIcon name="Layers" size={11} className="text-amber-450 animate-pulse" />
                  挑选召唤卡牌 (点击直接答题)
                </span>
                <span className="text-[8px] md:text-[9px] text-slate-400 font-bold">
                  余张: {deck.length} | 废张: {discardPile.length}
                </span>
              </div>
              <p className="text-[9px] md:text-[10px] text-amber-100/70 leading-relaxed font-semibold">
                💡 智慧问答：选择手牌卡牌并回答文化常识题，答对将直接释放强力法术，痛击前方的城堡魔王！
              </p>
            </div>

            {battleOutcome === 'ongoing' ? (
              <div className="grid grid-cols-4 gap-1.5 md:gap-3 lg:gap-4">
                {hand.map((card, idx) => {
                  const rarityTheme = getRarityColor(card.rarity);
                  const elementTheme = getElementTheme(card.element);
                  const isAffordable = energy >= card.energyCost;

                  const getCardBgClass = (el: string) => {
                    switch(el) {
                      case 'fire':
                        return 'from-[#2e1111] to-[#1c0a0a] border-[#ef4444]/35 text-rose-100';
                      case 'water':
                        return 'from-[#0e1d2c] to-[#071018] border-[#3b82f6]/35 text-blue-100';
                      case 'thunder':
                        return 'from-[#1e102d] to-[#100818] border-[#8b5cf6]/35 text-purple-100';
                      case 'earth':
                        return 'from-[#251711] to-[#140c08] border-[#ea580c]/35 text-amber-100';
                      default:
                        return 'from-[#1e1d16] to-[#0f0e0b] border-[#eab308]/35 text-amber-100';
                    }
                  };

                  const cardBg = getCardBgClass(card.element);

                  return (
                    <motion.button
                      key={`${card.id}_${idx}`}
                      id={`hand-card-${card.id}-${idx}`}
                      disabled={!isPlayerTurn || battleOutcome !== 'ongoing'}
                      onClick={() => handleCardClick(card)}
                      whileHover={isPlayerTurn && isAffordable ? { y: -8, scale: 1.04 } : {}}
                      className={`border rounded-xl p-1 md:p-1.5 text-left transition-all relative overflow-hidden flex flex-col justify-between h-[120px] sm:h-[155px] md:h-[210px] lg:h-[260px] cursor-pointer bg-gradient-to-b ${cardBg} outline-none select-none group ${
                        !isPlayerTurn 
                          ? 'opacity-30 cursor-not-allowed border-slate-805' 
                          : isAffordable
                          ? 'shadow-[0_8px_16px_rgba(0,0,0,0.5)] hover:border-amber-450 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                          : 'border-slate-850 opacity-20 cursor-not-allowed'
                      }`}
                    >
                      {/* Custom Western Fantasy Card Border Background as a structural overlay */}
                      <img 
                        src={getRawImageUrl("https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E8%A5%BF%E5%B9%BB%E9%A3%8E%E6%A0%BC%E5%8D%A1%E7%89%8C%E8%BE%B9%E6%A1%86.png")}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = "https://raw.githubusercontent.com/amberchenv-dotcom/gamepicture/main/picture/%E8%A5%BF%E5%B9%BB%E9%A3%8E%E6%A0%BC%E5%8D%A1%E7%89%8C%E8%BE%B9%E6%A1%86.png";
                        }}
                        alt="Card Frame border"
                        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0 opacity-95 group-hover:opacity-100 transition-all mix-blend-normal"
                        referrerPolicy="no-referrer"
                      />

                      {/* Element Gem Bubble - exactly matching reference upper-left */}
                      <div className={`absolute top-0.5 left-0.5 sm:top-1 sm:left-1 md:top-2 md:left-2 w-4.5 sm:w-6.5 md:w-9 h-4.5 sm:h-6.5 md:h-9 rounded-full flex items-center justify-center border border-amber-400/80 shadow-[0_2px_5px_rgba(0,0,0,0.65),_inset_0_1px_2px_rgba(255,255,255,0.4)] z-20 ${
                        card.element === 'fire' ? 'bg-gradient-to-tr from-red-650 via-orange-500 to-amber-400' :
                        card.element === 'water' ? 'bg-gradient-to-tr from-blue-700 via-sky-500 to-cyan-300' :
                        card.element === 'thunder' ? 'bg-gradient-to-tr from-purple-700 via-indigo-500 to-pink-400' :
                        card.element === 'earth' ? 'bg-gradient-to-tr from-amber-800 via-yellow-700 to-amber-500' :
                        'bg-gradient-to-tr from-yellow-600 via-amber-400 to-yellow-250'
                      }`}>
                        <span className="text-[8.5px] sm:text-xs md:text-base font-black text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)] leading-none select-none">
                          {card.element === 'fire' ? '🔥' : card.element === 'water' ? '💧' : card.element === 'thunder' ? '⚡' : card.element === 'earth' ? '⛰️' : '☀️'}
                        </span>
                      </div>

                      {/* Cost value Energy Orb - top-right */}
                      <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 md:top-2 md:right-2 flex items-center justify-center w-4.5 sm:w-6.5 md:w-9 h-4.5 sm:h-6.5 md:h-9 rounded-full bg-gradient-to-b from-[#ffdf7e] via-[#eab308] to-[#9a3412] text-white font-bold sm:font-black text-[8px] sm:text-[11px] md:text-[13px] shadow-[0_2px_5px_rgba(0,0,0,0.7)] border border-amber-200 z-20">
                        {card.energyCost}
                      </div>

                      {/* Icon inside magical frame - fully transparent & integrated with card background */}
                      <div className="flex-1 flex items-center justify-center my-0.5 sm:my-1 md:my-1.5 relative z-10 w-full overflow-hidden select-none">
                        {card.imageUrl ? (
                          <div className="w-[52px] h-[52px] sm:w-[72px] sm:h-[72px] md:w-[105px] md:h-[105px] lg:w-[130px] lg:h-[130px] flex items-center justify-center transition-all duration-300 relative">
                            {/* Subtle elemental radial background glow to seamlessly blend and elevate the artwork */}
                            <div className={`absolute w-[44px] h-[44px] sm:w-[62px] sm:h-[62px] md:w-[92px] md:h-[92px] lg:w-[115px] lg:h-[115px] rounded-full filter blur-md opacity-45 scale-90 ${
                              card.element === 'fire' ? 'bg-orange-500/50' :
                              card.element === 'water' ? 'bg-cyan-500/50' :
                              card.element === 'earth' ? 'bg-amber-600/50' :
                              card.element === 'thunder' ? 'bg-yellow-400/50' : 'bg-purple-500/50'
                            }`} />
                            <img 
                              src={getRawImageUrl(card.imageUrl)}
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const fb = target.nextElementSibling as HTMLElement;
                                if (fb) fb.classList.remove('hidden');
                              }}
                              alt={card.name}
                              className="w-full h-full object-contain select-none pointer-events-none relative z-10 transition-transform duration-300 group-hover:scale-120 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]"
                              referrerPolicy="no-referrer"
                            />
                            {/* Fallback to Lucide icon if image fails to load */}
                            <div className="hidden w-12 h-12 rounded-full bg-slate-950/60 border border-white/10 flex items-center justify-center absolute inset-0 m-auto">
                              <LucideIcon name={card.iconName} size={24} className={`${elementTheme.iconColor} md:scale-125`} />
                            </div>
                          </div>
                        ) : (
                          <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-full bg-slate-950/65 border border-white/10 flex items-center justify-center text-amber-150 shadow-inner">
                            <LucideIcon name={card.iconName} size={20} className="md:scale-125" />
                          </div>
                        )}
                      </div>

                      {/* Name Ribbon/Banner - exactly matching reference purple ribbon in center */}
                      <div className="w-[110%] -left-[5%] text-center py-0.5 sm:py-1 md:py-1.5 my-0.5 sm:my-1 relative z-10 bg-gradient-to-r from-transparent via-[#250d40] to-transparent border-y border-amber-400/35 shadow-[0_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden">
                        {/* Decorative left/right gold diamond dots */}
                        <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-amber-450 rotate-45 mr-1 sm:mr-1.5 shadow-sm" />
                        <h4 className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] font-black text-[#ffeed3] heading-font tracking-wide md:tracking-widest leading-none drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)]">
                          {card.name}
                        </h4>
                        <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-amber-450 rotate-45 ml-1 sm:ml-1.5 shadow-sm" />
                      </div>

                      {/* Vintage Parchment Scroll Description Box - extremely styled exactly matching original design */}
                      <div className="w-full relative z-10 pt-0.5 px-0.5 pb-1 flex-shrink-0">
                        <div className="w-full min-h-[30px] sm:min-h-[40px] md:min-h-[55px] lg:min-h-[70px] p-0.5 sm:p-1 md:p-1 rounded-lg bg-gradient-to-b from-[#fdf7e7] to-[#ebd9b4] border sm:border-2 border-[#b08d46] shadow-[inset_0_1px_3px_rgba(40,20,0,0.15),_0_2px_4px_rgba(0,0,0,0.45)] flex flex-col items-center justify-center">
                          <p className="text-[#3c2303] font-black text-[7px] sm:text-[9px] md:text-[11px] lg:text-[13px] leading-snug tracking-wide text-center">
                            {card.description.split('，').map((chunk, cidx) => (
                              <span key={cidx} className="block mt-0.5 first:mt-0 font-extrabold select-none">
                                {chunk}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-slate-500 italic py-6 text-xs font-bold">战局比拼已终局结转</div>
            )}

            {/* Premium 16:9 console integrated action bar footer */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] md:text-sm font-black text-amber-300 bg-amber-950/60 py-1 px-2.5 border border-amber-500/30 rounded-xl flex items-center gap-1 shadow-inner">
                  <LucideIcon name="Zap" size={12} className="text-amber-450 fill-amber-400 animate-pulse" />
                  <span>星魔能: <strong className="text-white font-black">{energy}/{maxEnergy}</strong></span>
                </span>
                <span className="hidden sm:inline-block text-[9px] md:text-[11px] text-slate-300 font-bold bg-white/5 px-2 py-1 rounded-lg">
                  ⚡ 被动: {heroConfig.passive}
                </span>
              </div>
              
              <button
                id="integrated-end-turn-btn"
                disabled={!isPlayerTurn || battleOutcome !== 'ongoing'}
                onClick={handleEndTurn}
                className={`py-1 px-3 sm:px-4 rounded-xl font-black text-[10px] md:text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95 select-none ${
                  isPlayerTurn && battleOutcome === 'ongoing'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-550 text-slate-950 border border-amber-300 shadow-md'
                    : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>结束本回合</span>
                <LucideIcon name="ChevronRight" size={11} />
              </button>
            </div>
          </div>

          {/* Boss Slime/Rock puppet display */}
          <motion.div
            animate={vibrateBoss ? { x: [8, -8, 6, -6, 0], y: [2, -2, 2, -2, 0] } : {}}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-end md:origin-bottom relative md:w-1/4 gap-3 shrink-0"
          >
            {/* Dialog ballon - adjusted bottom positioning for larger characters */}
            {bossSpeech && (
              <div className="absolute bottom-48 sm:bottom-62 md:bottom-80 lg:bottom-100 right-1/2 translate-x-1/2 md:translate-x-0 md:right-4 p-2 bg-slate-900 border border-slate-800 text-rose-200 text-[10px] md:text-xs rounded-2xl shadow-xl min-w-[120px] max-w-[150px] leading-snug font-black animate-bounce-slow z-20">
                <p className="line-clamp-2 italic text-center md:text-left">{bossSpeech}</p>
                <div className="absolute bottom-0 right-1/2 translate-x-1/2 md:translate-x-0 md:right-6 w-2 h-2 bg-slate-900 border-r border-b border-slate-800 transform rotate-45 translate-y-1" />
              </div>
            )}

            {/* Glowing full-body representation without circular frames - scaled up proportionally to match Hero size, but slightly taller */}
            <div className="relative h-[185px] sm:h-[255px] md:h-[350px] lg:h-[435px] w-[130px] sm:w-[180px] md:w-[240px] lg:w-[300px] flex items-end justify-center shrink-0">
              {/* Soft ground pedestal base shadow */}
              <div className="absolute bottom-0 w-[112px] sm:w-[152px] md:w-[204px] lg:w-[255px] h-3.5 sm:h-4 md:h-5 rounded-full bg-black/45 blur-md" />

              {/* Magical glowing aura sphere behind boss */}
              <div className="absolute bottom-2 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-purple-550/20 blur-xl animate-pulse" />

              <div className="relative origin-bottom z-10 flex flex-col items-center justify-center">
                {activeBoss.imageUrl && !bossImageError ? (
                  <img
                    src={getRawImageUrl(activeBoss.imageUrl)}
                    alt={activeBoss.name}
                    referrerPolicy="no-referrer"
                    onError={() => {
                      setBossImageError(true);
                    }}
                    className="max-h-[175px] sm:max-h-[240px] md:max-h-[330px] lg:max-h-[415px] w-auto object-contain drop-shadow-[0_12px_24px_rgba(168,85,247,0.5)]"
                  />
                ) : (
                  <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#2d1b33]/60 to-slate-900/80 border-2 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.25)] flex items-center justify-center">
                    <LucideIcon name={activeBoss.avatar} size={56} className="text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] animate-pulse" />
                    <div className="absolute -top-1.5 -left-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white leading-none rounded-full px-1.5 py-0.5 text-[7px] border border-purple-400 font-black">
                      BOSS
                    </div>
                  </div>
                )}

                {/* Question bubble indicator sprite matching mockup */}
                <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 w-5.5 h-5.5 rounded-full border-2 border-white flex items-center justify-center font-black text-xs shadow-lg animate-bounce z-25">
                  ?
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              {/* Shield Badges */}
              <div className="flex gap-0.5 justify-center mt-1 scale-90 md:scale-100">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-3.5 h-3.5 rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center shadow-sm opacity-60">
                    <LucideIcon name="Shield" size={8} className="text-slate-100 fill-slate-100" />
                  </div>
                ))}
              </div>

              {/* Boss Base Name Tag */}
              <span className="mt-1.5 text-[9px] md:text-[10px] font-black bg-rose-955 border border-rose-805 text-rose-200 py-0.5 px-2 rounded-full shadow leading-none whitespace-nowrap">
                {activeBoss.name}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* WIN / LOSS OVERLAY MODALS & SPELL CASTING QUESTION MODAL OVERLAY */}
      <AnimatePresence>
        {activeCard && activeQuestion && (
          <motion.div
            id="spell-casting-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#06040cd0] backdrop-blur-md z-45 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white border-4 border-[#d4af37] rounded-3xl p-5 sm:p-6 md:p-7 max-w-2xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 sm:p-6 md:p-7 space-y-4 text-left relative my-auto min-h-[460px] md:min-h-[480px] flex flex-col justify-between"
            >
              
              {/* Active casting progress bar info */}
              <div className="flex items-center justify-between border-b border-[#e6cca3] pb-2 text-[10px] sm:text-xs text-[#8c6d3d] font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping inline-block shrink-0" />
                  <span className="text-[#8c6d3d] font-black uppercase tracking-wider">答题施法吟唱: [{activeCard.name}]</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5 ${
                    turnTimer <= 10 && !hasSubmitted
                      ? 'bg-rose-100 border border-rose-200 text-rose-750 animate-pulse'
                      : 'bg-[#f5ebd2] border border-[#e6cca3] text-[#6d4d1a]'
                  }`}>
                    <LucideIcon name="Clock" size={11} className={turnTimer <= 10 && !hasSubmitted ? 'animate-spin text-rose-600' : ''} />
                    <span>剩 {turnTimer} 秒</span>
                  </span>
                  <span className="hidden sm:inline-block">消耗魔晶: {activeCard.energyCost} 点 (拥有 {energy} 星)</span>
                </div>
              </div>

              {/* Parchment Scroll Main Body Container */}
              <div className="bg-gradient-to-b from-[#fffef5] via-[#fdf7e7] to-[#f4eac8] border-2 border-[#d4af37] rounded-3xl p-4 sm:p-6 md:p-7 shadow-[0_15px_30px_rgba(0,0,0,0.1),_inset_0_0_20px_rgba(139,92,26,0.08)] relative overflow-hidden flex-1 flex flex-col justify-between">
                
                {/* Dynamic visual countdown track for answering pressure spanning across the parchment header */}
                {!hasSubmitted && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#e6cca3]/35 overflow-hidden">
                    <motion.div 
                      className={`h-full ${
                        turnTimer <= 10 
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 animate-pulse' 
                          : 'bg-gradient-to-r from-amber-400 to-yellow-500'
                      }`}
                      initial={{ width: '100%' }}
                      animate={{ width: `${(turnTimer / 30) * 100}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                )}

                {/* Decorative glossy gold corner stars */}
                <div className="absolute -top-1 -left-1 w-5 h-5 rounded-br-xl border-b border-r border-[#d4af37]/40 flex items-center justify-center bg-amber-100/60">
                  <LucideIcon name="Star" size={8} className="fill-amber-500 text-amber-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-bl-xl border-b border-l border-[#d4af37]/40 flex items-center justify-center bg-amber-100/60">
                  <LucideIcon name="Star" size={8} className="fill-amber-500 text-amber-500" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-tr-xl border-t border-r border-[#d4af37]/40 flex items-center justify-center bg-amber-100/60">
                  <LucideIcon name="Star" size={8} className="fill-amber-500 text-amber-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-tl-xl border-t border-l border-[#d4af37]/40 flex items-center justify-center bg-amber-100/60">
                  <LucideIcon name="Star" size={8} className="fill-amber-500 text-amber-500" />
                </div>

                {/* Hanging magical star in top center of the parchment page */}
                <div className="flex justify-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-500 border border-white flex items-center justify-center shadow-md animate-pulse">
                    <LucideIcon name="Sparkles" size={14} className="text-white fill-white" />
                  </div>
                </div>

                {/* Highly structured central question body */}
                <div className="text-center py-1 px-1 mb-3">
                  <h2 className="text-sm sm:text-base md:text-lg font-black text-[#422e0e] leading-relaxed max-w-2xl mx-auto tracking-wide">
                    {activeQuestion.questionText}
                  </h2>
                </div>

                {/* Modern 2x2 Answer Choice button grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto w-full relative z-10">
                  {activeQuestion.options.map((option, index) => {
                    const optionChars = ['A', 'B', 'C', 'D'];
                    const isCorrectOption = index === activeQuestion.correctAnswerIndex;
                    const isSelectedOption = index === selectedOption;

                    let choiceBtnClass = 'border-[#e6cca3] hover:border-amber-500 hover:bg-[#fffbf0] bg-white/95 text-[#5c4015] font-bold shadow-sm';
                    let letterBadgeClass = 'bg-[#f7eed3] text-[#8c6d3d]';
                    let endingIcon = '';

                    if (hasSubmitted) {
                      if (isCorrectOption) {
                        choiceBtnClass = 'border-[#81b241] bg-[#abd864] text-[#193208] font-black shadow-md ring-2 ring-emerald-500/10 cursor-default scale-[1.01]';
                        letterBadgeClass = 'bg-emerald-750 text-white';
                        endingIcon = 'Check';
                      } else if (isSelectedOption) {
                        choiceBtnClass = 'border-[#cc4242] bg-[#f28e8e] text-[#420f0f] font-black shadow-md ring-2 ring-rose-500/10 cursor-default scale-[1.01]';
                        letterBadgeClass = 'bg-rose-755 text-white';
                        endingIcon = 'X';
                      } else {
                        choiceBtnClass = 'border-[#e6cca3]/30 bg-[#fbf8ee]/40 text-[#5c4015]/40 cursor-not-allowed opacity-50';
                        letterBadgeClass = 'bg-[#f7eed3]/50 text-[#8c6d3d]/50';
                      }
                    }

                    return (
                      <button
                        key={index}
                        id={`integrated-option-btn-${index}`}
                        disabled={hasSubmitted}
                        onClick={() => {
                          if (hasSubmitted) return;
                          setSelectedOption(index);
                          setHasSubmitted(true);
                          
                          const isCorrect = index === activeQuestion.correctAnswerIndex;
                          
                          // snappily returns to the main battle screen after 1.2s of feedback highlighting
                          setTimeout(() => {
                            setAttackFlash(isCorrect ? 'success' : 'failure');
                            handleQuestionAnswer(isCorrect);
                            
                            // Close modal and return directly to battle arena
                            setActiveCard(null);
                            setActiveQuestion(null);
                            setSelectedOption(null);
                            setHasSubmitted(false);
                            setTurnTimer(30);

                            setTimeout(() => {
                              setAttackFlash(null);
                            }, 1200);
                          }, 1200);
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 text-xs sm:text-sm transition-all duration-150 cursor-pointer ${choiceBtnClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg font-black flex items-center justify-center text-[10px] shrink-0 ${letterBadgeClass}`}>
                            {optionChars[index]}
                          </span>
                          <span className="leading-snug">{option}</span>
                        </div>
                        {endingIcon && (
                          <span className="shrink-0">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${endingIcon === 'Check' ? 'bg-[#5c8b25]' : 'bg-[#a32b2b]'}`}>
                              <LucideIcon 
                                name={endingIcon} 
                                className="text-white fill-none font-bold" 
                                size={11} 
                              />
                            </div>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation text sliding open post submission */}
              <AnimatePresence>
                {hasSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl border text-xs leading-relaxed max-w-3xl mx-auto ${
                      selectedOption === activeQuestion.correctAnswerIndex
                        ? 'bg-emerald-50/50 border-emerald-150 text-emerald-800'
                        : 'bg-indigo-50/50 border-indigo-150 text-indigo-800'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-semibold mb-0.5">
                      <LucideIcon name="GraduationCap" size={13} className="text-indigo-650" />
                      <span>智慧护手贴身护盾卡：</span>
                    </div>
                    <p className="font-medium">{activeQuestion.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Modal Footer actions with premium auto-cast loading indicator */}
              <div className="flex items-center justify-between pt-4 border-t border-[#e6cca3] text-[11px] font-bold">
                <span className="text-[#8c6d3d]">
                  {hasSubmitted ? "✨ 施法反馈：系统正在结算攻击并载入攻击特效..." : "💡 魔法法则：只要答对即可 100% 破除防御攻击魔王！"}
                </span>

                {hasSubmitted && (
                  <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 border border-indigo-150 px-3.5 py-1.5 rounded-xl">
                    <LucideIcon name="RefreshCw" size={12} className="animate-spin text-indigo-600" />
                    <span className="font-sans text-[11px] font-black uppercase text-indigo-800">正在返回战场...</span>
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}

        {battleOutcome !== 'ongoing' && (
          <motion.div
            id="battle-outcome-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white border rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl space-y-5"
            >
              {battleOutcome === 'victory' ? (
                <>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                    <LucideIcon name="Trophy" size={28} className="animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-emerald-800">
                      对决胜利：大获全胜！
                    </h2>
                    <span className="text-xs font-semibold text-slate-500 block mt-1">
                      成功净化城堡魔王: {activeBoss.name} ({activeBoss.title})
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-4 border border-slate-100 rounded-2xl leading-relaxed font-semibold">
                    🎉 真棒！你凭借极高的头脑算力和跨文化知识储备，用智慧彻底净化了魔王的心智，让它重燃对文明交流的热切期盼！
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-100 text-rose-600 border border-rose-200">
                    <LucideIcon name="HeartCrack" size={28} className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-rose-800">
                      答题过招失败...
                    </h2>
                    <span className="text-xs font-semibold text-slate-400 block mt-1">
                      你在与 {activeBoss.name} 的第 {turn} 回合壮烈退场了
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-4 border border-slate-100 rounded-2xl leading-relaxed font-semibold">
                    🌟 没关系的！知识需要反复磨砺！可以重新尝试这一关，或者挑选别的智慧门科继续特训哦。
                  </p>
                </>
              )}

              {/* Answering Stats metrics feedback */}
              <div className="grid grid-cols-2 gap-3 bg-indigo-50/50 rounded-2xl p-3 text-xs border border-indigo-100 font-bold">
                <div className="text-center border-r border-indigo-150">
                  <span className="text-slate-400 block pb-0.5">答题正确率</span>
                  <strong className="text-indigo-800 text-sm font-extrabold">
                    {totalQuestionsAnswered > 0 ? Math.round((correctAnswersCount / totalQuestionsAnswered) * 100) : 100}%
                  </strong>
                </div>
                <div className="text-center">
                  <span className="text-slate-400 block pb-0.5">作战回合数</span>
                  <strong className="text-indigo-800 text-sm font-extrabold">{turn} Rounds</strong>
                </div>
              </div>

              {/* Action options buttons */}
              <div className="flex flex-col gap-2 pt-1 font-bold">
                {battleOutcome === 'victory' ? (
                  <>
                    <button
                      id="victory-next-btn"
                      onClick={handleFinishBattle}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LucideIcon name="Award" size={14} />
                      <span>领取荣耀并返回大厅</span>
                    </button>
                    <button
                      onClick={() => startNewBattle(currentBossIndex)}
                      className="w-full py-2 border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                    >
                      <span>重新挑战当前魔王</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="defeat-retry-btn"
                      onClick={() => startNewBattle(currentBossIndex)}
                      className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LucideIcon name="RefreshCw" size={14} />
                      <span>回到本关重新对答</span>
                    </button>
                    <button
                      id="outcome-home-btn"
                      onClick={onExitGame}
                      className="w-full py-2 border border-slate-200 text-xs font-bold text-slate-500 rounded-xl hover:bg-slate-50 cursor-pointer"
                    >
                      返回城堡大厅 (选择其他魔王)
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
