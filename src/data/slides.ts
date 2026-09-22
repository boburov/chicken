import type { Slide } from './types'

/**
 * All presentation content lives here. Brochure text is transliterated to Uzbek Latin;
 * every number is kept exactly as provided by the company.
 * Edit this file to change copy, numbers or images — no component changes needed.
 */

export const slides: Slide[] = [
  // One-screen overview: project financing + expected results of the new project.
  {
    id: 'overview',
    navLabel: 'Loyiha',
    kicker: 'Andijon viloyati',
    title: ['Baraka', 'hamkor parranda'],
    subtitle: 'Xususiy korxonasi',
    hero: [],
    strip: [],
    visual: 'cover',
    financing: {
      total: { value: '50', unit: 'mln AQSH dollar', label: 'Loyiha qiymati', icon: 'money' },
      parts: [
        {
          value: '35',
          unit: 'mln $',
          label: 'Bank krediti',
          icon: 'bank',
          logo: { src: '/img/mkbank.svg', alt: 'Mikrokreditbank logotipi' },
          tone: 'blue',
        },
        { value: '15', unit: 'mln $', label: 'Oʻz hisobidan', icon: 'wallet', tone: 'purple' },
      ],
    },
    comparison: {
      title: 'Yangi loyiha ishga tushgach',
      beforeLabel: 'Hozir',
      afterLabel: 'Loyihadan keyin',
      rows: [
        { label: 'Tovuq goʻshti', icon: 'bird', unit: 'ming tonna', before: '10', after: '60' },
        { label: 'Tuxum', icon: 'egg', unit: 'mln dona', note: 'yillik', before: '90', after: '418' },
        { label: 'Aylanma', icon: 'growth', unit: 'mlrd soʻm', note: 'oʻrtacha yillik', before: '300', after: '1,4', afterUnit: 'trln soʻm' },
        { label: 'Ish oʻrinlari', icon: 'workers', unit: 'nafar', before: '305', after: '705' },
      ],
    },
    market: {
      title: 'Andijon viloyati talabi va bizning ulush',
      demandLabel: 'Viloyat talabi',
      outputLabel: 'Bizning ishlab chiqarish',
      rows: [
        { label: 'Tuxum', icon: 'egg', unit: 'mln dona', demand: '720', output: '418' },
        { label: 'Goʻsht', icon: 'bird', unit: 'ming tonna', demand: '52', output: '60' },
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
]

export const brand = {
  name: 'Shuxrat ōgli',
  byline: 'By «Baraka hamkor parranda» XK',
  logo: '/img/logo-mark.png',
  logoAlt: 'Shuxrat ōgli logotipi',
}
