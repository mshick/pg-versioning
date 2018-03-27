import { PoolClient, Client, Pool } from 'pg';

export const connectPgClient = async (
  pgConfig: string | PoolClient | Pool
): Promise<any> => {
  let client;

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

    return client;
  } catch (error) {
    try {
      await client.release();
    } catch (e) {
      // Failed to release, assuming success
    }
  }
};
