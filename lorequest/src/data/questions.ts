/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types';

export const QUESTIONS: Question[] = [
  // ================= WORD GOBLIN (origin) =================
  {
    id: 'wg_1',
    subject: 'origin',
    gradeLevel: 'junior',
    questionText: "What is a 'sandwich' usually made of?",
    options: ['Meat between bread', 'Vegetables only', 'Fruit in milk', 'Rice and fish'],
    correctAnswerIndex: 0,
    explanation: "A sandwich is typically meat or filling between slices of bread. 三明治通常是夹在面包片之间的肉或馅料。"
  },
  {
    id: 'wg_2',
    subject: 'origin',
    gradeLevel: 'junior',
    questionText: "Which food is associated with the word 'burger'?",
    options: ['Rice', 'Beef patty in bread', 'Apple pie', 'Soup'],
    correctAnswerIndex: 1,
    explanation: "Burger comes from placing a beef patty in bread. 汉堡是通过将牛肉饼放入面包中而来的。"
  },
  {
    id: 'wg_3',
    subject: 'origin',
    gradeLevel: 'junior',
    questionText: "Which item represents 'salary' originally?",
    options: ['Water', 'Salt', 'Coin', 'Bread'],
    correctAnswerIndex: 1,
    explanation: "Salary originally referred to payment in salt in ancient times. 薪资最初指的是古代以盐支付的费用。"
  },
  {
    id: 'wg_4',
    subject: 'origin',
    gradeLevel: 'junior',
    questionText: "What is a 'goodbye' usually used for?",
    options: ['Starting a meeting', 'Asking a question', 'Saying farewell', 'Eating'],
    correctAnswerIndex: 2,
    explanation: "Goodbye is used to say farewell. “再见”用来表示告别。"
  },
  {
    id: 'wg_5',
    subject: 'origin',
    gradeLevel: 'junior',
    questionText: "What does 'Wednesday' represent in traditional naming?",
    options: ['Zeus Day', "Thor's Day", 'Mercury Day', "Odin's Day"],
    correctAnswerIndex: 3,
    explanation: "Wednesday is named after Odin in Norse mythology. 星期三的名字来源于北欧神话中的奥丁。"
  },

  // ================= FESTIVAL DRAGON (festival) =================
  {
    id: 'fd_1',
    subject: 'festival',
    gradeLevel: 'junior',
    questionText: "What is a typical activity for Halloween?",
    options: ['Exchanging gifts', 'Lighting fireworks', 'Carving pumpkins', 'Egg hunting'],
    correctAnswerIndex: 2,
    explanation: "Carving pumpkins is a primary Halloween activity. 把南瓜雕刻成南瓜灯是万圣节的主要活动。"
  },
  {
    id: 'fd_2',
    subject: 'festival',
    gradeLevel: 'junior',
    questionText: "What is usually eaten at Thanksgiving?",
    options: ['Turkey', 'Pizza', 'Sushi', 'Bread'],
    correctAnswerIndex: 0,
    explanation: "Turkey is the traditional Thanksgiving meal in the USA. 火鸡是美国传统的感恩节大餐。"
  },
  {
    id: 'fd_3',
    subject: 'festival',
    gradeLevel: 'junior',
    questionText: "What is often decorated at Christmas?",
    options: ['Christmas tree', 'Lanterns', 'Eggs', 'Pumpkin'],
    correctAnswerIndex: 0,
    explanation: "People decorate Christmas trees with ornaments. 人们用装饰品装饰圣诞树。"
  },
  {
    id: 'fd_4',
    subject: 'festival',
    gradeLevel: 'junior',
    questionText: "What item is associated with Easter?",
    options: ['Pumpkin', 'Candle', 'Turkey', 'Eggs'],
    correctAnswerIndex: 3,
    explanation: "Eggs are primary symbols of Easter, used in egg hunts. 彩蛋是复活节的主要象征，常用于寻找彩蛋游戏。"
  },
  {
    id: 'fd_5',
    subject: 'festival',
    gradeLevel: 'junior',
    questionText: "What do people wear for Halloween?",
    options: ['Sweaters', 'Costumes', 'Crowns', 'Uniforms'],
    correctAnswerIndex: 1,
    explanation: "Wearing costumes is the primary Halloween tradition. 角色扮演是万圣节的主要传统。"
  },

  // ================= QUEUE GHOST (communication) =================
  {
    id: 'qg_1',
    subject: 'communication',
    gradeLevel: 'junior',
    questionText: "How should you behave in a British queue?",
    options: ['Ignore', 'Push in line', 'Stand behind others', 'Shout'],
    correctAnswerIndex: 2,
    explanation: "Polite queuing is expected in Britain. 英国人礼貌排队是理所当然的。"
  },
  {
    id: 'qg_2',
    subject: 'communication',
    gradeLevel: 'junior',
    questionText: "What is polite when receiving a gift in America?",
    options: ['Ignore it', 'Hide it', 'Return it', 'Open it immediately and thank the giver'],
    correctAnswerIndex: 3,
    explanation: "Open the gift and thank the giver to show appreciation. 打开礼物，感谢送礼者以表达感激。"
  },
  {
    id: 'qg_3',
    subject: 'communication',
    gradeLevel: 'junior',
    questionText: "'Help yourself!' usually means:",
    options: ['Serve yourself', 'Sit down', 'Stop eating', 'Leave'],
    correctAnswerIndex: 0,
    explanation: "It invites you to take food or drinks freely. 它邀请你自由地拿食物或饮料。"
  },
  {
    id: 'qg_4',
    subject: 'communication',
    gradeLevel: 'junior',
    questionText: "Tipping in the US is:",
    options: ['Common', 'Forbidden', 'Rare', 'Optional everywhere'],
    correctAnswerIndex: 0,
    explanation: "Leaving a tip is standard in American restaurants. 在美国餐厅，给小费是常态。"
  },
  {
    id: 'qg_5',
    subject: 'communication',
    gradeLevel: 'junior',
    questionText: "When entering a British home, you should:",
    options: ['Remove shoes', 'Sit anywhere', 'Keep shoes on', 'Bring a gift'],
    correctAnswerIndex: 0,
    explanation: "Removing shoes is customary in many British homes. 脱鞋在许多英国人家中是惯例。"
  },

  // ================= CHAOS LORD MORO - CULTURE (culture) =================
  {
    id: 'clm_1',
    subject: 'culture',
    gradeLevel: 'junior',
    questionText: "What sweet item is commonly eaten at birthdays?",
    options: ['Pie', 'Candy', 'Cake', 'Bread'],
    correctAnswerIndex: 2,
    explanation: "Birthday cakes are a standard celebration item. 生日蛋糕是常见的庆祝用品。"
  },
  {
    id: 'clm_2',
    subject: 'culture',
    gradeLevel: 'junior',
    questionText: "What animal is often a symbol of Easter?",
    options: ['Lion', 'Cat', 'Rabbit', 'Dog'],
    correctAnswerIndex: 2,
    explanation: "Rabbits represent fertility and are Easter symbols. 兔子象征生育力，是复活节的象征。"
  },
  {
    id: 'clm_3',
    subject: 'culture',
    gradeLevel: 'junior',
    questionText: "When giving someone a gift in the US, what is polite?",
    options: ['Throw it', 'Wrap it nicely and present it', 'Hide it', 'Leave it on the floor'],
    correctAnswerIndex: 1,
    explanation: "Wrapping and presenting a gift shows respect and care. 包装和赠送礼物体现了尊重和关怀。"
  },
  {
    id: 'clm_4',
    subject: 'culture',
    gradeLevel: 'junior',
    questionText: "Which Christmas decoration is hung on walls or doors?",
    options: ['Candle', 'Wreath', 'Lantern', 'Flag'],
    correctAnswerIndex: 1,
    explanation: "Wreaths are traditional Christmas decorations. 花环是传统的圣诞装饰。"
  },
  {
    id: 'clm_5',
    subject: 'culture',
    gradeLevel: 'junior',
    questionText: "During Halloween, children say 'Trick or Treat' to:",
    options: ['Receive candy', 'Wish for gifts', 'Decorate pumpkins', 'Celebrate Easter'],
    correctAnswerIndex: 0,
    explanation: "Children use the phrase to request candy from neighbors. 孩子们用这个词向邻居请求糖果。"
  },

  // ================= CHAOS LORD MORO - GENERAL (general) =================
  {
    id: 'clm_6',
    subject: 'general',
    gradeLevel: 'junior',
    questionText: "Which drink is traditional for British afternoon tea?",
    options: ['Coffee', 'Black tea', 'Cola', 'Juice'],
    correctAnswerIndex: 1,
    explanation: "Black tea with milk is the classic afternoon tea drink. 加牛奶的红茶是经典的下午茶饮品。"
  },
  {
    id: 'clm_7',
    subject: 'general',
    gradeLevel: 'junior',
    questionText: "What is the main symbol of Christmas present placement?",
    options: ['Fireplace', 'Christmas tree', 'Window', 'Door'],
    correctAnswerIndex: 1,
    explanation: "Presents are traditionally placed under the Christmas tree. 礼物传统上会放在圣诞树下。"
  },
  {
    id: 'clm_8',
    subject: 'general',
    gradeLevel: 'junior',
    questionText: "For respectful cross-cultural communication, the key is:",
    options: ['Understanding and respect', 'Competing', 'Avoiding', 'Ignoring customs'],
    correctAnswerIndex: 0,
    explanation: "Understanding and respect are key in cross-cultural situations. 尊重和理解在跨文化环境中至关重要。"
  },
  {
    id: 'clm_9',
    subject: 'general',
    gradeLevel: 'junior',
    questionText: "Your British friend offers you tea. What does it usually mean?",
    options: ['An order', 'A warning', 'A friendly welcome', 'A test'],
    correctAnswerIndex: 2,
    explanation: "Offering tea is a gesture of hospitality. 奉茶是款待的表现。"
  },
  {
    id: 'clm_10',
    subject: 'general',
    gradeLevel: 'junior',
    questionText: "At a Thanksgiving dinner, what activity shows gratitude?",
    options: ['Singing', 'Saying what you are thankful for', 'Playing games', 'Exchanging gifts'],
    correctAnswerIndex: 1,
    explanation: "Expressing gratitude is central to Thanksgiving traditions. 表达感恩是感恩节传统的核心。"
  }
];

export const getQuestions = (gradeLevel: string, subject: string): Question[] => {
  return QUESTIONS.filter(q => q.subject === subject);
};
