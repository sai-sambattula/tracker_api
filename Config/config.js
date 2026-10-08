import dotenv from "dotenv";

dotenv.config();

export const env = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    DO_SPACES_REGION: process.env.DO_SPACES_REGION,
    DO_SPACES_KEY: process.env.DO_SPACES_KEY,
    DO_SPACES_SECRET: process.env.DO_SPACES_SECRET,
    REDIS_HOST : process.env.REDIS_HOST,
    REDIS_PORT : process.env.REDIS_PORT,
    CLOUDFLARE_ACCOUNT_ID : process.env.CLOUDFLARE_ACCOUNT_ID,
    R2_ACCESS_KEY_ID : process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY : process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME : process.env.R2_BUCKET_NAME,
    STORAGE_TYPE:process.env.STORAGE_TYPE,
    STORAGE_BASE_URL : process.env.STORAGE_BASE_URL,
    BASE_URL: process.env.BASE_URL,
    AI_TOKEN : process.env.AI_TOKEN
}