import express from "express";
import query from "../db/db";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get("/", function (req, res, next) {
  const { major } = req.query;

  let queryPG = "SELECT major_id, major FROM majors";
  let values: any[] = [];

  if (major) {
    queryPG += " WHERE LOWER(major) LIKE '%' || LOWER($1) || '%'";
    values = [major];
  }
  query(queryPG, values)
    .then((results: any) => {
      res.json(results.rows);
    })
    .catch((error: Error) => {
      console.error(error);
      res.status(500).send("Error retrieving students");
    });
});

export { router };
