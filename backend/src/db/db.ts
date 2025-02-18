import { Pool as PoolClass } from "pg";
import "dotenv/config";

interface DatabaseConfig {
  connectionString: string;
  ssl: {
    rejectUnauthorized: boolean;
  };
}

interface QueryResult {
  rows: any[];
  error?: Error;
}

const DATABASE_URL: DatabaseConfig = {
  connectionString: process.env.DATABASE_URL || "",
  ssl: {
    rejectUnauthorized: false, // Required for cloud-hosted CockroachDB
  },
};
const pool = new PoolClass(DATABASE_URL);

export default async function query(
  queryText: string,
  params: any[] = []
): Promise<QueryResult> {
  try {
    const result = await pool.query(queryText, params);
    return { rows: result.rows };
  } catch (error) {
    return Promise.reject(error);
  }
}
