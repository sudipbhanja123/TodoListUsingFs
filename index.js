const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      return res.render("index", { files: [] });
    }
    res.render("index", { files: files });
  });
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
    res.render("show", {
      filename: req.params.filename,
      filedata: filedata,
    });
  });
});

app.get("/edit/:filename", (req, res) => {
  res.render("edit", { filename: req.params.filename });
});

app.post("/create", (req, res) => {
  const title = req.body.title.split(" ").join("");
  const details = req.body.details;

  fs.writeFile(`./files/${title}.txt`, details, (err) => {
    if (err) {
      return res.status(500).send("Error saving the task.");
    }
    res.redirect("/");
  });
});

app.post("/edit", (req, res) => {
  fs.rename(
    `./files/${req.body.previous}`,
    `./files/${req.body.new}`,
    (err) => {
      res.redirect("/");
    }
  );
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
