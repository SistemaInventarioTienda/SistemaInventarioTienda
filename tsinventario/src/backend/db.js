import { Sequelize } from "sequelize";
import { MYSQL_URI } from "./config.js";
const db = new Sequelize(MYSQL_URI, {
  // logging: false
});

export default db;
