const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";

const nextConfig = require("./next.config");
const app = next({ dev, dir: __dirname, conf: nextConfig });

const express = require("express");
const handle = app.getRequestHandler();
var path = require("path");

app
  .prepare()
  .then(() => {
    const server = express();

    server.get("/stop/:stop", async (req, res) => {
      const actualPage = "/";
      const queryParams = { stop: req.params.stop };
      app.render(req, res, actualPage, queryParams);
    });

    server.get("/favicon.ico", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/favicon.ico"));
    });

    server.get("/apple-touch-icon.png", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/apple-touch-icon.png"));
    });

    server.get("/favicon-32x32.png", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/favicon-32x32.png"));
    });

    server.get("/favicon-16x16.png", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/favicon-16x16.png"));
    });

    server.get("/site.webmanifest", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/site.webmanifest"));
    });

    server.get("/safari-pinned-tab.svg", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/safari-pinned-tab.svg"));
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on port 3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
