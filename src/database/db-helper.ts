import type { UpsertResult } from "mariadb";
import pool from "./connection-pool.js";

export default {
  /** 목록 가져오기 */
  list: async <T>(sql: string, ...args: unknown[]) => {
    let conn;
    try {
      conn = await pool.getConnection();
      return await conn.execute<T[]>(sql, args);
    } finally {
      if (conn) conn.release();
    }
  },

  /** 1개 가져오기 */
  one: async <T>(sql: string, ...args: unknown[]) => {
    let conn;
    try {
      conn = await pool.getConnection();
      return (await conn.execute<T[]>(sql, args))[0];
    } finally {
      if (conn) conn.release();
    }
  },

  /** insert, update, delete 실행 */
  upsert: async (sql: string, ...args: unknown[]) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.execute<UpsertResult>(sql, args);
      // insertId를 bigint에서 number로 바꾼다.
      return { ...result, insertId: Number(result.insertId) };
    } finally {
      if (conn) conn.release();
    }
  },
};
