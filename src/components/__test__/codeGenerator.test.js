const codeGenerator = require('../codeGenerator');

describe('codeGenerator', () => {
	it('should turn individual nodes', () => {
		expect(
			codeGenerator({
				type: 'NumberLiteral',
				value: 2,
			}),
		).toBe('2');
		expect(
			codeGenerator({
				type: 'StringLiteral',
				value: 'yosef',
			}),
		).toBe('"yosef"');
	});

	it('should turn string and number nodes inside expression statement', () => {
		expect(
			codeGenerator({
				type: 'ExpressionStatement',
				expression: {
					type: 'NumberLiteral',
					value: 2,
				},
			}),
		).toBe('2;');
		expect(
			codeGenerator({
				type: 'ExpressionStatement',
				expression: {
					type: 'StringLiteral',
					value: 'yosef',
				},
			}),
		).toBe('"yosef";');
	});

	it('should turn function nodes (single argument)', () => {
		expect(
			codeGenerator({
				type: 'CallExpression',
				callee: {
					type: 'Identifier',
					name: 'add',
				},
				arguments: [
					{
						type: 'NumberLiteral',
						value: 2,
					},
				],
			}),
		).toBe('add(2)');
	});

	it('should turn function nodes (multiple argument)', () => {
		expect(
			codeGenerator({
				type: 'CallExpression',
				callee: {
					type: 'Identifier',
					name: 'add',
				},
				arguments: [
					{
						type: 'NumberLiteral',
						value: 2,
					},
					{
						type: 'NumberLiteral',
						value: 5,
					},
				],
			}),
		).toBe('add(2, 5)');
	});

	it('should turn function nodes recursively', () => {
		expect(
			codeGenerator({
				type: 'CallExpression',
				callee: {
					type: 'Identifier',
					name: 'add',
				},
				arguments: [
					{
						type: 'NumberLiteral',
						value: 2,
					},
					{
						type: 'CallExpression',
						callee: {
							type: 'Identifier',
							name: 'subtract',
						},
						arguments: [
							{
								type: 'NumberLiteral',
								value: 4,
							},
							{
								type: 'NumberLiteral',
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
				type: 'Program',
				body: [
					{
						type: 'ExpressionStatement',
						expression: {
							type: 'CallExpression',
							callee: {
								type: 'Identifier',
								name: 'add',
							},
							arguments: [
								{
									type: 'NumberLiteral',
									value: 2,
								},
								{
									type: 'CallExpression',
									callee: {
										type: 'Identifier',
										name: 'subtract',
									},
									arguments: [
										{
											type: 'NumberLiteral',
											value: 4,
										},
										{
											type: 'NumberLiteral',
											value: 2,
										},
									],
								},
							],
						},
					},
					{
						type: 'ExpressionStatement',
						expression: {
							type: 'NumberLiteral',
							value: 2,
						},
					},
					{
						type: 'ExpressionStatement',
						expression: {
							type: 'StringLiteral',
							value: 'yosef',
						},
					},
				],
			}),
		).toBe('add(2, subtract(4, 2));\n2;\n"yosef";');
	});
});
