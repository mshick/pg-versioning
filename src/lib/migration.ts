import { PoolClient, QueryResult } from 'pg';
import pMap from 'p-map';
import { connectPgClient } from './pg-client';
import { buildMigrationGraph, buildUpQueries } from './migration-utils';
import fp from './fp';
const { map, filter } = fp;

export interface MigrationResults {
  versions: string;
  results: string;
}

const doQuery = (client: PoolClient) => async (
  query: string
): Promise<QueryResult | Error | string> => {
  try {
    const results = await client.query(query);
    return results;
  } catch (error) {
    if ((error.code = 'P0001')) {
      // patch already applied
      return error.message;
    }

    throw error;
  }
};

export const up = async (
  pgConfig: any,
  dirpath: string,
  options: {
    version?: string;
  } = {}
): Promise<MigrationResults> => {
  let graph = buildMigrationGraph(dirpath);

  if (options.version) {
    graph = filter({ version: options.version }, graph);
  }

  const queries = buildUpQueries(graph);

  const client = await connectPgClient(pgConfig);

  const results = await pMap(queries, doQuery(client), {
    concurrency: 1
  });

  await client.release();

  const migrationResults = map();

  const versions = map('version', graph);

  return {
    versions,
    results
  };
};
