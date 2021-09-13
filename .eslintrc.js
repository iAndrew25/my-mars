module.exports = {
	root: true,
	extends: ['@react-native-community', 'prettier'],
	ignorePatterns: ['/coverage'],
	rules: {
		'react-hooks/exhaustive-deps': 'off',
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				printWidth: 120,
				useTabs: true,
				bracketSpacing: true,
				trailingComma: 'none',
				arrowParens: 'avoid',
				endOfLine: 'auto'
			}
		]
	},
	env: {
		jest: true
	}
};
