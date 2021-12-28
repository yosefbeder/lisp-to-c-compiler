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

const traverser = (ast, visitor) => {
	const traverseNode = (node, parent = null) => {
		if (node.type === 'Program') {
			visitor?.Program?.enter?.(node, parent);

			let current = 0;

			while (current < node.body.length) {
				let childNode = node.body[current];

				traverseNode(childNode, node);
				current++;
				continue;
			}

			visitor?.Program?.exit?.(node, parent);
		}

		if (node.type === 'CallExpression') {
			visitor?.CallExpression?.enter?.(node, parent);

			let current = 0;

			while (current < node.params.length) {
				let childNode = node.params[current];

				traverseNode(childNode, node);
				current++;
				continue;
			}

			visitor?.CallExpression?.exit?.(node, parent);
		}

		if (node.type === 'StringLiteral' || node.type === 'NumberLiteral') {
			visitor?.[node.type]?.enter?.(node, parent);
			visitor?.[node.type]?.exit?.(node, parent);
		}
	};

	traverseNode(ast);
};

const transformNode = node => {
	if (node.type === 'NumberLiteral' || node.type === 'StringLiteral') {
		return node;
	}

	return {
		type: 'CallExpression',
		callee: {
			type: 'Identifier',
			name: node.name,
		},
		arguments: node.params.map(node => transformNode(node)),
	};
};

const transformer = ast => {
	const newAst = {
		type: 'Program',
		body: [],
	};

	traverser(ast, {
		NumberLiteral: {
			enter(node, parent) {
				if (parent.type === 'Program') {
					newAst.body.push({ type: 'ExpressionStatement', expression: node });
				}
			},
		},
		StringLiteral: {
			enter(node, parent) {
				if (parent.type === 'Program') {
					newAst.body.push({ type: 'ExpressionStatement', expression: node });
				}
			},
		},
		CallExpression: {
			enter(node, parent) {
				const newNode = transformNode(node);

				if (parent.type === 'Program') {
					newAst.body.push({
						type: 'ExpressionStatement',
						expression: newNode,
					});
				}
			},
		},
	});

	return newAst;
};

const codeGenerator = node => {
	if (node.type === 'NumberLiteral') {
		return String(node.value);
	}

	if (node.type === 'StringLiteral') {
		return `"${node.value}"`;
	}

	if (node.type === 'CallExpression') {
		return `${node.callee.name}(${node.arguments
			.map(node => codeGenerator(node))
			.join(', ')})`;
	}

	if (node.type === 'ExpressionStatement') {
		return `${codeGenerator(node.expression)};`;
	}

	if (node.type === 'Program') {
		return node.body.map(node => codeGenerator(node)).join('\n');
	}
};

module.exports = { tokenizer, parser, traverser, transformer, codeGenerator };
