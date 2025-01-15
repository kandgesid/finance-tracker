import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

import * as schema from "./schema";

//const result = await db.execute('select 1');

const accounts = db.select().from(schema.accounts)
