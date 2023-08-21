import { configDotenv } from 'dotenv'
configDotenv()
export const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY
if (!R2_ACCESS_KEY) throw "no access key";

export const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
if (!R2_SECRET_ACCESS_KEY) throw "no secret access key";

export const R2_ENDPOINT = process.env.R2_ENDPOINT
if (!R2_ENDPOINT) throw "no endpoint";

export const R2_BUCKET = process.env.R2_BUCKET
if (!R2_BUCKET) throw "no bucket";