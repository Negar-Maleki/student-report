import express from "express";
import { isAuthenticated } from "../utilities";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get("/data", isAuthenticated, (req, res) => {
  res.json({ message: "Authorized", data: "Protected data" });
});

router.get("/user", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

export { router };
