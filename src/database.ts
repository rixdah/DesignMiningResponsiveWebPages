import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database("output/db.sqlite3")

export async function runInsertQuery(table: string, object: Record<string, string | number | undefined>): Promise<number> {
    return new Promise((resolve, reject) => {
      const cols = Object.keys(object).join(", ");
      const placeholders = Object.keys(object).fill("?").join(", ");
      db.run(
        `INSERT INTO ${table} (${cols}) VALUES (${placeholders});`,
        Object.values(object),
        function (err) {
          if (err) {
            console.log(err);
            reject([]);
          }
          resolve(this.lastID);
        }
      );
    });
  }