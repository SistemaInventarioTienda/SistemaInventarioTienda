import mysqldump from "mysqldump";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";
import { getDateCR } from "./date.js";
import { USER_DB, PASSWORD_DB, HOST_DB, DATABASE } from "../config.js";
import { sendBackupEmail } from "../utils/sendEmail.js";
import Config from "../models/config.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sqlDir = path.join(__dirname, "../backups");
if (!fs.existsSync(sqlDir)) {
  fs.mkdirSync(sqlDir, { recursive: true });
}
const date = await getDateCR();
const fileName = `backup_${date.replace(/[-:]/g, "").replace(" ", "")}.sql`;
const filePath = join(sqlDir, fileName);

async function backup() {
  await mysqldump({
    connection: {
      host: HOST_DB,
      user: USER_DB,
      password: PASSWORD_DB,
      database: DATABASE,
    },
    dumpToFile: filePath,
  });

  const store = await Config.findAll();
  const storeData = store.map((item) => item.toJSON())[0];
  // sendBackupEmail({
  //     to: storeData.DSC_CORREO,
  //     files: [{
  //         name: fileName,
  //         path: filePath,
  //         type: "application/sql"
  //     }]
  // });
}

backup();
