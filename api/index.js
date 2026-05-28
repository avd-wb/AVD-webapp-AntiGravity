import fs from "fs";
import path from "path";

let app = null;

function scanDir(dir, results = []) {
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        if (!file.startsWith(".") && file !== "node_modules") {
          scanDir(fullPath, results);
        }
      } else {
        results.push(fullPath);
      }
    });
  } catch (e) {
    results.push(`Error scanning ${dir}: ${e.message}`);
  }
  return results;
}

export default async function handler(req, res) {
  if (req.url.includes("/diagnose")) {
    const files = scanDir("/var/task");
    return res.status(200).json({
      cwd: process.cwd(),
      __dirname: typeof __dirname !== "undefined" ? __dirname : "undefined",
      files: files
    });
  }

  if (!app) {
    try {
      const serverModule = await import("../dist/server.cjs");
      app = serverModule.app;
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Failed to dynamically import compiled server.cjs at runtime",
        message: err.message,
        stack: err.stack
      });
    }
  }

  return app(req, res);
}
