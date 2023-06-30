const { sortPages } = require('./report');
const { test, expect } = require('@jest/globals');

test('sortPages multiple', () => {
  const input = {
    'https://blog.boot.dev/path/': 4,
    'https://blog.boot.dev/': 3,
    'https://blog.boot.dev/path10/': 5,
    'https://blog.boot.dev/path7/': 10,
    'https://blog.boot.dev/path3/': 9,
    'https://blog.boot.dev/path2/': 13
  };
  const actual = sortPages(input);
  const expected = [
    ['https://blog.boot.dev/path2/', 13],
    ['https://blog.boot.dev/path7/', 10],
    ['https://blog.boot.dev/path3/', 9],
    ['https://blog.boot.dev/path10/', 5],
    ['https://blog.boot.dev/path/', 4],
    ['https://blog.boot.dev/', 3]
  ];
  expect(actual).toEqual(expected);
});
