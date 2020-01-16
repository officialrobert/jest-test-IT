/**
 * On this supposed demo file, we introduce testing with Jest framework.
 * The framework at run-time interprets ES6 or beyond, hence to support modern testing methodologies
 */
import { sum } from './demo.js'; // notice the use of import/export(demo.js)

test('add 3 + 4 should equals 7', () => {
  expect(sum(3, 4)).toBe(7);
});
