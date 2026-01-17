import 'dotenv/config';

// API
export const PORT = process.env.PORT || 4000;

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

// FRONT-END
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// DATABASE
export const USER_DB = process.env.USER_DB || 'root';
export const PASSWORD_DB = process.env.PASSWORD_DB || '';
export const HOST_DB = process.env.HOST_DB || 'localhost';
const PORT_DB = process.env.PORT_DB || 3306;
export const DATABASE = process.env.DATABASE || 'dbtiendasistemainventario';
export const MYSQL_URI = `mysql://${USER_DB}:${PASSWORD_DB}@${HOST_DB}:${PORT_DB}/${DATABASE}`;

// EMAIL
export const USEREMAIL = process.env.USEREMAIL;
export const USERPASSEMAIL = process.env.USERPASSEMAIL;