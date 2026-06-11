/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card } from '../types';

export const CARD_LIBRARY: Card[] = [
  // --- COMMON CARDS (Cost: 1) ---
  {
    id: 'c_water_bubble',
    name: '水泡飞弹',
    type: 'attack',
    element: 'water',
    value: 8,
    energyCost: 1,
    description: '对敌人造成，8 点水系伤害',
    iconName: 'Droplet',
    rarity: 'common',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E6%B0%B4%E6%B3%A1%E9%A3%9E%E5%BC%B9.png'
  },
  {
    id: 'c_wood_shield',
    name: '小木盾',
    type: 'shield',
    element: 'earth',
    value: 6,
    energyCost: 1,
    description: '阻挡 6 点伤害',
    iconName: 'Shield',
    rarity: 'common',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E5%B0%8F%E6%9C%A8%E7%9B%BE.png'
  },
  {
    id: 'c_dandelion',
    name: '暖暖蒲公英',
    type: 'heal',
    element: 'holy',
    value: 5,
    energyCost: 1,
    description: '回复 5 点生命值',
    iconName: 'Heart',
    rarity: 'common',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E6%9A%96%E6%9A%96%E8%92%B2%E5%85%AC%E8%8B%B1.png'
  },
  {
    id: 'c_fire_spark',
    name: '火花术',
    type: 'attack',
    element: 'fire',
    value: 9,
    energyCost: 1,
    description: '对敌人造成，9 点火伤害',
    iconName: 'Flame',
    rarity: 'common',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E7%81%AB%E8%8A%B1%E6%9C%AF.png'
  },

  // --- RARE CARDS (Cost: 2) ---
  {
    id: 'r_fire_ball',
    name: '愤怒大火球',
    type: 'attack',
    element: 'fire',
    value: 16,
    energyCost: 2,
    description: '对敌人造成，16 点火焰伤害',
    iconName: 'Flame',
    rarity: 'rare',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E6%84%A4%E6%80%92%E5%A4%A7%E7%81%AB%E7%90%83.png'
  },
  {
    id: 'r_lightning',
    name: '雷击法杖',
    type: 'attack',
    element: 'thunder',
    value: 18,
    energyCost: 2,
    description: '引下一道闪电，对敌人造成，18 点雷击伤害',
    iconName: 'Zap',
    rarity: 'rare',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E9%9B%B7%E5%87%BB%E6%B3%95%E6%9D%96.png'
  },
  {
    id: 'r_iron_wall',
    name: '超能铁壁',
    type: 'shield',
    element: 'earth',
    value: 14,
    energyCost: 2,
    description: '获得 14 点护盾',
    iconName: 'ShieldAlert',
    rarity: 'rare',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/%E8%B6%85%E8%83%BD%E9%93%81%E5%A3%81.png'
  },
  {
    id: 'r_morning_dew',
    name: '晨曦露珠',
    type: 'heal',
    element: 'holy',
    value: 12,
    energyCost: 2,
    description: '汇聚晨光露珠，为自己治愈恢复 12 点生命值',
    iconName: 'Sparkles',
    rarity: 'rare'
  },

  // --- EPIC CARDS (Cost: 2-3) ---
  {
    id: 'e_double_spell',
    name: '爆攻法术书',
    type: 'buff',
    element: 'fire',
    value: 2, // Multiplier: x2
    energyCost: 1,
    description: '给双手附魔，使你下一张攻击卡伤害翻倍！',
    iconName: 'Swords',
    rarity: 'epic'
  },
  {
    id: 'e_lava_canon',
    name: '熔岩大钢炮',
    type: 'attack',
    element: 'fire',
    value: 26,
    energyCost: 3,
    description: '猛烈喷射炽热的岩浆流，给对手降下 26 点碎石伤害',
    iconName: 'CircleDot',
    rarity: 'epic'
  },
  {
    id: 'e_aurora_spin',
    name: '极光回旋标',
    type: 'attack', // deals damage and shields (handled key value check)
    element: 'water',
    value: 12,
    energyCost: 2,
    description: '掷出极光回旋镖，造成 12 点伤害，并额外赋予 8 点星光护盾',
    iconName: 'Orbit',
    rarity: 'epic'
  },
  {
    id: 'e_vampire_bat',
    name: '吸血蝙蝠',
    type: 'drain',
    element: 'thunder',
    value: 10,
    energyCost: 2,
    description: '召唤神秘小蝙蝠吸血：对魔王造成 10 点伤害，并同时为你回复 10 点血量',
    iconName: 'CloudRain',
    rarity: 'epic'
  },

  // --- LEGENDARY CARDS (Cost: 3-4) ---
  {
    id: 'l_solar_fury',
    name: '太阳神巨浪',
    type: 'attack',
    element: 'holy',
    value: 35,
    energyCost: 3,
    description: '汇聚最耀眼的太阳神力，轰击魔王造成 35 点毁灭性光辉伤害',
    iconName: 'Sun',
    rarity: 'legendary'
  },
  {
    id: 'l_infinite_shield',
    name: '万神圣壁',
    type: 'shield',
    element: 'holy',
    value: 22,
    energyCost: 3,
    description: '圣光降临！生成高达 22 点的极光防御壁障且坚不可摧',
    iconName: 'ShieldCheck',
    rarity: 'legendary'
  },
  {
    id: 'l_thunder_storm',
    name: '十万伏特暴雷',
    type: 'attack',
    element: 'thunder',
    value: 42,
    energyCost: 3,
    description: '召唤震天巨雷连击，对魔王轰出 42 点极限雷霆伤害',
    iconName: 'ZapOption',
    rarity: 'legendary'
  }
];

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return {
        bg: 'from-slate-100 to-slate-200 border-slate-300',
        text: 'text-slate-600',
        badge: 'bg-slate-500/10 text-slate-700 border-slate-300',
        glow: 'shadow-sm',
        accentBg: 'bg-slate-100'
      };
    case 'rare':
      return {
        bg: 'from-blue-50 to-blue-100 border-blue-300',
        text: 'text-blue-600',
        badge: 'bg-blue-500/10 text-blue-700 border-blue-300',
        glow: 'shadow-md shadow-blue-200/50',
        accentBg: 'bg-blue-50'
      };
    case 'epic':
      return {
        bg: 'from-purple-50 to-purple-100 border-purple-300 border-2',
        text: 'text-purple-600 font-semibold',
        badge: 'bg-purple-500/10 text-purple-700 border-purple-300',
        glow: 'shadow-lg shadow-purple-200/50',
        accentBg: 'bg-purple-50'
      };
    case 'legendary':
      return {
        bg: 'from-amber-50 to-amber-100 border-amber-400 border-2',
        text: 'text-amber-700 font-extrabold',
        badge: 'bg-amber-500/10 text-amber-800 border-amber-400 animate-pulse',
        glow: 'shadow-xl shadow-amber-200/60 ring-2 ring-amber-300/30 ring-offset-1',
        accentBg: 'bg-amber-50'
      };
    default:
      return {
        bg: 'from-slate-50 to-slate-100 border-slate-200',
        text: 'text-slate-600',
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        glow: 'shadow-sm',
        accentBg: 'bg-slate-100'
      };
  }
};

