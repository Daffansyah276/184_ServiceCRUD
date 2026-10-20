import express from "express";
import pg from "pg";

const app = express();
const port = 3000;
const { Pool } = pg;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mahasiswa",
  password: "1010",
  port: 5432,
});

// GET ALL
app.get("/biodata", (req, res) => {
  pool
    .query("SELECT * FROM biodata ORDER BY id ASC")
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Berhasil mengambil semua data biodata",
        data: result.rows,
      });
    })
});
