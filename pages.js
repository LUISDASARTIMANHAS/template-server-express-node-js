const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const files = __dirname + "/src/";
const path_css = files + "css/";
const path_js = files + "js/";
const path_pages = files + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const indexFilePath = path.join(path_pages, "index.html");
const hostFilePath = path.join(path_pages, "host.html");

router.use(express.static(files));
console.log("LOAD STATIC ITENS: " + path_css);
console.log("LOAD STATIC ITENS: " + path_js);
console.log("LOAD STATIC ITENS: " + path_pages);

router.get("/", (req, res) => {
  console.log("SISTEMA <OBTER> <SITE>: " + req.url);
  res.sendFile(indexFilePath);
});

router.get("/host", (req, res) => {
  console.log("SISTEMA <OBTER> <SITE>: " + req.url);
  res.sendFile(hostFilePath);
});

router.get("/debugger", (req, res) => {
  console.log("SISTEMA <OBTER> <SITE>: " + req.url);
  res.status(200);
});

module.exports = router;
