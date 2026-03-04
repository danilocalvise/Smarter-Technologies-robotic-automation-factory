import http from "http";
import fs from "fs";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url || "/");
  let pathname = parsedUrl.pathname || "/";

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const filePath = path.join(__dirname, pathname);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || "text/plain; charset=utf-8";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = err.code === "ENOENT" ? 404 : 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end(err.code === "ENOENT" ? "Not found" : "Internal server error");
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    res.end(data);
  });
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Package Sorter UI running at http://localhost:${port}`);
});

