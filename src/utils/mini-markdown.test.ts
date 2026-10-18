import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBlocks, parseInline } from './mini-markdown.ts';

test('parses headings, paragraphs, lists and tables', () => {
  const blocks = parseBlocks(`### Title

First line
second line

1. one
2. two

- a
- b

| Action | Resets |
| --- | --- |
| Latch | yes |`);
  assert.deepEqual(blocks, [
    { type: 'heading', text: 'Title' },
    { type: 'paragraph', text: 'First line second line' },
    { type: 'list', ordered: true, items: ['one', 'two'] },
    { type: 'list', ordered: false, items: ['a', 'b'] },
    { type: 'table', header: ['Action', 'Resets'], rows: [['Latch', 'yes']] },
  ]);
});

test('inline parser handles bold, code, and leaves unclosed markers literal', () => {
  assert.deepEqual(parseInline('a **b** `c` d'), [
    { type: 'text', text: 'a ' },
    { type: 'bold', text: 'b' },
    { type: 'text', text: ' ' },
    { type: 'code', text: 'c' },
    { type: 'text', text: ' d' },
  ]);
  assert.deepEqual(parseInline('2 ** 3 and `x'), [{ type: 'text', text: '2 ** 3 and `x' }]);
});

test('markup characters in text are data, never HTML', () => {
  assert.deepEqual(parseInline('<script>alert(1)</script>'), [{ type: 'text', text: '<script>alert(1)</script>' }]);
});
