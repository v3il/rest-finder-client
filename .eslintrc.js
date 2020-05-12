module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/typescript/recommended', 'prettier'],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        indent: ['error', 4, { SwitchCase: 1 }],
        'comma-dangle': 'off',
        quotes: ['warn', 'single'],
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                semi: true,
                trailingComma: 'all',
            },
        ],
        'vue/valid-v-for': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'import/no-cycle': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
        'class-methods-use-this': 'off',
        '@typescript-eslint/camelcase': 'off',
        'no-underscore-dangle': 'off',
    },
};
