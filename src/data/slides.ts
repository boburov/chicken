import type { Slide } from './types'

/**
 * All presentation content lives here. Text is transliterated to Uzbek Latin from the
 * printed brochure; every number is kept exactly as printed on its source page.
 * Edit this file to change copy, numbers or images — no component changes needed.
 */

const USD = 'mln AQSH dollar'
const USD_PL = 'mln AQSH dollari'

export const slides: Slide[] = [
  // ── 01 · Cover (brochure cover) ──────────────────────────────────────────
  {
    id: 'cover',
    navLabel: 'Muqova',
    kicker: 'Andijon viloyati',
    title: ['Baraka', 'hamkor parranda'],
    subtitle: 'oilaviy xususiy korxonasi',
    hero: [],
    strip: [],
    visual: 'cover',
    footnote: 'Korxona rahbari: Aliyev Shuhratbek Erkinovich',
    photos: [
      {
        src: '/img/cover-hens.webp',
        alt: 'Zamonaviy parrandaxona ichida oq broyler tovuqlar',
        slot: 'hero',
        depth: 0.2,
      },
    ],
  },

  // ── 02 · Current state (page “Ҳозирги ҳолати”) ──────────────────────────
  {
    id: 'current',
    navLabel: 'Hozirgi holat',
    kicker: 'Hozirgi holati',
    title: ['«Baraka hamkor parranda»', 'xususiy korxonasi'],
    subtitle: 'Andijon viloyati · Oʻzining em ishlab chiqarish kompleksiga ega',
    hero: [
      { value: '29.0', unit: USD, label: 'loyiha qiymati', icon: 'money' },
      { value: '300', unit: 'nafar', label: 'yaratilgan ishchi oʻrinlar', icon: 'workers' },
      { value: '30.0', unit: USD, label: 'yillik quvvat', icon: 'capacity' },
      { value: '350.0', unit: 'mlrd soʻm', label: 'mahsulot hajmi', icon: 'growth' },
    ],
    strip: [
      { value: '20.3', unit: 'mlrd soʻm', label: 'soliq toʻlangan', icon: 'tax' },
      { value: '2.0', unit: USD_PL, label: 'eksport qiymati', icon: 'export' },
      { value: 'Xitoy, Yevropa', label: 'texnologiya olib kelinadigan davlat', icon: 'tech' },
      { value: '2016', label: 'loyiha 2016-yildan ish boshlagan', icon: 'calendar' },
    ],
    visual: 'current',
    tags: [
      {
        id: 'parent',
        title: 'Ona tovuq ROSS-308 (Vengriya)',
        caption: 'yillik quvvat',
        value: '20,6',
        unit: 'mln dona naslli tuxumlar',
      },
      {
        id: 'hatch',
        title: 'Joʻja ochirish · Inkubatoriya',
        caption: 'yillik quvvat',
        value: '24',
        unit: 'mln bosh joʻja',
      },
      {
        id: 'rearing',
        title: 'Joʻja parvarishi',
        caption: 'yillik quvvat',
        value: '6,1',
        unit: 'mln bosh joʻja',
      },
      {
        id: 'feed',
        title: 'Em ishlab chiqariladi',
        value: '34',
        unit: 'ming tonna',
      },
      {
        id: 'eggs',
        title: 'Tuxum ishlab chiqarish',
        caption: 'yillik quvvat',
        value: '90',
        unit: 'mln dona tuxum',
      },
      {
        id: 'meat',
        title: 'Tovuq goʻshti',
        caption: 'yillik quvvat',
        value: '10',
        unit: 'ming tonna goʻsht',
      },
    ],
  },

  // ── 03 · Jalaquduq egg project ──────────────────────────────────────────
  {
    id: 'egg-project',
    navLabel: 'Jalaquduq',
    kicker: 'Taklifiy loyiha · Jalaquduq tumani',
    title: ['Tuxum yetishtirish', 'yoʻnalishi uchun bino', 'inshootini tashkil etish'],
    subtitle: 'Jalaquduq tumanida, «Baraka hamkor parranda» X/K tomonidan',
    hero: [
      { value: '418.0', unit: 'mln', label: 'jami yillik quvvat · tuxum yetishtirish', icon: 'capacity' },
      { value: '15.6', unit: USD, label: 'loyiha qiymati', icon: 'money' },
      { value: '38.3', unit: USD, label: 'yillik quvvat', icon: 'growth' },
      { value: '200', unit: 'nafar', label: 'yaratilgan ishchi oʻrinlar', icon: 'workers' },
    ],
    strip: [
      { value: '3.0', unit: USD_PL, label: 'bino inshooti qurilishi uchun', icon: 'factory' },
      { value: '6.0', unit: USD_PL, label: 'dastgoh va uskunalar qiymati', icon: 'machine' },
      { value: '6.6', unit: USD_PL, label: 'parranda uchun', icon: 'bird' },
      { value: '12', unit: 'gektar', label: 'yer maydoni', icon: 'area' },
      { value: '3.8', unit: USD_PL, label: 'eksport qiymati', icon: 'export' },
      { value: 'Xitoy', label: 'texnologiya olib kelinadigan davlat', icon: 'tech' },
      { value: '2026', unit: 'yil 4-chorak', label: 'ishga tushirish muddati', icon: 'calendar' },
    ],
    visual: 'eggProject',
    tags: [
      { id: 'six', title: '6 dona bino inshooti qurish', caption: 'yillik quvvat', value: '279.0', unit: 'mln' },
      { id: 'five', title: '5 dona bino inshooti qurish', caption: 'yillik quvvat', value: '139.0', unit: 'mln' },
      { id: 'rearing', title: 'Joʻja parvarishi', caption: 'yillik quvvat', value: '1.350', unit: 'mln bosh ona tovuq' },
    ],
    photos: [
      { src: '/img/layer-hen-eggs.webp', alt: 'Tuxum ustida turgan jigarrang tuxum beruvchi tovuq', slot: 'a', depth: 0.1 },
      { src: '/img/egg-inspection.webp', alt: 'Tuxumlarni saralash va tekshirish jarayoni', slot: 'b', depth: 0.35 },
      { src: '/img/layer-cages.webp', alt: 'Katakli batareyalarda tuxum beruvchi tovuqlar', slot: 'c', depth: 0.6 },
      { src: '/img/layer-corridor.webp', alt: 'Koʻp qavatli katak batareyalari yoʻlagi', slot: 'd', depth: 0.8 },
    ],
  },

  // ── 04 · Broiler project, 12 buildings ──────────────────────────────────
  {
    id: 'broiler-12',
    navLabel: 'Broyler · 12',
    kicker: 'Taklifiy loyiha · «Shuxrat ōgli»',
    title: ['«Broyler» tovuq boqish', 'uchun bino inshootini', 'tashkil etish'],
    subtitle: '«Shuxrat ōgli» — «Baraka hamkor parranda» X/K tomonidan',
    hero: [
      { value: '12', unit: 'ming tonna', label: 'tovuq goʻshti · yillik quvvat', icon: 'capacity' },
      { value: '5760.0', unit: 'ming bosh', label: 'broyler tovuq', icon: 'bird' },
      { value: '5.0', unit: USD, label: 'loyiha qiymati', icon: 'money' },
      { value: '70', unit: 'nafar', label: 'yaratilgan ishchi oʻrinlar', icon: 'workers' },
    ],
    strip: [
      { value: '2.0', unit: USD_PL, label: 'bino inshooti qurilishi uchun', icon: 'factory' },
      { value: '3.0', unit: USD_PL, label: 'dastgoh va uskunalar qiymati', icon: 'machine' },
      { value: '6', unit: 'gektar', label: 'yer maydoni', icon: 'area' },
      { value: '100%', label: 'import oʻrnini bosish', icon: 'import' },
      { value: '18.0', unit: USD, label: 'yillik quvvat', icon: 'growth' },
      { value: 'Xitoy', label: 'texnologiya olib kelinadigan davlat', icon: 'tech' },
      { value: '2026', unit: 'yil 4-chorak', label: 'ishga tushirish muddati', icon: 'calendar' },
    ],
    visual: 'broiler12',
    tags: [
      {
        id: 'houses',
        title: 'Broyler tovuq parvarishi uchun',
        value: '12',
        unit: 'dona zamonaviy intensiv binolar qurish',
      },
    ],
    photos: [
      { src: '/img/broiler-hen.webp', alt: 'Oq broyler tovuq', slot: 'a', depth: 0.1 },
      { src: '/img/broiler-cage.webp', alt: 'Zamonaviy katakda boqilayotgan broyler tovuqlar', slot: 'b', depth: 0.35 },
      { src: '/img/broiler-corridor.webp', alt: 'Intensiv parrandaxona ichki yoʻlagi', slot: 'c', depth: 0.6 },
      { src: '/img/broiler-carcass.webp', alt: 'Qayta ishlangan tovuq goʻshti mahsuloti', slot: 'd', depth: 0.8 },
    ],
  },

  // ── 05 · Xoʻjaobod broiler project, 6 buildings ──────────────────────────
  {
    id: 'broiler-6',
    navLabel: 'Xoʻjaobod',
    kicker: 'Taklifiy loyiha · Xoʻjaobod tumani',
    title: ['«Broyler» tovuq boqish', 'uchun bino inshootini', 'tashkil etish'],
    subtitle: 'Xoʻjaobod tumanida, «Baraka hamkor parranda» X/K tomonidan',
    hero: [
      { value: '6', unit: 'ming tonna', label: 'tovuq goʻshti · yillik quvvat', icon: 'capacity' },
      { value: '2880.0', unit: 'ming bosh', label: 'broyler tovuq', icon: 'bird' },
      { value: '2.5', unit: USD, label: 'loyiha qiymati', icon: 'money' },
      { value: '35', unit: 'nafar', label: 'yaratilgan ishchi oʻrinlar', icon: 'workers' },
    ],
    strip: [
      { value: '1.0', unit: USD_PL, label: 'bino inshooti qurilishi uchun', icon: 'factory' },
      { value: '1.5', unit: USD_PL, label: 'dastgoh va uskunalar qiymati', icon: 'machine' },
      { value: '3', unit: 'gektar', label: 'yer maydoni', icon: 'area' },
      { value: '100%', label: 'import oʻrnini bosish', icon: 'import' },
      { value: '9.0', unit: USD, label: 'yillik quvvat', icon: 'growth' },
      { value: 'Xitoy', label: 'texnologiya olib kelinadigan davlat', icon: 'tech' },
      { value: '2026', unit: 'yil 4-chorak', label: 'ishga tushirish muddati', icon: 'calendar' },
    ],
    visual: 'broiler6',
    tags: [
      {
        id: 'houses',
        title: 'Broyler tovuq parvarishi uchun',
        value: '6',
        unit: 'dona zamonaviy intensiv binolar qurish',
      },
    ],
    photos: [
      { src: '/img/broiler-corridor.webp', alt: 'Intensiv parrandaxona ichki yoʻlagi', slot: 'a', depth: 0.25 },
      { src: '/img/broiler-carcass.webp', alt: 'Qayta ishlangan tovuq goʻshti mahsuloti', slot: 'b', depth: 0.5 },
    ],
  },

  // ── 06 · 2026–2027 investment ────────────────────────────────────────────
  {
    id: 'investment',
    navLabel: 'Investitsiya',
    kicker: '2026–2027',
    title: ['Umumiy kiritilishi', 'rejalashtirilayotgan', 'investitsiya'],
    subtitle: '2026–2027 yillar davomida',
    hero: [{ value: '39.1', unit: 'mln AQSH dollari', label: 'jami investitsiya', icon: 'money' }],
    strip: [],
    visual: 'investment',
    investment: {
      value: '39.1',
      unit: 'mln AQSH dollari',
      children: [
        {
          value: '23.1',
          unit: 'mln AQSH dollari',
          children: [
            { value: '18.0', unit: 'ming tonna', label: 'Broyler tovuq' },
            { value: '418.0', unit: 'mln dona', label: 'Tuxum tovuq' },
          ],
        },
        {
          value: '16.0',
          unit: 'mln AQSH dollari',
          children: [
            { value: '1.0', unit: 'mln $', label: 'Em zavod rekonstruksiyasi' },
            { value: '7.2', unit: 'mln $', label: 'Ozuqa zaxirasi' },
            { value: '1.8', unit: 'mln $', label: 'Soʻyish sexi va muzlatgich rekonstruksiyasi' },
            { value: '6.0', unit: 'mln $', label: 'Mavjud binolarni jihozlash' },
          ],
        },
      ],
    },
  },

  // ── 07 · Expected results 2016 → 2027 ───────────────────────────────────
  {
    id: 'results',
    navLabel: 'Natijalar',
    kicker: 'Kutilayotgan natijalar',
    title: ['Istiqbolli yangi', 'loyihalar boʻyicha', 'kutilayotgan natijalar'],
    subtitle:
      'Andijon viloyati «Baraka hamkor parranda» xususiy korxonasining 2026–2027 yillarga rejalashtirilgan loyihalari',
    hero: [],
    strip: [],
    visual: 'results',
    results: {
      beforeYear: '2016',
      afterYear: '2027',
      pairs: [
        { label: 'Yaratilgan ishchi oʻrin', unit: 'nafar', before: '300', after: '605' },
        { label: 'Goʻsht mahsuloti', unit: 'ming tonna', before: '10.0', after: '53.0' },
        { label: 'Tuxum mahsuloti', unit: 'mln dona', before: '90.0', after: '418.0' },
        { label: 'Ishlab chiqarish mahsulot aylanmasi', unit: 'mlrd soʻm', before: '350.0', after: '1400.0' },
        { label: 'Soliq tushumi', unit: 'mlrd soʻm', before: '20.0', after: '90.0' },
        { label: 'Em zavod quvvati', unit: 'ming tonna', before: '34.0', after: '140.1' },
      ],
    },
  },
]

export const brand = {
  name: 'Shuxrat ōgli',
  byline: 'By «Baraka hamkor parranda» XK',
  logo: '/img/logo-mark.png',
  logoAlt: 'Shuxrat ōgli logotipi',
}
