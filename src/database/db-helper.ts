import type { UpsertResult } from "mariadb";
import pool from "./connection-pool.js";

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
      // insertId를 bigint에서 number로 바꾼다.
      return { ...result, insertId: Number(result.insertId) };
    } finally {
      if (conn) conn.release();
    }
  },
};
