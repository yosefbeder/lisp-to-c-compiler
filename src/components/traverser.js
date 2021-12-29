const { AstNodes } = require('../constants');

const traverser = (ast, visitor) => {
	const traverseNode = (node, parent = null) => {
		if (node.type === AstNodes.PROGRAM) {
			visitor?.[node.type]?.enter?.(node, parent);

			let current = 0;

			while (current < node.body.length) {
				let childNode = node.body[current];

				traverseNode(childNode, node);
				current++;
				continue;
			}

			visitor?.[node.type]?.exit?.(node, parent);
		}

		if (node.type === AstNodes.CALL_EXPRESSION) {
			visitor?.[node.type]?.enter?.(node, parent);

			let current = 0;

			while (current < node.params.length) {
				let childNode = node.params[current];

				traverseNode(childNode, node);
				current++;
				continue;
			}

			visitor?.[node.type]?.exit?.(node, parent);
		}

		if (
			node.type === AstNodes.STRING_LITERAL ||
			node.type === AstNodes.NUMBER_LITERAL ||
			node.type === AstNodes.IDENTIFIER
		) {
			visitor?.[node.type]?.enter?.(node, parent);
			visitor?.[node.type]?.exit?.(node, parent);
		}
	};

	traverseNode(ast);
};

module.exports = traverser;
