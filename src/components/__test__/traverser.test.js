const traverser = require('../traverser');

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
