import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { PoolClient, QueryResult } from 'pg';
import { connectPgClient } from './pg-client';

const readFile = promisify(fs.readFile);

export const install = async (pgConfig: any): Promise<any> => {
  try {
    const versioningFilepath = path.join(
      __dirname,
      '../../../',
      'vendor/versioning/install.versioning.sql'
    );

    const versioning = await readFile(versioningFilepath, 'utf8');

    const client = await connectPgClient(pgConfig);

    const doQuery = async (client: PoolClient): Promise<QueryResult> => {
      return client.query(versioning);
    };

    const results = await doQuery(client);

    await client.release();

    return results;
  } catch (error) {
    throw error;
  }
};
