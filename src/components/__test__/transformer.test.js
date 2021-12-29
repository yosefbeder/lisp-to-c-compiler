const transformer = require('../transformer');
const { AstNodes } = require('../../constants');

describe('transformer', () => {
	it('should push a new expression statement to the new ast if the parent is body', () => {
		expect(
			transformer({
				type: AstNodes.PROGRAM,
				body: [
					{
						type: AstNodes.NUMBER_LITERAL,
						value: 2,
					},
				],
			}),
		).toEqual({
			type: AstNodes.PROGRAM,
			body: [
				{
					type: AstNodes.EXPRESSION_STATEMENT,
					expression: {
						type: AstNodes.NUMBER_LITERAL,
						value: 2,
					},
				},
			],
		});
	});

	it('should modify function expression', () => {
		expect(
			transformer({
				type: AstNodes.PROGRAM,
				body: [
					{
						type: AstNodes.CALL_EXPRESSION,
						name: 'add',
						params: [
							{
								type: AstNodes.NUMBER_LITERAL,
								value: 2,
							},
						],
					},
				],
			}),
		).toEqual({
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
						],
					},
				},
			],
		});
	});

	it('should work in a real world example', () => {
		expect(
			transformer({
				type: AstNodes.PROGRAM,
				body: [
					{
						type: AstNodes.CALL_EXPRESSION,
						name: 'add',
						params: [
							{
								type: AstNodes.NUMBER_LITERAL,
								value: 2,
							},
							{
								type: AstNodes.CALL_EXPRESSION,
								name: 'subtract',
								params: [
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
				],
			}),
		).toEqual({
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
			],
		});
	});
});
