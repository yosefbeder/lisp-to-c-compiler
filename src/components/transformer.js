const traverser = require('./traverser');
const { AstNodes } = require('../constants');

const transformNode = node => {
	if (
		node.type === AstNodes.NUMBER_LITERAL ||
		node.type === AstNodes.STRING_LITERAL
	) {
		return node;
	}

	return {
		type: AstNodes.CALL_EXPRESSION,
		callee: {
			type: AstNodes.IDENTIFIER,
			name: node.name,
		},
		arguments: node.params.map(node => transformNode(node)),
	};
};

const transformer = ast => {
	const newAst = {
		type: AstNodes.PROGRAM,
		body: [],
	};

	traverser(ast, {
		[AstNodes.NUMBER_LITERAL]: {
			enter(node, parent) {
				if (parent.type === AstNodes.PROGRAM) {
					newAst.body.push({
						type: AstNodes.EXPRESSION_STATEMENT,
						expression: node,
					});
				}
			},
		},
		[AstNodes.STRING_LITERAL]: {
			enter(node, parent) {
				if (parent.type === AstNodes.PROGRAM) {
					newAst.body.push({
						type: AstNodes.EXPRESSION_STATEMENT,
						expression: node,
					});
				}
			},
		},
		[AstNodes.CALL_EXPRESSION]: {
			enter(node, parent) {
				const newNode = transformNode(node);

				if (parent.type === AstNodes.PROGRAM) {
					newAst.body.push({
						type: AstNodes.EXPRESSION_STATEMENT,
						expression: newNode,
					});
				}
			},
		},
	});

	return newAst;
};

module.exports = transformer;
