const traverser = require('../traverser');
const { AstNodes } = require('../../constants');

describe('traverser', () => {
	const ast = {
		type: AstNodes.PROGRAM,
		body: [
			{
				type: AstNodes.CALL_EXPRESSION,
				name: 'add',
				params: [
					{
						type: AstNodes.NUMBER_LITERAL,
						value: 12,
					},
					{
						type: AstNodes.STRING_LITERAL,
						value: 'Yosef',
					},
					{
						type: AstNodes.IDENTIFIER,
						name: 'x',
					},
				],
			},
		],
	};

	it('should apply the methods in the visitor for each node in two times', () => {
		let counter = 0;

		const visitor = {
			[AstNodes.PROGRAM]: {
				enter() {
					counter++;
				},
				exit() {
					counter++;
				},
			},
			[AstNodes.CALL_EXPRESSION]: {
				enter() {
					counter++;
				},
				exit() {
					counter++;
				},
			},
			[AstNodes.NUMBER_LITERAL]: {
				enter() {
					counter++;
				},
				exit() {
					counter++;
				},
			},
			[AstNodes.STRING_LITERAL]: {
				enter() {
					counter++;
				},
				exit() {
					counter++;
				},
			},
			[AstNodes.IDENTIFIER]: {
				enter() {
					counter++;
				},
				exit() {
					counter++;
				},
			},
		};

		traverser(ast, visitor);

		expect(counter).toBe(10);
	});

	it('should pass the parent and the node in each node traversal', () => {
		const visitor = {
			[AstNodes.PROGRAM]: {
				enter(node, parent) {
					expect(node).toEqual(ast);
					expect(parent).toBeNull();
				},
				exit(node, parent) {
					expect(node).toEqual(ast);
					expect(parent).toBeNull();
				},
			},
			[AstNodes.CALL_EXPRESSION]: {
				enter(node, parent) {
					expect(parent).toEqual(ast);
					expect(node).toEqual(ast.body[0]);
				},
				exit(node, parent) {
					expect(parent).toEqual(ast);
					expect(node).toEqual(ast.body[0]);
				},
			},
			[AstNodes.NUMBER_LITERAL]: {
				enter(node, parent) {
					expect(parent).toEqual(ast.body[0]);
					expect(node).toEqual(ast.body[0].params[0]);
				},
				exit(node, parent) {
					expect(parent).toEqual(ast.body[0]);
					expect(node).toEqual(ast.body[0].params[0]);
				},
			},
			[AstNodes.STRING_LITERAL]: {
				enter(node, parent) {
					expect(parent).toEqual(ast.body[0]);
					expect(node).toEqual(ast.body[0].params[1]);
				},
				exit(node, parent) {
					expect(parent).toEqual(ast.body[0]);
					expect(node).toEqual(ast.body[0].params[1]);
				},
			},
			[AstNodes.IDENTIFIER]: {
				enter(node, parent) {
					expect(parent).toEqual(ast.body[0]);
					expect(node).toEqual(ast.body[0].params[2]);
				},
				exit(node, parent) {
					expect(parent).toEqual(ast.body[0]);
					expect(node).toEqual(ast.body[0].params[2]);
				},
			},
		};

		traverser(ast, visitor);
	});
});
