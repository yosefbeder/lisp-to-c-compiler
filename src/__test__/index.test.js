const compiler = require('..');

test('compiles from lisp syntax to c-like syntax', () => {
	expect(compiler()).toBeUndefined();
});
