import { test } from 'vitest';
import * as local from './local.js';

test('should create a registration object for a new user', async () => {
  const registration = await local.register({
    username: 'test',
    challenge: 'test',
    password: 'test',
  });

  console.log({ registration });
});
