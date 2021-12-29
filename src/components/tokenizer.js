const { isParen, isWhitespace, isLetter, isNumber } = require('../utils');
const { Tokens } = require('../constants');

const tokenizer = input => {
	let current = 0;

	let tokens = [];

	while (current < input.length) {
		let char = input[current];

		// parentheses
		if (isParen(char)) {
			tokens.push({
				type: Tokens.PARENTHESES,
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
				type: Tokens.IDENTIFIER,
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
				type: Tokens.STRING,
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
				type: Tokens.NUMBER,
				value: Number(value),
			});

			continue;
		}

		throw new TypeError('I dont know what this character is: ' + char);
	}

	return tokens;
};

module.exports = tokenizer;
