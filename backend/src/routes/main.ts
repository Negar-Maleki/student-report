import express from "express";
import query from "../db/db";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/* GET home page. */
router.get("/home", (req, res, next) => {
  const pageNumber = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 5;

  const calculatedOffset = (pageNumber - 1) * pageSize;
  let queryPG = `SELECT * FROM students LIMIT $1 OFFSET $2`;
  const values = [pageSize, calculatedOffset];
  const totalQuery = `SELECT COUNT(*) FROM students`;

  query(totalQuery)
    .then((result: { rows: { count: number }[] }) => {
      const totalCount = result.rows[0].count;
      const totalPage = Math.ceil(totalCount / pageSize);
      return query(queryPG, values).then(
        (results: { rows: { count: number }[] }) => {
          res.json({
            results: results.rows,
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalPage: totalPage,
            totalCount: totalCount,
          });
        }
      );
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).send("Error retrieving students");
    });
});

export { router };
