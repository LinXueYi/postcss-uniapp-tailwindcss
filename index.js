const config = require('./config');

module.exports = (opts = {}) => {
  opts = { ...config, ...opts };
  const covertRules = opts.unitGroup[opts.platform].map((item) => {
    const rule = item.split('2');
    if (rule[0] && rule[1]) {
      return {
        key: rule[0],
        covert: rule[1]
      };
    }
  });

  const isRegExp = (val) => {
    return typeof val === 'object' && val instanceof RegExp;
  };
  const isUnitIgnoreSelector =
    opts.unitIgnore && Array.isArray(opts.unitIgnore.selector) && opts.unitIgnore.selector.length > 0;
  const isUnitIgnoreProp = opts.unitIgnore && Array.isArray(opts.unitIgnore.prop) && opts.unitIgnore.prop.length > 0;
  const isUnitIgnoreValue = opts.unitIgnore && Array.isArray(opts.unitIgnore.value) && opts.unitIgnore.value.length > 0;
  const isSelectorRules = opts.selectorRules && Array.isArray(opts.selectorRules) && opts.selectorRules.length > 0;

  // Work with options here
  return {
    postcssPlugin: 'postcss-uniapp-tailwindcss',
    Rule(rule, postcss) {
      // Transform CSS AST here
      if (isSelectorRules) {
        opts.selectorRules.forEach((item) => {
          if (
            (typeof item.pattern === 'string' && rule.selector === item.pattern) ||
            (isRegExp(item.pattern) && item.pattern.test(rule.selector))
          ) {
            rule.selector = rule.selector.replace(item.pattern, item.replacement);
          }
        });
      }
    },
    Once(root, postcss) {
      root.walkDecls((decl) => {
        covertRules.forEach((item) => {
          const times = opts.units[`${item.key}2${item.covert}`];
          if (!times || typeof times !== 'number') {
            return;
          }
          if (isUnitIgnoreSelector) {
            const selector = decl.parent.selector;
            const isIgnoreSelector = opts.unitIgnore.selector.some((item) => {
              return (typeof item === 'string' && item === selector) || (isRegExp(item) && item.test(selector));
            });
            if (isIgnoreSelector) {
              return;
            }
          }
          if (isUnitIgnoreProp) {
            const isIgnoreProp = opts.unitIgnore.prop.some((item) => {
              return (typeof item === 'string' && item === decl.prop) || (isRegExp(item) && item.test(decl.prop));
            });
            if (isIgnoreProp) {
              return;
            }
          }
          const regExp = new RegExp(`([\\d\\.]+)${item.key}`, 'ig');
          if (regExp.test(decl.value)) {
            const match = decl.value.match(regExp);
            match.forEach((matchItem) => {
              let val = matchItem.toLowerCase();
              if (isUnitIgnoreValue) {
                const isIgnoreValue = opts.unitIgnore.value.some((item) => {
                  return (typeof item === 'string' && item.toLowerCase() === val) || (isRegExp(item) && item.test(val));
                });
                if (isIgnoreValue) {
                  return;
                }
              }
              val = val.replace(item.key, '');
              const newVal = `${val * times}${item.covert}`;
              decl.value = decl.value.replace(matchItem, newVal);
            });
          }
        });
      });
    }
  };
};
module.exports.postcss = true;
