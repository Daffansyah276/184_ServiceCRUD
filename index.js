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
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    });
});

// POST (tambah data)
app.post("/biodata", (req, res) => {
  const { nama, nim, kelas } = req.body;

  pool
    .query(
      "INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *",
      [nama, nim, kelas],
    )
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Data biodata berhasil ditambahkan",
        data: result.rows[0],
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({
          success: false,
          message: "Internal Server Error / NIM mungkin sudah terdaftar",
        });
    });
});

// PUT (update data)
app.put("/biodata/:id", (req, res) => {
  const { id } = req.params;
  const { nama, nim, kelas } = req.body;

  pool
    .query(
      "UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *",
      [nama, nim, kelas, id],
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Data tidak ditemukan",
        });
      }
      res.status(200).json({
        success: true,
        message: "Data berhasil diupdate",
        data: result.rows[0],
      });
    })
    
});
