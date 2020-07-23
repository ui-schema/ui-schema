const {test, expect} = require('@jest/globals');

const {validatePattern} = require('../src/Validators/PatternValidator/PatternValidator');

test('validatePattern', async () => {
    expect(validatePattern('string', 'blabla', '^[bla]*$')).toBe(true);
    expect(validatePattern('string', 'wawawa', '^[bla]*$')).toBe(false);
    expect(validatePattern('string', 'wawawa', null)).toBe(true);
    expect(validatePattern('array', [], '^[bla]*$')).toBe(true);
    expect(validatePattern('array', [], null)).toBe(true);
});
