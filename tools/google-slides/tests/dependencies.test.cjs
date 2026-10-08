const assert = require('node:assert/strict');
const test = require('node:test');
const ms = require(process.env.MS_MODULE || 'ms');
const debug = require('debug');

test('duration parsing rejects oversized input before regexp evaluation', () => {
  assert.equal(ms('1'.repeat(101)), undefined);
  assert.equal(ms('1'.repeat(100000) + '!'), undefined);
});

test('normal debug duration formatting and namespace filtering remain supported', () => {
  assert.equal(ms('2 hours'), 7200000);
  assert.equal(ms(60000), '1m');
  debug.enable('slides:*,-slides:quiet');
  assert.equal(debug('slides:parse').enabled, true);
  assert.equal(debug('slides:quiet').enabled, false);
  debug.disable();
});
