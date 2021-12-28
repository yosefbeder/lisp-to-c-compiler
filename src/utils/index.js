const isWhitespace = char => /\s/.test(char);

const isLetter = char => /[a-z]/i.test(char);

const isNumber = char => /[0-9]/.test(char);

const isParen = char => /\(|\)/.test(char);

module.exports = { isWhitespace, isLetter, isNumber, isParen };
