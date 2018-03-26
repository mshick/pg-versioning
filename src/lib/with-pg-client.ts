import { PoolClient, Client, Pool } from 'pg';

export const withPgClient = async (
  pgConfig: string | PoolClient | Pool,
  fn: (PoolClient) => void
): Promise<any> => {
  let client;
  let result;

  try {
    if (pgConfig instanceof Client) {
      client = pgConfig;
    } else if (pgConfig instanceof Pool) {
      const pgPool = pgConfig;
      client = await pgPool.connect();
    } else if (typeof pgConfig === 'string') {
      const pgPool = new Pool({
        connectionString: pgConfig
      });
      client = await pgPool.connect();
    } else {
      throw new Error('You must provide a valid client configuration');
    }

    result = await fn(client);
  } finally {
    try {
      await client.release();
    } catch (e) {
      // Failed to release, assuming success
    }
  }

  return result;
};
