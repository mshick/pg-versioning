import { Client, QueryResult } from 'pg';
import { withPgClient } from './with-pg-client';
import { buildMigrationGraph, buildQueries } from './utils';
import fp from './fp';
const { map } = fp;

export const performMigrations = async (
  pgConfig: any,
  dirpath: string
): Promise<Array<string>> => {
  const graph = buildMigrationGraph(dirpath);

  const queries = buildQueries(graph);

  console.log(queries);

  const results = await withPgClient(pgConfig, async (client: Client): Promise<
    QueryResult
  > => {
    return client.query('SELECT NOW()');
  });

  console.log(results);

  // execute queries

  return map('version', graph);
};
