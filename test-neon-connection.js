import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.development.local' });

const connectionString = process.env.NEON_DB_DATABASE_URL || process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env.development.local');
  process.exit(1);
}

const sql = neon(connectionString);

async function main() {
  try {
    console.log("Connection successful!");

    // Setup schema
    await sql`DROP TABLE IF EXISTS books;`;
    await sql`DROP TABLE IF EXISTS authors;`;
    await sql`
      CREATE TABLE authors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `;
    await sql`
      CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE
      );
    `;
    console.log("Schema created.");

    // --- Start Transaction ---
    console.log("\nTransaction started.");
    await sql.transaction([
      sql`INSERT INTO authors (name) VALUES ('George Orwell')`,
      sql`INSERT INTO books (title, author_id) SELECT '1984', id FROM authors WHERE name = 'George Orwell'`,
      sql`UPDATE books SET title = 'Nineteen Eighty-Four' WHERE author_id = (SELECT id FROM authors WHERE name = 'George Orwell')`,
      sql`DELETE FROM authors WHERE name = 'George Orwell'`,
    ]);
    console.log("Transaction executed: Author/Book created, updated, and deleted.");
    console.log("Transaction committed successfully.\n");

  } catch (err) {
    console.error("Database operation failed:", err);
  }
}

main();
