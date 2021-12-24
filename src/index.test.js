const { tokenizer } = require('.');

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
