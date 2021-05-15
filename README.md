# PostCSS Uniapp Tailwindcss

[PostCSS] plugin use tailwindcss in uniapp.

[postcss]: https://github.com/postcss/postcss

```css
/* Input example */

.foo {
  width: 2px;
  height: 1rem;
}

.w-1\/2,
.w-0\.5 {
}
```

```css
/* Output example */
.foo {
  width: 4rpx;
  height: 32rpx;
}

.w-1_2,
.w-0_5 {
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-uniapp-tailwindcss
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('tailwindcss'),
+   require('postcss-uniapp-tailwindcss'),
    require('autoprefixer')
  ]
}
```

### Options

**default options:**

```json
{
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
}
```

| option                      | type          | description                                  |
| --------------------------- | ------------- | -------------------------------------------- |
| units                       | object        | unit conversion scale                        |
| unitIgnore                  | object        | Do not convert unit rules                    |
| unitIgnore.selector         | regex\|string | Do not convert declaration's parent selector |
| unitIgnore.prop             | regex\|string | Do not convert declaration's prop            |
| unitIgnore.value            | regex\|string | Do not convert declaration's value           |
| unitGroup                   | object        | unit group by platform                       |
| selectorRules               | array         | selector replace rules                       |
| selectorRules[].pattern     | regex\|string | selector replace pattern                     |
| selectorRules[].replacement | string        | selector replace replacement                 |

[official docs]: https://github.com/postcss/postcss#usage
