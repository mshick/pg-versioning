// tslint:disable:no-expression-statement
import { test } from 'ava';
import { install } from './install';

test('install', async t => {
  try {
    await install('postgresql://postgres@localhost/db');
    t.pass();
  } catch (error) {
    t.fail(error);
  }
});
