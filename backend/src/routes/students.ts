import express from "express";
import query from "../db/db";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const { full_name: fullName } = req.query;
  let queryPG = "SELECT student_id, full_name FROM students";
  let values: any[] = [];

  if (fullName) {
    queryPG += " WHERE LOWER(full_name) LIKE '%' || LOWER($1) || '%'";
    values = [fullName];
  }

  try {
    const results = await query(queryPG, values);

    // Set response content type explicitly for clarity
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error);

    // Respond with a JSON error message
    res.status(500).json({
      message: "Error retrieving students",
    });
  }
});

router.get("/:id", function (req, res, next) {
  const studentId = req.params.id;

  query(
    " SELECT s.*, m.major FROM students s INNER JOIN majors m ON s.major_id = m.major_id WHERE s.student_id = $1;",
    [studentId]
  )
    .then((results: any) => {
      if (results.rowCount === 0) {
        res.status(404).send("Student not found");
      } else {
        res.json(results.rows[0]);
      }
    })
    .catch((error: Error) => {
      console.error(error);
      res.status(500).send("Error retrieving student");
    });
});

router.post("/", function (req, res, next) {
  const {
    full_name: fullName,
    major_id: majorId,
    date_of_birth: birthDate,
    gender,
    cohort_year: cohortYear,
  } = req.body;

  query(
    "INSERT INTO students (full_name, major_id, date_of_birth, gender, cohort_year) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
    [fullName, majorId, birthDate, gender, cohortYear]
  )
    .then((results: any) => {
      res.status(201).json({
        message: "Student created successfully",
        student: results.rows[0],
      });
    })
    .catch((error: Error) => {
      console.error(error);
      res.status(500).send("Error creating student");
    });
});

router.put("/", function (req, res, next) {
  const {
    student_id: studentId,
    full_name: fullName,
    major_id: majorId,
    date_of_birth: birthDate,
    gender,
    cohort_year: cohortYear,
  } = req.body;

  query(
    "UPDATE students SET full_name = $1, major_id = $2, date_of_birth=$3, gender=$4, cohort_year=$5 WHERE student_id = $6",
    [fullName, majorId, birthDate, gender, cohortYear, studentId]
  )
    .then((results: any) => {
      if (results.rowCount === 0) {
        res.status(404).send("Student not found");
      } else {
        res.status(201).json("Student updated successfully");
      }
    })
    .catch((error: Error) => {
      console.error(error);
      res.status(500).send("Error updating student");
    });
});

router.delete("/:id", function (req, res, next) {
  const studentId = req.params.id;
  query("DELETE FROM students WHERE student_id = $1", [studentId])
    .then((results: any) => {
      if (results.rowCount === 0) {
        res.status(404).send("Student not found");
      } else {
        res.json(`Student deleted with ID: ${studentId}`);
      }
    })
    .catch((error: Error) => {
      console.error(error);
      res.status(500).send("Error deleting student");
    });
});

export { router };
