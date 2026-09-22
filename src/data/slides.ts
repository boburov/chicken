import type { Slide } from './types'

/**
 * All presentation content lives here. Brochure text is transliterated to Uzbek Latin;
 * every number is kept exactly as printed or as provided by the company.
 * Edit this file to change copy, numbers or images — no component changes needed.
 */

export const slides: Slide[] = [
  // ── 01 · Cover + project financing ──────────────────────────────────────
  {
    id: 'cover',
    navLabel: 'Loyiha',
    kicker: 'Andijon viloyati',
    title: ['Baraka', 'hamkor parranda'],
    subtitle: 'oilaviy xususiy korxonasi',
    hero: [],
    strip: [],
    visual: 'cover',
    financing: {
      total: { value: '48', unit: 'mln AQSH dollar', label: 'Loyiha qiymati', icon: 'money' },
      parts: [
        { value: '35', unit: 'mln $', label: 'Bank krediti', icon: 'bank', tone: 'blue' },
        { value: '13', unit: 'mln $', label: 'Oʻz hisobidan', icon: 'wallet', tone: 'purple' },
      ],
    },
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

  // ── 02 · Current state → after the new project ──────────────────────────
  {
    id: 'current',
    navLabel: 'Hozirgi holat · Yangi loyiha',
    kicker: 'Hozirgi holat · Yangi loyiha',
    title: ['«Baraka hamkor parranda»', 'xususiy korxonasi'],
    subtitle: 'Andijon viloyati · Oʻzining em ishlab chiqarish kompleksiga ega',
    hero: [],
    comparison: {
      beforeLabel: 'Hozirgi holat',
      afterLabel: 'Yangi loyihadan keyin',
      rows: [
        { label: 'Tovuq goʻshti', unit: 'ming tonna', before: '10', after: '60' },
        { label: 'Tuxum', unit: 'mln dona', note: 'yillik', before: '90', after: '418' },
        { label: 'Aylanma', unit: 'mlrd soʻm', note: 'oʻrtacha yillik', before: '300', after: '1 400' },
        { label: 'Ish oʻrinlari', unit: 'nafar', before: '305', after: '705' },
      ],
    },
    strip: [
      { value: '30.0', unit: 'mln AQSH dollar', label: 'yillik quvvat', icon: 'capacity' },
      { value: '20.3', unit: 'mlrd soʻm', label: 'soliq toʻlangan', icon: 'tax' },
      { value: '2.0', unit: 'mln AQSH dollari', label: 'eksport qiymati', icon: 'export' },
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
]

export const brand = {
  name: 'Shuxrat ōgli',
  byline: 'By «Baraka hamkor parranda» XK',
  logo: '/img/logo-mark.png',
  logoAlt: 'Shuxrat ōgli logotipi',
}
