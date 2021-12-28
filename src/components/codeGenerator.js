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

module.exports = codeGenerator;
