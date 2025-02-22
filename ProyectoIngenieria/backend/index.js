import app from "./app.js";
import { PORT } from "./config.js";
// import db from "./db.js";

async function main() {
  try {
    // dbConecction();
    app.listen(PORT);
    console.log(`Listening on port http://localhost:${PORT}`);
    // console.log(`Environment: ${process.env.NODE_ENV}`)
  } catch (error) {
    console.error(error);

  } 
}

// async function dbConecction() {
//   try {
//     await db.authenticate();
//     console.log("Database online");

//   } catch (error) {
//     throw new Error ( error );
//   }
// }

main();
