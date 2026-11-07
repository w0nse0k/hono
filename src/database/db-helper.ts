import mariadb, {
  type Pool,
  type PoolConfig,
  type UpsertResult,
} from "mariadb";

const config: PoolConfig = {
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  connectionLimit: +process.env.DB_CONNECTION_LIMIT!,
};

const pool: Pool = mariadb.createPool(config);

await checkPool();
console.log("pool created.");

async function checkPool() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("select 1");
  } finally {
    if (conn) conn.release();
  }
}

export default {
  list: async <T>(sql: string, ...args: unknown[]) => {
    let conn;
    try {
      conn = await pool.getConnection();
      return await conn.execute<T[]>(sql, args);
    } finally {
      if (conn) conn.release();
    }
  },

  one: async <T>(sql: string, ...args: unknown[]) => {
    let conn;
    try {
      conn = await pool.getConnection();
      return (await conn.execute<T[]>(sql, args))[0];
    } finally {
      if (conn) conn.release();
    }
  },

  upsert: async (sql: string, ...args: unknown[]) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.execute<UpsertResult>(sql, args);
      return { ...result, insertId: Number(result.insertId) };
    } finally {
      if (conn) conn.release();
    }
  },
};
