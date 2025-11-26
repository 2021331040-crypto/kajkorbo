import pkg from "pg";
const { Pool } = pkg;

const database = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:xKcmcHvMsrsbIKwgGPnXrZWwaTuPnczk@postgres.railway.internal:5432/railway",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

database.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

database.on("connect", () => {
  console.log("Connected to the database successfully");
});

export default database;