export const getElementTheme = (element: string) => {
  switch (element) {
    case 'fire':
      return {
        iconColor: 'text-red-500',
        borderColor: 'border-red-300',
        badgeBg: 'bg-red-50 text-red-600 border-red-200',
        gradient: 'from-red-500 to-orange-500'
      };
    case 'water':
      return {
        iconColor: 'text-sky-500',
        borderColor: 'border-sky-300',
        badgeBg: 'bg-sky-50 text-sky-600 border-sky-200',
        gradient: 'from-sky-500 to-blue-500'
      };
    case 'earth':
      return {
        iconColor: 'text-amber-700',
        borderColor: 'border-amber-400',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        gradient: 'from-amber-600 to-yellow-600'
      };
    case 'thunder':
      return {
        iconColor: 'text-yellow-500',
        borderColor: 'border-yellow-400',
        badgeBg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        gradient: 'from-yellow-400 to-amber-500'
      };
    case 'holy':
      return {
        iconColor: 'text-indigo-500',
        borderColor: 'border-indigo-300',
        badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        gradient: 'from-indigo-500 to-purple-500'
      };
    default:
      return {
        iconColor: 'text-slate-500',
        borderColor: 'border-slate-200',
        badgeBg: 'bg-slate-50 text-slate-600 border-slate-200',
        gradient: 'from-slate-500 to-slate-600'
      };
  }
};
export const STARTER_DECK: Card[] = [
  CARD_LIBRARY[0], // Water Bubble
  CARD_LIBRARY[1], // Wood Shield
  CARD_LIBRARY[2], // Dandelion
  CARD_LIBRARY[3], // Fire Spark
  CARD_LIBRARY[0], // Water Bubble (duplicate)
  CARD_LIBRARY[1], // Wood Shield (duplicate)
  CARD_LIBRARY[3], // Fire Spark (duplicate)
  CARD_LIBRARY[4], // Fireball (Rare)
  CARD_LIBRARY[5], // Lightning (Rare)
  CARD_LIBRARY[6], // Iron Barrier (Rare)
];
export const PREMIUM_CARDS: Card[] = CARD_LIBRARY;
