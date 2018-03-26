import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import { withPgClient } from './with-pg-client';

const readFile = promisify(fs.readFile);

export const install = async (pgConfig: any): Promise<void> => {
  try {
    const versioningFilepath = path.join(
      __dirname,
      '../../../',
      'vendor/versioning/install.versioning.sql'
    );

    const versioning = await readFile(versioningFilepath, 'utf8');

    await withPgClient(pgConfig, async (client: Client): Promise<void> => {
      client.query(versioning);
    });
  } catch (error) {
    throw error;
  }
};
