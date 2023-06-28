const { normalizeURL, getURLsFromHTML } = require('./crawl.js');
const { test, expect } = require('@jest/globals');

test('normalizeURl', () => {
  const input = 'https://blog.boot.dev/path';
  const actual = normalizeURL(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('normalizeURl trailing slashes', () => {
  const input = 'https://blog.boot.dev/path/';
  const actual = normalizeURL(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('normalizeURl capitalize', () => {
  const input = 'https://BLOG.boot.dev/path/';
  const actual = normalizeURL(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('normalizeURl http protocol', () => {
  const input = 'https://blog.boot.dev/path/';
  const actual = normalizeURL(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('getURLsFromHTML', () => {
  const inputHTML = `<body>
    <a href="https://blog.boot.dev/">Boot Dev </a>
</body>
</html>`;
  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTML, inputBaseURL);
  const expected = ['https://blog.boot.dev/'];
  expect(actual).toEqual(expected);
})
;

test('getURLsFromHTML absolute', () => {
  const inputHTML = `<body>
    <a href="https://blog.boot.dev/path/">Boot Dev </a>
</body>
</html>`;
  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTML, inputBaseURL);
  const expected = ['https://blog.boot.dev/path/'];
  expect(actual).toEqual(expected);
})
;

test('getURLsFromHTML relative', () => {
  const inputHTML = `<body>
    <a href="/path/">Boot Dev </a>
</body>
</html>`;
  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTML, inputBaseURL);
  const expected = ['https://blog.boot.dev/path/'];
  expect(actual).toEqual(expected);
})
;

test('getURLsFromHTML both and relative', () => {
  const inputHTML = `<body>
    <a href="https://blog.boot.dev/path1/">Boot Dev Path 1 </a>
    <a href="/path2/">Boot Dev Path 2 </a>
</body>
</html>`;
  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTML, inputBaseURL);
  const expected = ['https://blog.boot.dev/path1/', 'https://blog.boot.dev/path2/'];
  expect(actual).toEqual(expected);
})
;

test('getURLsFromHTML Invalid', () => {
  const inputHTML = `<body>
    <a href="invalid">Boot Dev Path 1 </a>
</body>
</html>`;
  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTML, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
})
;
