import { server } from "./app.js";
import { PORT } from "./config.js";
import "./libs/backup.js";
// import db from "./db.js";

async function main() {
  try {
    // dbConecction();
    server.listen(PORT);

  } catch (error) {
    console.error(error);

  } 
}

main();
