module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'unicorn'],
  extends: ['plugin:@typescript-eslint/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['enum', 'enumMember'],
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/no-restricted-imports': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-process-env': 'error',
    'max-lines': ['error', 600],
    'max-params': ['error', { max: 3 }],
    'max-lines-per-function': [
      'error',
      {
        max: 75,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    'no-console': 'error',
  },
};
