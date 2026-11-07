import type Book from "../types/book.js";
import db from "./db-helper.js";

/** 책 목록 */
export async function listBooks(size: number, page: number) {
  return await db.list<Book>(
    "select id, title, price, created_at from book limit ?,?",
    (page - 1) * size,
    size,
  );
}

/** 책 1권 */
export async function getBook(id: number) {
  return await db.one<Book>("select * from book where id=?", id);
}

/** 책 추가 */
export async function addBook(book: Book) {
  return await db.upsert(
    "insert book(title, price) values (?,?)",
    book.title,
    book.price,
  );
}

/** 책 수정 */
export async function updateBook(book: Book) {
  return await db.upsert(
    "update book set title=?, price=? where id=?",
    book.title,
    book.price,
    book.created_at,
  );
}

/** 책 삭제 */
export async function deleteBook(id: number) {
  return await db.upsert("delete from book where id=?", id);
}
