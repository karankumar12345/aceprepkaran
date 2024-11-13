/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: "postgresql://neondb_owner:te6CavL9yuWB@ep-muddy-block-a5ge90gp.us-east-2.aws.neon.tech/neondb?sslmode=require",
    }
  };