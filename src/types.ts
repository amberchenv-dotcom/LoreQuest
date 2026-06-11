/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Subject = 'culture' | 'origin' | 'festival' | 'communication' | 'general';
export type GradeLevel = 'junior' | 'middle' | 'senior'; // junior: 1-2, middle: 3-4, senior: 5-6

export interface Question {
  id: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export type CardType = 'attack' | 'shield' | 'heal' | 'buff' | 'drain';
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ElementType = 'fire' | 'water' | 'earth' | 'thunder' | 'holy';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  element: ElementType;
  value: number; // Damage amount, Shield amount, Heal amount, etc.
  energyCost: number;
  description: string;
  iconName: string; // Used to dynamic map to lucide icons
  rarity: CardRarity;
  imageUrl?: string;
}

export interface StatusEffect {
  type: 'double_damage' | 'stunned' | 'poisoned';
  duration: number; // in turns
}

export interface Character {
  name: string;
  hp: number;
  maxHp: number;
  shield: number;
  energy: number;
  maxEnergy: number;
  statusEffects: StatusEffect[];
  avatar: string; // Icon identifier
  imageUrl?: string; // Optional custom user illustration URL
  title?: string;
  maxHpInitial: number;
}

export interface BattleLog {
  id: string;
  text: string;
  type: 'damage_to_enemy' | 'damage_to_player' | 'shield' | 'heal' | 'buff' | 'correct' | 'wrong' | 'system';
}

export interface GameState {
  player: Character;
  enemy: Character;
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  energy: number;
  maxEnergy: number;
  turn: number;
  currentBattleIndex: number; // Which boss we are fighting
  activeQuestion: Question | null;
  activeCard: Card | null;
  isPlayerTurn: boolean;
  battleLogs: BattleLog[];
  battleOutcome: 'victory' | 'defeat' | 'ongoing';
  selectedGrade: GradeLevel;
  selectedSubject: Subject;
}
