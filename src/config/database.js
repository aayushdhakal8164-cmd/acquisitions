import "dotenv/config";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";


const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function waitForDatabase() {
  for (let i = 1; i <= 10; i++) {
    try {
      const result = await sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public';
      `;

      console.log("✅ Connected to Neon database");
      console.log(result);
      return;
    } catch (err) {
      console.log(`⏳ Waiting for database... (${i}/10)`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  throw new Error("❌ Database failed to start after 10 attempts.");
}

await waitForDatabase();

export { db, sql };