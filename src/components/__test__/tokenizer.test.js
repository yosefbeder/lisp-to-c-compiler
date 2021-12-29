const tokenizer = require('../tokenizer');
const { Tokens } = require('../../constants');

describe('tokenizer', () => {
	it('should push parenteses', () => {
		expect(tokenizer('()')).toEqual([
			{ type: Tokens.PARENTHESES, value: '(' },
			{ type: Tokens.PARENTHESES, value: ')' },
		]);
	});

	it('should push identifiers', () => {
		expect(tokenizer('add')).toEqual([
			{ type: Tokens.IDENTIFIER, value: 'add' },
		]);
	});

	it('should push numbers', () => {
		expect(tokenizer('123')).toEqual([{ type: Tokens.NUMBER, value: 123 }]);
	});

	it('should push strings', () => {
		expect(tokenizer('"123 123"')).toEqual([
			{ type: Tokens.STRING, value: '123 123' },
		]);
	});

	it('should turn the input into a set of tokens', () => {
		expect(tokenizer('(add 12 27)')).toEqual([
			{ type: Tokens.PARENTHESES, value: '(' },
			{ type: Tokens.IDENTIFIER, value: 'add' },
			{ type: Tokens.NUMBER, value: 12 },
			{ type: Tokens.NUMBER, value: 27 },
			{ type: Tokens.PARENTHESES, value: ')' },
		]);
	});

	it("should panic whenever it finds a token that's not assigned into it", () => {
		expect(() => tokenizer('😀😀😀😀')).toThrow();
	});
});
