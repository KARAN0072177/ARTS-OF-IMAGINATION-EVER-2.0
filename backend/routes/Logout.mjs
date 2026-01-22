import express from "express";

const router = express.Router();

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not destroy session" });
      }
      res.clearCookie("connect.sid"); // Remove session cookie
      return res.json({ message: "Logged out successfully" });
    });
  });
});

export default router;