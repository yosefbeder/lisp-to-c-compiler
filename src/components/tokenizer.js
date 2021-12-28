const { isParen, isWhitespace, isLetter, isNumber } = require('../utils');

const tokenizer = input => {
	let current = 0;

	let tokens = [];

	while (current < input.length) {
		let char = input[current];

		// parentheses
		if (isParen(char)) {
			tokens.push({
				type: 'paren',
				value: char,
			});

			current++;
			continue;
		}

		// whitespaces
		if (isWhitespace(char)) {
			current++;
			continue;
		}

		// identifiers
		if (isLetter(char)) {
			let value = '';

			while (char && isLetter(char)) {
				value += char;
				char = input[++current];
			}

			tokens.push({
				type: 'identifier',
				value,
			});

			continue;
		}

		// strings
		if (char === '"') {
			char = input[++current];

			let value = '';

			while (char && char !== '"') {
				value += char;
				char = input[++current];
			}

			tokens.push({
				type: 'string',
				value,
			});

			current++;
			continue;
		}

		// numbers
		if (isNumber(char)) {
			let value = '';

			while (char && isNumber(char)) {
				value += char;
				char = input[++current];
			}

			tokens.push({
				type: 'number',
				value: Number(value),
			});

			continue;
		}

		throw new TypeError('I dont know what this character is: ' + char);
	}

	return tokens;
};

module.exports = tokenizer;
