const { Tokens, AstNodes } = require('../constants');

const parser = tokens => {
	let current = 0;

	function walk() {
		let token = tokens[current];

		if (token.type === Tokens.NUMBER) {
			current++;

			return {
				type: AstNodes.NUMBER_LITERAL,
				value: token.value,
			};
		}

		if (token.type === Tokens.STRING) {
			current++;

			return {
				type: AstNodes.STRING_LITERAL,
				value: token.value,
			};
		}

		if (token.type === Tokens.PARENTHESES && token.value === '(') {
			token = tokens[++current];

			let node = {
				type: AstNodes.CALL_EXPRESSION,
				name: token.value,
				params: [],
			};

			token = tokens[++current];

			while (
				token.type !== Tokens.PARENTHESES ||
				(Tokens.PARENTHESES && token.value !== ')')
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
		type: AstNodes.PROGRAM,
		body: [],
	};

	while (current < tokens.length) {
		ast.body.push(walk());
	}

	return ast;
};

module.exports = parser;
