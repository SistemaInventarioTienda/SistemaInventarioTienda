import { Sequelize } from "sequelize";
import { MYSQL_URI } from "./config.js";
const db = new Sequelize(MYSQL_URI, {
  // logging: false
  timezone: '-06:00'
});

export default db;
