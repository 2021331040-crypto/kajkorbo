import pkg from "pg";
const { Client } = pkg;

const database = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:xKcmcHvMsrsbIKwgGPnXrZWwaTuPnczk@postgres.railway.internal:5432/railway",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

try {
  await database.connect();
  console.log("Connected to the database successfully");
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

export default database;
