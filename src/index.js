/*
	Notes
		- ++counter
			- Increments the counter and returns it.
		- counter++
			- Returns the counter then increments it.

*/

/*
  Tokens
    - type -> 'paren', value -> '(' | ')',
    - type -> 'identifier', value -> String,
    - type -> 'number', value -> Number,
    - type -> 'string', value -> String
*/

/*
	AST Nodes
		- NumberLiteral (type -> String, value -> Number)
		- StringLiteral (type -> String, value -> String)
		- CallExpression (type -> String, name -> String, params -> [Node])
*/

const isWhitespace = char => /\s/.test(char);

const isLetter = char => /[a-z]/i.test(char);

const isNumber = char => /[0-9]/.test(char);

const isParen = char => /\(|\)/.test(char);

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

const parser = tokens => {
	let current = 0;

	function walk() {
		let token = tokens[current];

		if (token.type === 'number') {
			current++;

			return {
				type: 'NumberLiteral',
				value: token.value,
			};
		}

		if (token.type === 'string') {
			current++;

			return {
				type: 'StringLiteral',
				value: token.value,
			};
		}

		if (token.type === 'paren' && token.value === '(') {
			token = tokens[++current];

			let node = {
				type: 'CallExpression',
				name: token.value,
				params: [],
			};

			token = tokens[++current];

			while (
				token.type !== 'paren' ||
				(token.type === 'paren' && token.value !== ')')
			) {
				node.params.push(walk());
				token = tokens[current];
			}

			current++;

			return node;
		}

		throw new TypeError(token.type);
	}

	let ast = {
		type: 'Program',
		body: [],
	};

	while (current < tokens.length) {
		ast.body.push(walk());
	}

	return ast;
};

module.exports = { tokenizer, parser };
