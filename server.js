const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";

const nextConfig = require("./next.config");
const app = next({ dev, dir: __dirname, conf: nextConfig });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    //const { pathname, query } = parsedUrl

    handle(req, res, parsedUrl);
  }).listen(3000, err => {
    if (err) throw err;
    console.log("> Ready on port 3000");
  });
});
