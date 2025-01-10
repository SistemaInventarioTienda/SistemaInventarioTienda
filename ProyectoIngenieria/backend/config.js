// API
export const PORT = process.env.PORT || 4000;

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

// FRONT-END
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// DATABASE
const user = process.env.USER_DB || 'root';
const password = process.env.PASSWORD_DB || '';
const host = process.env.HOST_DB || 'localhost';
const port = process.env.PORT_DB || 3306;
const database = process.env.DATABASE || 'dbtiendasistemainventario';
export const MYSQL_URI = `mysql://${user}:${password}@${host}:${port}/${database}`;