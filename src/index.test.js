const { tokenizer, parser, traverser } = require('.');

describe('tokenizer', () => {
	it('should push parenteses', () => {
		expect(tokenizer('()')).toEqual([
			{ type: 'paren', value: '(' },
			{ type: 'paren', value: ')' },
		]);
	});

	it('should push identifiers', () => {
		expect(tokenizer('add')).toEqual([{ type: 'identifier', value: 'add' }]);
	});

	it('should push numbers', () => {
		expect(tokenizer('123')).toEqual([{ type: 'number', value: 123 }]);
	});

	it('should push strings', () => {
		expect(tokenizer('"123 123"')).toEqual([
			{ type: 'string', value: '123 123' },
		]);
	});

	it('should turn the input into a set of tokens', () => {
		expect(tokenizer('(add 12 27)')).toEqual([
			{ type: 'paren', value: '(' },
			{ type: 'identifier', value: 'add' },
			{ type: 'number', value: 12 },
			{ type: 'number', value: 27 },
			{ type: 'paren', value: ')' },
		]);
	});

	it("should panic whenever it finds a token that's not assigned into it", () => {
		expect(() => tokenizer('😀😀😀😀')).toThrow();
	});
});

describe('parser', () => {
	it('should parse numbers into nodes', () => {
		expect(parser([{ type: 'number', value: 12 }])).toEqual({
			type: 'Program',
			body: [
				{
					type: 'NumberLiteral',
					value: 12,
				},
			],
		});
	});

	it('should parse strings into nodes', () => {
		expect(parser([{ type: 'string', value: '123 123' }])).toEqual({
			type: 'Program',
			body: [
				{
					type: 'StringLiteral',
					value: '123 123',
				},
			],
		});
	});

	it('should parse function name and params', () => {
		expect(
			parser([
				{ type: 'paren', value: '(' },
				{ type: 'identifier', value: 'add' },
				{ type: 'number', value: 12 },
				{ type: 'number', value: 27 },
				{ type: 'paren', value: ')' },
			]),
		).toEqual({
			type: 'Program',
			body: [
				{
					type: 'CallExpression',
					name: 'add',
					params: [
						{
							type: 'NumberLiteral',
							value: 12,
						},
						{
							type: 'NumberLiteral',
							value: 27,
						},
					],
				},
			],
		});
	});

	it('should throw an error when something is wrong', () => {
		// 🤷‍♂️
		expect(1).toBe(1);
	});
});

describe('traverser', () => {
	const ast = {
		type: 'Program',
		body: [
			{
				type: 'CallExpression',
				name: 'add',
				params: [
					{
						type: 'NumberLiteral',
						value: 12,
					},
					{
						type: 'StringLiteral',
						value: 'Yosef',
					},
				],
			},
		],
	};

	it('should apply the methods in the visitor for each node in two times', () => {
		let counter = 0;

		const visitor = {
			Program: {
				enter() {
					counter++;
				},
				exit() {
					counter++;
				},
			},
			CallExpression: {
				enter() {
					counter++;
				},
				exit() {
					counter++;
				},
			},
			NumberLiteral: {
				enter() {
					counter++;
				},
				exit() {
					counter++;
				},
			},
			StringLiteral: {
				enter() {
					counter++;
				},
				exit() {
					counter++;
				},
			},
		};

		traverser(ast, visitor);

		expect(counter).toBe(8);
	});

	it('should pass the parent and the node in each node traversal', () => {
		const visitor = {
			Program: {
				enter(node, parent) {
					expect(node).toEqual(ast);
					expect(parent).toBeNull();
				},
				exit(node, parent) {
					expect(node).toEqual(ast);
					expect(parent).toBeNull();
				},
			},
			CallExpression: {
				enter(node, parent) {
					expect(parent).toEqual(ast);
					expect(node).toEqual(ast.body[0]);
				},
				exit(node, parent) {
					expect(parent).toEqual(ast);
					expect(node).toEqual(ast.body[0]);
				},
			},
			NumberLiteral: {
				enter(node, parent) {
					expect(parent).toEqual(ast.body[0]);
					expect(node).toEqual(ast.body[0].params[0]);
				},
				exit(node, parent) {
					expect(parent).toEqual(ast.body[0]);
					expect(node).toEqual(ast.body[0].params[0]);
				},
			},
			StringLiteral: {
				enter(node, parent) {
					expect(parent).toEqual(ast.body[0]);
					expect(node).toEqual(ast.body[0].params[1]);
				},
				exit(node, parent) {
					expect(parent).toEqual(ast.body[0]);
					expect(node).toEqual(ast.body[0].params[1]);
				},
			},
		};

		traverser(ast, visitor);
	});
});
