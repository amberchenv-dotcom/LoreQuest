/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Boss {
  name: string;
  title: string;
  avatar: string; // Lucide icon name
  maxHp: number;
  attackValue: number; // Damage it inflicts per counter-strike
  dialogues: {
    start: string;
    hit: string;
    attack: string;
    defeat: string;
  };
  color: string; // tailwind class
  glow: string;
  imageUrl?: string;
}

export const BOSS_LIST: Boss[] = [
  {
    name: '词汇哥布林',
    title: 'LV1 词义捣蛋鬼',
    avatar: 'Smile', // Lucide icon name
    maxHp: 50,
    attackValue: 7,
    dialogues: {
      start: '“哔啵！我是词汇哥布林！英文单词的起源秘密都在我的脑子里，答错题的话，我的‘词意弹弓’可不客气哦！”',
      hit: '“哎哟！你居然知道三明治、汉堡 and 工资里食盐的起源！我的词汇防御罩碎了！”',
      attack: '“尝尝我的‘词义飞泥沙’！看你还分不分得清 goodbye 的本意！”',
      defeat: '“哇啊……原来礼貌告别与星期三的北欧神话你都了如指掌，我先撤退啦！”'
    },
    color: 'from-emerald-400 to-green-500',
    glow: 'shadow-emerald-250/50',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/Word%20Goblin%E5%8D%95%E8%AF%8D%E5%93%A5%E5%B8%83%E6%9E%97.png'
  },
  {
    name: '排队幽灵',
    title: 'LV2 礼仪审判员',
    avatar: 'Ghost',
    maxHp: 75,
    attackValue: 11,
    dialogues: {
      start: '“桀桀桀！我是排队幽灵。你懂不懂英美的日常礼仪？排队、给小费、登门拜访，答错的话就别想通过我的幽灵关卡！”',
      hit: '“啊！怎么可能，你竟然知道在英国排队、在美国给小费和做客在门口脱鞋的习惯！”',
      attack: '“幽灵震惊火球！感受不知晓跨国社交礼仪的尴尬惩罚吧！”',
      defeat: '“我被彻底净化了……你真是一位优雅得体、举止绅士的文化行者！”'
    },
    color: 'from-sky-400 to-indigo-500',
    glow: 'shadow-indigo-250/50',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/Queue%20Ghost%E6%8E%92%E9%98%9F%E5%B9%BD%E7%81%B5.png'
  },
  {
    name: '节日狂龙',
    title: 'LV3 庆典破坏者',
    avatar: 'Flame', // We can use 'Flame' as custom icon
    maxHp: 95,
    attackValue: 15,
    dialogues: {
      start: '“吼！我是节日狂龙！南瓜灯、烤火鸡和彩蛋我都最喜欢了！答不出节庆谜题，就承受我的节日焰火吧！”',
      hit: '“嗷！万圣节角色扮演与复活节彩蛋的来历全被你解密了！我的庆典护手碎了！”',
      attack: '“狂龙吐息！让乱穿万圣节服装、记错节目的冰雨浇灭你的战斗激情！”',
      defeat: '“呜……我的龙息熄灭了……其实，我也特别想和大家一起快快乐乐雕刻南瓜灯、装饰圣诞树呀……”'
    },
    color: 'from-rose-500 to-red-600',
    glow: 'shadow-rose-250/50',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/Festival%20Dragon%E8%8A%82%E6%97%A5%E5%B7%A8%E9%BE%99.png'
  },
  {
    name: '混沌魔王莫罗',
    title: 'LV4 终极混沌星主',
    avatar: 'Skull',
    maxHp: 125,
    attackValue: 20,
    dialogues: {
      start: '“无知的凡人！吾乃混沌魔王莫罗！所有的下午茶规矩、感恩心意与生日密码都被吾封印了！尝尝混沌的终焉力量吧！”',
      hit: '“呃啊！竟然能答对如此地道的英式下午茶配方和感恩节典故！难道你的文化修为超越了时间限制？！”',
      attack: '“终极混沌风暴！吞噬你所有的文化理解，带你走向偏见的深渊！”',
      defeat: '“不……吾跨越各大文化板块的偏见阴谋，竟被你的智慧彻底瓦解……世间，重回光明！”'
    },
    color: 'from-purple-600 to-violet-800',
    glow: 'shadow-purple-500/50',
    imageUrl: 'https://github.com/amberchenv-dotcom/gamepicture/blob/main/picture/Chaos%20Lord%20Moros%E6%B7%B7%E4%B8%96%E9%AD%94%E7%8E%8B%E8%8E%AB%E7%BD%97%E6%96%AF.png'
  }
];

export const getBossForSubject = (subject: string): Boss => {
  if (subject === 'origin') return BOSS_LIST[0]; // 词汇哥布林
  if (subject === 'communication') return BOSS_LIST[1]; // 排队幽灵
  if (subject === 'festival') return BOSS_LIST[2]; // 节日狂龙
  return BOSS_LIST[3]; // 'culture' and 'general' -> 混沌魔王莫罗
};
