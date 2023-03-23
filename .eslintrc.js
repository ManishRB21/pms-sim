module.exports = {
  "env": {
    "es6": true,
    "node": true,
    "mocha": true,
  },
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
  },
  "plugins": ["node", "mocha", "security"],
  "extends": ["eslint:recommended", "plugin:node/recommended", "plugin:security/recommended"],
  "rules": {
    "indent": [
      "error",
      2,
    ],
    "linebreak-style": [
      "error",
      "unix",
    ],
    "quotes": [
      "error",
      "single",
    ],
    "node/no-unpublished-require": 0,
    "node/no-unsupported-features": 0,
    "security/detect-non-literal-fs-filename": 0,
  },
};