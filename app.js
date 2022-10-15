const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql")

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  database: "comment",
  user: "root",
  password: "",
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.post(`/api/upload`, upload.single("photo"), (req, res) => {
  // save filename nya ke database
  // return url ke user

  let finalImageURL =
    req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;

  res.json({ image: finalImageURL });
});

db.connect((err) => {
  /* if (err) throw err */

  app.get("/comment", (req, res) => {
      const sql = "SELECT * FROM kata"
      db.query(sql, (err, result) => {
          const comments = JSON.parse(JSON.stringify(result))
          res.json({comments: comments})
      }) 
 })
 app.post("/comment", (req, res) => {
  const insertsql = `INSERT INTO kata (comment, url) VALUES ('${req.comment}', '${req.url}');`
  db.query(insertsql, (err, result) => {
      if (err) throw err
      res.redirect("/");
  })
 }) 
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, (e) => {
  if (e) throw e;

  console.log(`Server is running on PORT : ${PORT}`);
});


