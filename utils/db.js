import { neon } from '@neondatabase/serverless'; // Ensure correct package import
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'; // Import your schema

// Initialize Neon connection
const sql = neon("postgres://neondb_owner:te6CavL9yuWB@ep-muddy-block-a5ge90gp.us-east-2.aws.neon.tech/neondb?sslmode=require"); // Use the environment variable for database URL

// Initialize Drizzle ORM with the schema
export const db = drizzle(sql, { schema });
