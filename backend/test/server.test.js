import assert from 'node:assert/strict';
import test from 'node:test';
import { app } from '../server.js';

const server = app.listen(0);

test('health endpoint responds', async (t) => {
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
});
