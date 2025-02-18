import { Router, Request, Response, NextFunction } from "express";
import passport from "../passportConfig";

const router = Router();

// Route to handle login
router.get(
  "/github",
  passport.authenticate("github", { prompt: "select_account" }),
  (req, res) => {
    console.log("login successful");
  }
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    // On successful authentication, redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  }
);

router.get("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Logout failed");
    }
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Session destroy failed");
      }
      res.clearCookie("connect.sid");
      res.redirect(`${process.env.FRONTEND_URL}`);
    });
  });
});

export { router };
