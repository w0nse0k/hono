import mariadb from "mariadb";
import type { Pool, PoolConfig } from "mariadb";

/* launch.json의 configuration에 "envFile": "${workspaceFolder}/.env"을 추가해서 .env 파일을 로드합니다.
 * .env 파일은 .gitignore에 등록해서 GitHub에 올리지 않아야 합니다.
 * connectionLimit는 개발 중에는 2개만 합니다.
 */
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

/** Connection Pool이 제대로 만들어졌는지 확인하는 함수 */
async function checkPool() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("select 1");
  } finally {
    if (conn) conn.release();
  }
}

export default pool;
