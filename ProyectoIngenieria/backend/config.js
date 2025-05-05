import 'dotenv/config';

// API
export const PORT = process.env.PORT || 4000;

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

// FRONT-END
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// DATABASE
const user = process.env.USER_DB || 'root';
const password = process.env.PASSWORD_DB || 'gRDAvfgNczUQkIUeRGYKSTYJlRRmKrcZ';
const host = process.env.HOST_DB || 'hopper.proxy.rlwy.net';
const port = process.env.PORT_DB || 43249;
const database = process.env.DATABASE || 'railway';
export const MYSQL_URI = `mysql://${user}:${password}@${host}:${port}/${database}`;

// EMAIL
export const USEREMAIL = process.env.USEREMAIL || 'root';
export const USERPASSEMAIL = process.env.USERPASSEMAIL || 'root';