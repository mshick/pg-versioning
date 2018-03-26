// tslint:disable:no-expression-statement
import path from 'path';
import { test } from 'ava';
import { performMigrations } from './migrations';

const migrationsDir = '../../../fixtures/migrations';

test('getABC', async t => {
  const migrationsPath = path.resolve(__dirname, migrationsDir);
  const applied = await performMigrations(
    'postgresql://postgres@localhost/db',
    migrationsPath
  );
  console.log(applied);
  t.pass();
});
