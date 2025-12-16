import { Poem } from './types';

export const INITIAL_POEMS: Poem[] = [
  {
    id: '1',
    title: '山居秋暝',
    dynasty: '唐',
    author: '王维',
    content: [
      '空山新雨后，天气晚来秋。',
      '明月松间照，清泉石上流。',
      '竹喧归浣女，莲动下渔舟。',
      '随意春芳歇，王孙自可留。'
    ],
    tags: ['山水', '秋天', '隐居']
  },
  {
    id: '2',
    title: '静夜思',
    dynasty: '唐',
    author: '李白',
    content: [
      '床前明月光，疑是地上霜。',
      '举头望明月，低头思故乡。'
    ],
    tags: ['思乡', '月亮']
  },
  {
    id: '3',
    title: '如梦令·昨夜雨疏风骤',
    dynasty: '宋',
    author: '李清照',
    content: [
      '昨夜雨疏风骤，浓睡不消残酒。',
      '试问卷帘人，却道海棠依旧。',
      '知否，知否？应是绿肥红瘦。'
    ],
    tags: ['婉约', '伤春', '海棠']
  },
  {
    id: '4',
    title: '江雪',
    dynasty: '唐',
    author: '柳宗元',
    content: [
      '千山鸟飞绝，万径人踪灭。',
      '孤舟蓑笠翁，独钓寒江雪。'
    ],
    tags: ['冬景', '孤独', '山水']
  },
  {
    id: '5',
    title: '登鹳雀楼',
    dynasty: '唐',
    author: '王之涣',
    content: [
      '白日依山尽，黄河入海流。',
      '欲穷千里目，更上一层楼。'
    ],
    tags: ['哲理', '壮阔']
  }
];

export const IMAGE_STYLE_PROMPT = 
  "Traditional Chinese ink wash painting (Shui-mo), masterpiece, minimalist, negative space, calligraphy brush strokes, watercolor texture, ethereal atmosphere. No text, no signature.";
