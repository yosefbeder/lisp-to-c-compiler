const transformer = require('../transformer');

describe('transformer', () => {
	it('should push a new expression statement to the new ast if the parent is body', () => {
		expect(
			transformer({
				type: 'Program',
				body: [
					{
						type: 'NumberLiteral',
						value: 2,
					},
				],
			}),
		).toEqual({
			type: 'Program',
			body: [
				{
					type: 'ExpressionStatement',
					expression: {
						type: 'NumberLiteral',
						value: 2,
					},
				},
			],
		});
	});

	it('should modify function expression', () => {
		expect(
			transformer({
				type: 'Program',
				body: [
					{
						type: 'CallExpression',
						name: 'add',
						params: [
							{
								type: 'NumberLiteral',
								value: 2,
							},
						],
					},
				],
			}),
		).toEqual({
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
						],
					},
				},
			],
		});
	});

	it('should work in a real world example', () => {
		expect(
			transformer({
				type: 'Program',
				body: [
					{
						type: 'CallExpression',
						name: 'add',
						params: [
							{
								type: 'NumberLiteral',
								value: 2,
							},
							{
								type: 'CallExpression',
								name: 'subtract',
								params: [
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
				],
			}),
		).toEqual({
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
			],
		});
	});
});
