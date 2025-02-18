import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import passport from "./passportConfig";

import { router as indexRouter } from "./routes/main";
import { router as studentsRouter } from "./routes/students";
import { router as majorRouter } from "./routes/majors";
import { router as authRouter } from "./routes/auth";
import { router as uploadRouter } from "./routes/upload";
import { router as apiRouter } from "./routes/api";

const app = express();

app.use(helmet());
app.use(logger("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/students", studentsRouter);
app.use("/majors", majorRouter);
app.use("/upload", uploadRouter);
app.use("/api", apiRouter);
app.use("/test", (req, res) => {
  res.send("Test");
});

app.use(function (req, res, next) {
  next(createError(404));
});

interface CustomError extends Error {
  status?: number;
}

app.use(function (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.error(err);
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
