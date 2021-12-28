const {
	tokenizer,
	parser,
	transformer,
	codeGenerator,
} = require('./components');

const compiler = input => {
	const tokens = tokenizer(input);
	const ast = parser(tokens);
	const newAst = transformer(ast);

	return codeGenerator(newAst);
};

module.exports = compiler;
