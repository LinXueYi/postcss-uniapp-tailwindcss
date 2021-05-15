const postcss = require('postcss');

const plugin = require('./');

async function run(input, output, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

// Write tests here

it('selector rule', async () => {
  await run('.sm:space-y-0 > :not([hidden]) ~ :not([hidden]) {}', '.sm:space-y-0 > view + view {}', {});
});

it('unit ignore rule', async () => {
  await run(
    'a { border-width: 1px }  div { padding: 2px } img { width:10px; height: 20px }',
    'a { border-width: 1px }  div { padding: 2px } img { width:10px; height: 40rpx }',
    {
      unitIgnore: {
        prop: [/^border-.*?width$/],
        selector: ['div'],
        value: ['10px']
      }
    }
  );
});

it('unit rule error', async () => {
  await run('a { border-width: 1px }', 'a { border-width: 1px }', {
    units: { px2rpx: null },
    unitGroup: {
      mp: ['px2rpx']
    }
  });
});
