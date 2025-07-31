import fs from "fs";
import path from "path";

// get current directory
const __dirname = path.resolve();

const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  // if does not exist, copy `.env.example` to `.env`
  fs.copyFileSync(path.join(__dirname, ".env.example"), envPath);
}
