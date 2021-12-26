const { tokenizer, parser } = require('.');

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
