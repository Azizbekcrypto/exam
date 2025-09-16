import * as dot from 'dotenv';

dot.config();

export const config = {
  PORT: Number(process.env.PORT),
  Node_env: process.env.NODE_ENV,

  DB: {
    url:
      String(process.env.NODE_ENV) === 'dev'
        ? String(process.env.DEV_DB_URL)
        : String(process.env.PROD_DB_URL),
    sync: String(process.env.NODE_ENV) === 'dev' ? true : false,
  },

  Token: {
    access_token_key: String(process.env.Access_Token_Key),
    access_token_time: process.env.Access_Token_Time,
    refresh_token_key: String(process.env.Refresh_Token_Key),
    refresh_token_time: String(process.env.Refresh_Token_Time),
  },

  SuperAdmin: {
    username: String(process.env.USER_NAME),
    fullName: String(process.env.FULL_NAME),
    password: String(process.env.PASSWORD),
  },
};
