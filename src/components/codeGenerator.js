const { AstNodes } = require('../constants');

const codeGenerator = node => {
	if (node.type === AstNodes.NUMBER_LITERAL) {
		return String(node.value);
	}

	if (node.type === AstNodes.STRING_LITERAL) {
		return `"${node.value}"`;
	}

	if (node.type === AstNodes.IDENTIFIER) {
		return node.name;
	}

	if (node.type === AstNodes.CALL_EXPRESSION) {
		return `${node.callee.name}(${node.arguments
			.map(node => codeGenerator(node))
			.join(', ')})`;
	}

	if (node.type === AstNodes.EXPRESSION_STATEMENT) {
		return `${codeGenerator(node.expression)};`;
	}

	if (node.type === AstNodes.PROGRAM) {
		return node.body.map(node => codeGenerator(node)).join('\n');
	}
};

module.exports = codeGenerator;
