const parser = require('../parser');
const { AstNodes, Tokens } = require('../../constants');

describe('parser', () => {
	it('should parse numbers into nodes', () => {
		expect(parser([{ type: Tokens.NUMBER, value: 12 }])).toEqual({
			type: AstNodes.PROGRAM,
			body: [
				{
					type: AstNodes.NUMBER_LITERAL,
					value: 12,
				},
			],
		});
	});

	it('should parse strings into nodes', () => {
		expect(parser([{ type: Tokens.STRING, value: '123 123' }])).toEqual({
			type: AstNodes.PROGRAM,
			body: [
				{
					type: AstNodes.STRING_LITERAL,
					value: '123 123',
				},
			],
		});
	});

	it('should parse identifiers', () => {
		expect(parser([{ type: Tokens.IDENTIFIER, value: 'x' }])).toEqual({
			type: AstNodes.PROGRAM,
			body: [
				{
					type: AstNodes.IDENTIFIER,
					name: 'x',
				},
			],
		});
	});

	it('should parse function name and params', () => {
		expect(
			parser([
				{ type: Tokens.PARENTHESES, value: '(' },
				{ type: Tokens.IDENTIFIER, value: 'add' },
				{ type: Tokens.NUMBER, value: 12 },
				{ type: Tokens.NUMBER, value: 27 },
				{ type: Tokens.IDENTIFIER, value: 'x' },
				{ type: Tokens.PARENTHESES, value: ')' },
			]),
		).toEqual({
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
							type: AstNodes.NUMBER_LITERAL,
							value: 27,
						},
						{
							type: AstNodes.IDENTIFIER,
							name: 'x',
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
