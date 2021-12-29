const codeGenerator = require('../codeGenerator');
const { AstNodes } = require('../../constants');

describe('codeGenerator', () => {
	it('should turn individual nodes', () => {
		expect(
			codeGenerator({
				type: AstNodes.NUMBER_LITERAL,
				value: 2,
			}),
		).toBe('2');
		expect(
			codeGenerator({
				type: AstNodes.STRING_LITERAL,
				value: 'yosef',
			}),
		).toBe('"yosef"');
	});

	it('should turn string and number nodes inside expression statement', () => {
		expect(
			codeGenerator({
				type: AstNodes.EXPRESSION_STATEMENT,
				expression: {
					type: AstNodes.NUMBER_LITERAL,
					value: 2,
				},
			}),
		).toBe('2;');
		expect(
			codeGenerator({
				type: AstNodes.EXPRESSION_STATEMENT,
				expression: {
					type: AstNodes.STRING_LITERAL,
					value: 'yosef',
				},
			}),
		).toBe('"yosef";');
	});

	it('should turn function nodes (single argument)', () => {
		expect(
			codeGenerator({
				type: AstNodes.CALL_EXPRESSION,
				callee: {
					type: AstNodes.IDENTIFIER,
					name: 'add',
				},
				arguments: [
					{
						type: AstNodes.NUMBER_LITERAL,
						value: 2,
					},
				],
			}),
		).toBe('add(2)');
	});

	it('should turn function nodes (multiple argument)', () => {
		expect(
			codeGenerator({
				type: AstNodes.CALL_EXPRESSION,
				callee: {
					type: AstNodes.IDENTIFIER,
					name: 'add',
				},
				arguments: [
					{
						type: AstNodes.NUMBER_LITERAL,
						value: 2,
					},
					{
						type: AstNodes.NUMBER_LITERAL,
						value: 5,
					},
				],
			}),
		).toBe('add(2, 5)');
	});

	it('should turn function nodes recursively', () => {
		expect(
			codeGenerator({
				type: AstNodes.CALL_EXPRESSION,
				callee: {
					type: AstNodes.IDENTIFIER,
					name: 'add',
				},
				arguments: [
					{
						type: AstNodes.NUMBER_LITERAL,
						value: 2,
					},
					{
						type: AstNodes.CALL_EXPRESSION,
						callee: {
							type: AstNodes.IDENTIFIER,
							name: 'subtract',
						},
						arguments: [
							{
								type: AstNodes.NUMBER_LITERAL,
								value: 4,
							},
							{
								type: AstNodes.NUMBER_LITERAL,
								value: 2,
							},
						],
					},
				],
			}),
		).toBe('add(2, subtract(4, 2))');
	});

	it('should transform a whole abstract syntax tree with more than one expression statement', () => {
		expect(
			codeGenerator({
				type: AstNodes.PROGRAM,
				body: [
					{
						type: AstNodes.EXPRESSION_STATEMENT,
						expression: {
							type: AstNodes.CALL_EXPRESSION,
							callee: {
								type: AstNodes.IDENTIFIER,
								name: 'add',
							},
							arguments: [
								{
									type: AstNodes.NUMBER_LITERAL,
									value: 2,
								},
								{
									type: AstNodes.CALL_EXPRESSION,
									callee: {
										type: AstNodes.IDENTIFIER,
										name: 'subtract',
									},
									arguments: [
										{
											type: AstNodes.NUMBER_LITERAL,
											value: 4,
										},
										{
											type: AstNodes.NUMBER_LITERAL,
											value: 2,
										},
									],
								},
							],
						},
					},
					{
						type: AstNodes.EXPRESSION_STATEMENT,
						expression: {
							type: AstNodes.NUMBER_LITERAL,
							value: 2,
						},
					},
					{
						type: AstNodes.EXPRESSION_STATEMENT,
						expression: {
							type: AstNodes.STRING_LITERAL,
							value: 'yosef',
						},
					},
				],
			}),
		).toBe('add(2, subtract(4, 2));\n2;\n"yosef";');
	});
});
