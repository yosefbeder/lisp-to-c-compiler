const compiler = require('..');

test('compiles from lisp syntax to c-like syntax', () => {
	const input = `
    (add 2 (subtract 4 2))
    4
    "yosef"
  `;

	const output = 'add(2, subtract(4, 2));\n4;\n"yosef";';

	expect(compiler(input)).toBe(output);
});
