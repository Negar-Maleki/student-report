import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file");

function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only!"));
  }
}

router.post("/", (req: Request, res: Response) => {
  console.log("File upload route");
  upload(req, res, (err) => {
    console.log(err.code);
    if (err) {
      return res.status(400).json(err);
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file selected!" });
    }
    res.json({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  });
});

export { router };
