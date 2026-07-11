import express from "express";
import {
  signup,
  signin,
  profile,
  getAllUsers,
  deleteUser,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);

router.get("/profile", authenticate, profile);

router.post("/sign-out", (req, res) => {
  res.send("POST /api/auth/sign-out response");
});
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

export default router;
