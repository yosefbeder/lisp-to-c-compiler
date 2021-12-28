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

module.exports = traverser;
