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

    server.get("/tailwind.css", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/tailwind.css"));
    })

    server.get("/android-chrome-192x192.png", (req, res) => {
      res.sendFile(
        path.join(__dirname, "/static", "/android-chrome-192x192.png")
      );
    });

    server.get("/android-chrome-512x512.png", (req, res) => {
      res.sendFile(
        path.join(__dirname, "/static", "/android-chrome-512x512.png")
      );
    });

    server.get("/browserconfig.xml", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/browserconfig.xml"));
    });

    server.get("/mstile-70x70.png", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/mstile-70x70.png"));
    });

    server.get("/mstile-144x144.png", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/mstile-144x144.png"));
    });
    server.get("/mstile-150x150.png", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/mstile-150x150.png"));
    });
    server.get("/mstile-310x150.png", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/mstile-310x150.png"));
    });
    server.get("/mstile-310x310.png", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/mstile-310x310.png"));
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

    server.get("/sw.js", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/serviceWorker.js"));
    });

    server.get("/manifest.json", (req, res) => {
      res.sendFile(path.join(__dirname, "/static", "/manifest.json"));
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
