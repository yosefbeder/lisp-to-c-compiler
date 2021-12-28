const traverser = require('./traverser');

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

module.exports = transformer;
