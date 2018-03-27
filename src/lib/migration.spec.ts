// tslint:disable:no-expression-statement
import path from 'path';
import { test } from 'ava';
import { up } from './migration';

const migrationsDir = '../../../fixtures/migrations';

test('getABC', async t => {
  const migrationsPath = path.resolve(__dirname, migrationsDir);
  const applied = await up(
    'postgresql://postgres@localhost/db',
    migrationsPath
  );
  console.log(applied);
  t.pass();
});
