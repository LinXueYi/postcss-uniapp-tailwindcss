module.exports = {
  platform: 'mp',
  units: {
    px2rem: 0.25,
    px2rpx: 2,
    rem2rpx: 32,
    px2pt: 0.22,
    rpx2pt: 0.75,
    rem2pt: 28.125,
    'vw2%': 1,
    'vh2%': 1
  },
  unitIgnore: {
    selector: [],
    prop: [/^border-.*?width$/],
    value: []
  },
  unitGroup: {
    h5: ['px2rem'],
    mp: ['px2rpx', 'rem2rpx'],
    native: ['px2pt', 'rem2pt', 'rpx2pt', 'vw2%', 'vh2%']
  },
  selectorRules: [
    {
      pattern: /(\.[\S]+?(?<!>))\s?>\s?:not\(\[(hidden|template)\]\)\s?~\s?:not\(\[(hidden|template)\]\)/g,
      replacement: '$1 > view + view'
    },
    {
      pattern: /\\:(?!hover|focus)/g,
      replacement: '_'
    },
    {
      pattern: /\\\//g,
      replacement: '_'
    },
    {
      pattern: /\.\\/g,
      replacement: '._'
    },
    {
      pattern: /\\\./g,
      replacement: '_'
    },
    {
      pattern: /^\*$/,
      replacement: 'page'
    }
  ]
};
